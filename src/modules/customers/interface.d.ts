import { IAttribute } from '../settings/interface'

interface IAttributeValue {
  id: number
  attributeable_id: number
  attribute_id: number
  value: string
  created_at: Date
  updated_at: Date,
}

export interface ICustomerAttribute extends IAttribute {
  attribute_values: IAttributeValue[]
}

export interface ICustomer {
  id?: number,
  created_by: number,
  attributes: ICustomerAttribute[],
  created_at?: string,
  updated_at?: string,
}
