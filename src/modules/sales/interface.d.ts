export interface ISale {
  id?: number,
  name?: string,
  email?: string,
  user_id?: number,
  allowed_assign_lead: number | boolean,
  current_lead_assigned?: number,
  created_at?: string,
  updated_at?: string
}
