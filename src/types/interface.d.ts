export interface IMenu {
  name: string
  to: string | object
  class?: string
  hasPermission?: boolean
  isDropdown?: boolean
  subItems?: Array<{ name: string, to: string | object, hasPermission?: boolean }>,
  listRouteNameNeedActive?: string[],
  isSubItem?: boolean,
  isSubItemName?: string,
}

export interface IBreadcrumb {
  active?: boolean
  'active-class'?: string
  append?: boolean
  'aria-current'?: string
  disabled?: boolean
  exact?: boolean
  'exact-active-class'?: string
  href?: string
  html?: string
  'no-prefetch'?: boolean
  rel?: string
  replace?: boolean
  'router-tag'?: string
  target?: string
  text: string
  to?: string | object
}

export interface ITableField {
  key: string
  label?: string
  headerTitle?: string
  headerAbbr?: string
  class?: string
  formatter?: string
  sortable?: boolean
  sortDirection?: string
  sortByFormatted?: boolean
  filterByFormatted?: boolean
  tdClass?: string
  thClass?: string
  thStyle?: object
  variant?: string
  tdAttr?: object
  thAttr?: object
  isRowHeader?: boolean
  stickyColumn?: boolean
  attributeId?: number,
  isHiddenFilter?: boolean,
  sortOrder?: number
}

export interface IResponse {
  data: object | Array<string | number | object>
  meta: {
    pagination: {
      total: number
      count: number
      per_page: number
      current_page: number
      total_pages: number
      links: object,
    },
  }
  code: number
  success: boolean
}
