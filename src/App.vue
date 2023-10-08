<script setup lang="ts">
import { FilterFilled, FilterOutlined } from '@ant-design/icons-vue'
import type { FormState, Product } from '@/types'
import { type Ref, ref } from 'vue'
import Draggable from 'vuedraggable'

const isFiltered = ref<boolean>(false)
const open = ref<boolean>(false)

const unprocessedColumn = ref<Product[]>([])
const inProgressColumn = ref<Product[]>([])
const doneColumn = ref<Product[]>([])

const toggleFilter = () => {
  isFiltered.value = !isFiltered.value
  if (isFiltered.value) {
    doneColumn.value.sort((a, b) => b.rating.rate - a.rating.rate)
  } else {
    doneColumn.value.sort((a, b) => a.id - b.id)
  }
}

const addProduct = (product: FormState) => {
  const newProduct: Product = {
    id: unprocessedColumn.value.length + 1,
    title: product.title,
    description: product.description,
    category: product.category,
    rating: product.rating,
    price: product.price
  }
  unprocessedColumn.value.push(newProduct)
  closeModal()
}

const removeProduct = (product: Product) => {
  const removeFromColumn = (column: Ref<Product[]>) => {
    const index = column.value.findIndex((p) => p.id === product.id)
    if (index !== -1) {
      column.value.splice(index, 1)
    }
  }
  removeFromColumn(unprocessedColumn)
  removeFromColumn(inProgressColumn)
  removeFromColumn(doneColumn)
}

const moveToInProgress = (productId: number) => {
  const productIndex = unprocessedColumn.value.findIndex((product) => product.id === productId)
  if (productIndex !== -1) {
    inProgressColumn.value.push(unprocessedColumn.value[productIndex])
    unprocessedColumn.value.splice(productIndex, 1)
  }
}

const isInProductData = (product: Product) => {
  return unprocessedColumn.value.includes(product)
}

const showModal = () => {
  open.value = true
}

const closeModal = () => {
  open.value = false
}

const getProducts = async () => {
  const response = await fetch('https://fakestoreapi.com/products')
  unprocessedColumn.value = await response.json()
}

getProducts()
</script>

<template>
  <a-layout :style="{ background: '#fff' }">
    <a-layout-header :style="{ background: '#fff' }">
      <a-button size="small" type="primary" style="margin-left: 30px" @click="showModal">
        Создать карточку
      </a-button>
    </a-layout-header>
    <a-layout-content :style="{ padding: '0 50px' }">
      <div :style="{ padding: '24px', minHeight: '280px' }">
        <div class="container">
          <a-col class="gutter-row" :span="1">
            <div class="unprocessed-container">
              <div class="gutter-box unprocessed">
                Необработанные
                {{ unprocessedColumn.length !== 0 ? unprocessedColumn.length : null }}
              </div>
              <draggable
                v-model="unprocessedColumn"
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
              </draggable>
            </div>
          </a-col>

          <a-col class="gutter-row" :span="1">
            <div class="in-progress-container">
              <div class="gutter-box in-progress">
                В работе {{ inProgressColumn.length !== 0 ? inProgressColumn.length : null }}
              </div>
              <draggable
                v-model="inProgressColumn"
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
              </draggable>
            </div>
          </a-col>

          <a-col class="gutter-row" :span="1">
            <div class="done-container">
              <div class="gutter-box done">
                Завершенные {{ doneColumn.length !== 0 ? doneColumn.length : null }}
                <filter-outlined v-if="!isFiltered" @click="toggleFilter" />
                <filter-filled v-else @click="toggleFilter" />
              </div>
              <draggable
                v-model="doneColumn"
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
              </draggable>
            </div>
          </a-col>
        </div>
        <ProductFormModal v-model:open="open" @add-product="addProduct" />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<style scoped lang="scss">
.container {
  display: flex;
}
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
  min-width: 340px;
}

.gutter-box {
  padding: 0 20px;
  border-radius: 10px;
  text-align: left;
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.product-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 340px;
}
.unprocessed-container {
  width: 340px;
  display: flex;
  flex-direction: column;
  align-items: left;
  background-color: #55a1ff;
  border-radius: 10px;
  padding-bottom: 10px;
}

.in-progress-container {
  width: 340px;
  display: flex;
  flex-direction: column;
  align-items: left;
  background-color: #ffea6f;
  border-radius: 10px;
  padding-bottom: 10px;
}

.done-container {
  width: 340px;
  display: flex;
  flex-direction: column;
  align-items: left;
  background-color: #ff6d6d;
  border-radius: 10px;
  padding-bottom: 10px;
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
