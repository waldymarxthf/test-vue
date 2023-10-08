export interface Product {
  id: number
  title: string
  description: string
  image?: string
  category: string
  rating: {
    rate: number
    count: number
  }
  price: number
}

export interface Column {
  id: string
  title: string
  product: Product[]
}

export interface FormState {
  title: string
  description: string
  category: string
  rating: {
    rate: number
    count: number
  }
  price: number
}
