<script setup lang="ts">
import { ref } from 'vue'
import type { FormState } from '@/types'
import Draggable from 'vuedraggable'
import { FilterOutlined, FilterFilled } from '@ant-design/icons-vue'

import type { Product } from './types'
const open = ref<boolean>(false)

const productData = ref<Product[]>([])
const inProgressData = ref<Product[]>([])
const doneData = ref<Product[]>([])

const isFiltered = ref<boolean>(false)

const toggleFilter = () => {
  isFiltered.value = !isFiltered.value
  if (isFiltered.value) {
    doneData.value.sort((a, b) => b.rating.rate - a.rating.rate)
  } else {
    doneData.value.sort((a, b) => a.id - b.id)
  }
}

const addProduct = (product: FormState) => {
  const newProduct: Product = {
    id: productData.value.length + 1,
    title: product.title,
    description: product.description,
    category: product.category,
    rating: product.rating,
    price: product.price
  }
  productData.value.push(newProduct)
  open.value = false
}

const removeProduct = (product: Product) => {
  const indexInProductData = productData.value.findIndex((p) => p.id === product.id)
  const indexInProgressData = inProgressData.value.findIndex((p) => p.id === product.id)
  const indexInDoneData = doneData.value.findIndex((p) => p.id === product.id)

  if (indexInProductData !== -1) {
    productData.value.splice(indexInProductData, 1)
  } else if (indexInProgressData !== -1) {
    inProgressData.value.splice(indexInProgressData, 1)
  } else if (indexInDoneData !== -1) {
    doneData.value.splice(indexInDoneData, 1)
  }
}

const moveToInProgress = (productId: number) => {
  const productIndex = productData.value.findIndex((product) => product.id === productId)
  if (productIndex !== -1) {
    inProgressData.value.push(productData.value[productIndex])
    productData.value.splice(productIndex, 1)
  }
}

const isInProductData = (product: Product) => {
  return productData.value.includes(product)
}

const showModal = () => {
  open.value = true
}

async function getProducts() {
  const response = await fetch('https://fakestoreapi.com/products')
  productData.value = await response.json()
}

getProducts()
</script>

<template>
  <a-layout :style="{ background: '#fff' }">
    <a-layout-header :style="{ background: '#fff' }">
      <a-button size="small" type="primary" style="margin-left: 30px" @click="showModal"
        >Создать карточку</a-button
      >
    </a-layout-header>
    <a-layout-content :style="{ padding: '0 50px' }">
      <div :style="{ padding: '24px', minHeight: '280px' }">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="6">
            <div class="unprocessed-container">
              <div class="gutter-box unprocessed">
                Необработанные {{ productData.length !== 0 ? productData.length : null }}
              </div>
              <Draggable
                v-model="productData"
                class="product-list"
                group="products"
                tag="div"
                item-key="id"
                ghost-class="ghost"
                drag-class="drag"
                :force-fallback="true"
                :scroll-sensitivity="250"
              >
                <template #item="{ element }">
                  <ProductCard
                    :product="element"
                    :show-button="isInProductData(element)"
                    @move-to-in-progress="moveToInProgress"
                    @remove="removeProduct"
                  />
                </template>
              </Draggable>
            </div>
          </a-col>

          <a-col class="gutter-row" :span="6">
            <div class="in-progress-container">
              <div class="gutter-box in-progress">
                В работе {{ inProgressData.length !== 0 ? inProgressData.length : null }}
              </div>
              <Draggable
                v-model="inProgressData"
                class="product-list"
                group="products"
                tag="div"
                item-key="id"
                ghost-class="ghost"
                drag-class="drag"
                :force-fallback="true"
                :scroll-sensitivity="250"
              >
                <template #item="{ element }">
                  <ProductCard
                    :product="element"
                    :show-button="isInProductData(element)"
                    @remove="removeProduct"
                  />
                </template>
              </Draggable>
            </div>
          </a-col>

          <a-col class="gutter-row" :span="6">
            <div class="done-container">
              <div class="gutter-box done">
                Завершенные {{ doneData.length !== 0 ? doneData.length : null }}
                <filter-outlined v-if="!isFiltered" @click="toggleFilter" />
                <filter-filled v-else @click="toggleFilter" />
              </div>
              <Draggable
                v-model="doneData"
                class="product-list"
                group="products"
                tag="div"
                item-key="id"
                ghost-class="ghost"
                drag-class="drag"
                :force-fallback="true"
                :scroll-sensitivity="250"
              >
                <template #item="{ element }">
                  <ProductCard
                    :product="element"
                    :show-button="isInProductData(element)"
                    @remove="removeProduct"
                  />
                </template>
              </Draggable>
            </div>
          </a-col>
        </a-row>
        <ProductFormModal :open="open" @update:open="open = $event" @add-product="addProduct" />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<style scoped lang="scss">
.drag {
  transform: rotate(5deg);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  opacity: 0.8;
}
.ghost {
  opacity: 0.5;
  border: 2px dashed #aaa;
}
.gutter-row {
  margin: 0 10px;
  max-width: 360px;
}

.product-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.unprocessed-container {
  display: flex;
  flex-direction: column;
  align-items: left;
  background-color: #55a1ff;
  border-radius: 10px;
  padding-bottom: 10px;
}

.in-progress-container {
  display: flex;
  flex-direction: column;
  align-items: left;
  background-color: #ffea6f;
  border-radius: 10px;
  padding-bottom: 10px;
}

.done-container {
  display: flex;
  flex-direction: column;
  align-items: left;
  background-color: #ff6d6d;
  border-radius: 10px;
  padding-bottom: 10px;
}

.gutter-box {
  padding: 0 20px;
  border-radius: 10px;
  text-align: left;
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.unprocessed {
  background-color: #55a1ff;
}

.in-progress {
  background-color: #ffea6f;
}

.done {
  background-color: #ff6d6d;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
