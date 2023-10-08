<script setup lang="ts">
import type { FormState } from '@/types'
import { Form, Upload, message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { reactive } from 'vue'

const { open } = defineProps<{ open: boolean }>()
const emit = defineEmits(['add-product', 'update:open'])

const useForm = Form.useForm

const formState = reactive<FormState>({
  title: '',
  description: '',
  category: '',
  rating: { rate: 0, count: 0 },
  price: 0
})

const rulesRef = reactive({
  title: [
    {
      required: true,
      message: 'Пожалуйста введите заголовок'
    }
  ],
  description: [
    {
      required: true,
      message: 'Пожалуйста введите описание'
    }
  ],
  category: [
    {
      required: true,
      message: 'Пожалуйста введите категорию'
    }
  ],
  rating: [
    {
      required: true,
      message: 'Пожалуйста введите оценку'
    }
  ],
  price: [
    {
      required: true,
      message: 'Пожалуйста введите цену',
      type: 'number'
    }
  ]
})

const { validate, validateInfos, resetFields } = useForm(formState, rulesRef)

const close = () => {
  emit('update:open', false)
}

const addProduct = (formState: FormState) => {
  emit('add-product', formState)
}

const handleOk = async () => {
  const valid = await validate()
  if (valid) {
    emit('add-product', formState)
    close()
    resetFields()
    message.success('Карточка успешно создана')
  }
}

const handleFileUpload = (file: File) => {
  console.log(file)
}

const beforeUpload = (file: File) => {
  const isPNG = file.type === 'image/png'
  if (!isPNG) {
    message.error(`${file.name} is not a png file`)
  }
  return isPNG || Upload.LIST_IGNORE
}
</script>

<template>
  <a-modal
    :open="open"
    title="Создать карточку"
    :ok-text="'Создать'"
    @ok="handleOk"
    @cancel="close"
  >
    <a-form
      :model="formState"
      name="basic"
      :wrapper-col="{ span: 16 }"
      :label-col="{ style: { width: '100px' } }"
      autocomplete="off"
      @finish="addProduct"
    >
      <a-form-item label="Заголовок" name="title" v-bind="validateInfos.title">
        <a-input v-model:value="formState.title" />
      </a-form-item>

      <a-form-item label="Описание" name="description" v-bind="validateInfos.description">
        <a-input v-model:value="formState.description" />
      </a-form-item>

      <a-form-item label="Категория" name="category" v-bind="validateInfos.category">
        <a-input v-model:value="formState.category" />
      </a-form-item>

      <a-form-item label="Оценка" name="rating" v-bind="validateInfos.rating">
        <a-input-number v-model:value="formState.rating.rate" />
      </a-form-item>

      <a-form-item label="Цена" name="price" v-bind="validateInfos.price">
        <a-input-number v-model:value="formState.price" />
      </a-form-item>

      <a-form-item name="upload" label="Upload">
        <a-upload
          name="logo"
          list-type="picture"
          :custom-request="handleFileUpload"
          :before-upload="beforeUpload"
        >
          <a-button>
            <template #icon><UploadOutlined /></template>
            Click to upload
          </a-button>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
