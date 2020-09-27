import { IAttribute } from '../settings/interface'

interface IAttributeValue {
  id: number
  attributeable_id: number
  attribute_id: number
  value: string
  created_at: Date
  updated_at: Date,
}

export interface IDealAttribute extends IAttribute {
  attribute_values: IAttributeValue[]
}

export interface IDeal {
  id?: number,
  created_by: number,
  attributes: IDealAttribute[],
  products: Array<{}>,
  workflow_id?: number,
  created_at?: string,
  updated_at?: string,
}
export interface IDealActionHistory {
  id?: number,
  deal_id?: number,
  user_id?: number,
  workflow_id?: number,
  action_id?: number,
  action_result_id?: number,
  lead_type_id?: number,
  stage_id?: number,
  next_action_id?: number,
  next_action_time?: number,
  next_action_timetype?: number,
  created_at?: string,
  updated_at?: string,
  note: string,
}

export interface IDealWorkflow {
  id?: number,
  name: string,
  deal_action_flows?: Array<{}>,
  created_at?: string,
  updated_at?: string,
}
export interface IDealAction {
  id?: number,
  name: string,
  created_at?: string,
  updated_at?: string,
}

export interface IDealActionResult {
  id?: number,
  name: string,
  created_at?: string,
  updated_at?: string,
}

export interface IDealActionFlow {
  id?: number,
  workflow_id?: number,
  action_id?: number,
  action_result_id?: number,
  lead_type_id?: number,
  stage_id?: number,
  status_code?: number,
  next_action_id?: number,
  next_action_time?: number,
  next_action_timetype?: number,
  created_at?: string,
  updated_at?: string,
}

export interface IDealStage {
  id?: number,
  name: string,
  created_at?: string,
  updated_at?: string,
}
export interface IDealLeadType {
  id?: number,
  name: string,
  created_at?: string,
  updated_at?: string,
}
export interface IDealStatus {
  id?: number,
  name: string,
  created_at?: string,
  updated_at?: string,
}

export interface IDealPaymentHistory {
  id?: number,
  deal_id?: number,
  user_id?: number,
  code?: string,
  payment_method?: number,
  payment_amount?: number,
  payment_datetime?: Date,
  voucher?: string,
  created_at?: string,
  updated_at?: string,
  note: string,
}
