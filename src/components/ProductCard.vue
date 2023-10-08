<script setup lang="ts">
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import { computed, ref, watch } from 'vue'
import { Empty } from 'ant-design-vue'
import type { Product } from '@/types'
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

const props = defineProps<{
  product: Product
  showButton: boolean
}>()

const product = ref(props.product)
const isEditing = ref<boolean>(false)
const ratingString = ref(String(product.value.rating.rate))
const priceString = ref(String(product.value.price))

const emits = defineEmits(['moveToInProgress', 'remove'])

watch(ratingString, (newVal) => {
  product.value.rating.rate = Number(newVal)
})

watch(priceString, (newVal) => {
  product.value.price = Number(newVal)
})

const editableOptions = computed(() => {
  return isEditing.value && { triggerType: 'icon' }
})

const toggleEditing = () => {
  isEditing.value = !isEditing.value
}

const moveToInProgress = () => {
  emits('moveToInProgress', product.value.id)
}

const remove = () => {
  emits('remove', props.product)
}
</script>

<template>
  <a-card size="small" hoverable class="task-card" style="width: 300px">
    <template #cover>
      <img v-if="product.image" :alt="product.title" :src="product.image" class="card-img" />
      <a-empty v-else :image="simpleImage" />
    </template>
    <div class="card-desc">
      <a-typography-title
        v-model:content="product.title"
        :level="5"
        :ellipsis="!isEditing"
        :editable="editableOptions"
      />
      <a-typography-text
        v-model:content="product.description"
        :ellipsis="!isEditing"
        :editable="editableOptions"
      />
      <a-typography-text strong>
        Категория:
        <a-typography-text v-model:content="product.category" :editable="editableOptions" />
      </a-typography-text>
      <div>
        <a-typography-text strong>
          Оценка:
          <a-typography-text v-model:content="ratingString" :editable="editableOptions" />
        </a-typography-text>
      </div>
      <a-typography-text strong>
        Цена:
        <a-typography-text v-model:content="priceString" :editable="editableOptions" />
      </a-typography-text>
    </div>
    <template #actions>
      <edit-outlined key="edit" @click="toggleEditing" />
      <a-button v-if="props.showButton" size="small" type="primary" @click="moveToInProgress"
        >Взять в работу</a-button
      >
      <delete-outlined key="ellipsis" @click="remove" />
    </template>
  </a-card>
</template>

<style scoped lang="scss">
.task-card {
  margin-bottom: 10px;
}

.card-img {
  width: 20%;
  object-fit: cover;
  margin: 5px auto;
}

.card-desc {
  display: flex;
  flex-direction: column;
}
</style>
