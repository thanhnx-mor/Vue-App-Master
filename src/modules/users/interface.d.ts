export interface IUser {
  id: number,
  name: string,
  email: string,
  password?: string,
  status_code: number,
  roles: [],
  permissions?: string[],
  created_at?: string,
  updated_at?: string
}
