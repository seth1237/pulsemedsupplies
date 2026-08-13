/** Raw product shape from the ERP public catalog API */
export interface ErpProductRaw {
  _id?: string
  id?: string
  productId?: string
  name?: string
  productName?: string
  description?: string
  category?: string
  categoryName?: string
  sellingPrice?: number
  startingPrice?: number
  productType?: string
  unit?: string
  manufacturer?: string
  imageUrl?: string
  image?: string
  isActive?: boolean
  currentQuantity?: number
}

export interface ErpCategoryRaw {
  _id?: string
  id?: string
  name?: string
  description?: string
}

export interface ErpListResponse<T> {
  success?: boolean
  data?: T
  message?: string
}
