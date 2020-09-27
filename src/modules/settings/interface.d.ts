export interface IAttribute {
  id: number,
  name: string,
  slug: string,
  attribute_options: IAttributeOptions[]
  attribute_input_type_id: number,
  is_required: number | boolean,
  is_unique: number | boolean,
  is_enabled: number | boolean,
  is_default?: number,
  created_at?: string,
  updated_at?: string
}

export interface IAttributeOptions {
  id: number | null
  attribute_id: number
  name: string
  sort_order: number
  created_at: Date
  updated_at: Date
}

export interface IAttributeInputType {
  id: number,
  name: string,
  created_at?: string,
  updated_at?: string
}

