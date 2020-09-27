import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { debounce } from 'lodash'
import XLSX from 'xlsx'
import moment from 'moment'
import { GET_CUSTOMER_ATTRIBUTES } from '../../type'
import { IAttribute } from '@/modules/settings/interface'
import { IBreadcrumb, ITableField } from '@/types/interface'
import { ICustomer } from '../../interface'
import { InputType } from '@/types/enum'
import { IUser } from '@/modules/users/interface'
import Create from '../../components/create/Create.vue'
import CustomerApi from '@/services/CustomerApi'
import Delete from '../../components/delete/Delete.vue'
import filters from '@/utils/filters'
import Mixins from '@/mixins'
import NoResults from '@/components/noResults/NoResults.vue'
import FilterAttribute from '@/components/filterAttribute/FilterAttribute.vue'
import EventBus from '@/event-bus'
import { OK } from '@/types/const'

@Component({
  components: {
    Create,
    Delete,
    NoResults,
    FilterAttribute,
  },
  computed: {
    ...mapGetters(['customerAttributes', 'allUsers']),
  },
})

export default class CustomerList extends Mixins {
  protected breadcrumbItems: IBreadcrumb[] = [{
    text: 'Trang chủ',
    to: '/',
  }, {
    text: 'Khách hàng',
    active: true,
  }]
  protected allUsers!: IUser[]
  protected currentPage!: number
  protected customerAttributes!: IAttribute[]
  protected fields: ITableField[] = []
  protected fieldsExport: { [key: string]: any } = {}
  protected isLoading: boolean = true
  protected isLoadingRemove = false
  protected isLoadingExport = false
  protected items: ICustomer[] = []
  protected perPage!: number
  protected queryParams!: object
  protected searchKey: string = ''
  protected total: number = 0
  protected totalPage!: number
  protected filter: { [key: string]: any } = {}
  protected showFilter: boolean = false
  protected maxRowExport: number = 1000
  protected progress: number = 0
  protected highlightAction: boolean = false
  private customerApi: CustomerApi
  private debounces = debounce(() => this.setQueryUrl(), 8000)

  constructor() {
    super()
    this.customerApi = new CustomerApi()
  }

  public destroyed() {
    EventBus.$off('showFilter')
  }

  protected get hasFilter() {
    if (this.searchKey || Object.keys(this.filter).length) {
      return true
    }
    return false
  }

  protected toggleHighlightAction() {
    this.highlightAction = !this.highlightAction
    this.$nextTick(() => {
      this.$forceUpdate()
    })
  }

  protected onDelete(customer: any) {
    const { deleteModal } = this.$refs as any
    deleteModal.name = customer.ten_kh
    deleteModal.id = customer.id
    this.$bvModal.show('customerDeleteModal')
  }

  protected onChange(page: number) {
    if (page === this.currentPage) {
      return
    }
    this.currentPage = page
    this.setQueryUrl({ page })
  }

  protected onRefresh() {
    this.currentPage = 1
    this.setQueryUrl({ page: 1 })
  }

  protected onDebounce() {
    this.debounces()
  }

  protected onSearch() {
    const searchKey = this.searchKey && this.searchKey.trim() || ''
    if (searchKey && searchKey !== this.$route.query.search) {
      this.currentPage = 1
      this.debounces.cancel()
      this.setQueryUrl({ page: 1 })
    }
  }

  protected toggleFilter() {
    this.showFilter = !this.showFilter
    if (!this.showFilter) {
      this.onCancelFilter()
    }
    this.$nextTick(() => {
      EventBus.$emit('showFilter', this.showFilter)
    })
  }

  protected onCancelFilter() {
    this.showFilter = false
    this.filter = {}
    this.currentPage = 1
    this.setQueryUrl({ page: 1 })
  }

  protected onFilter(filter: object) {
    this.filter = filter
    this.currentPage = 1
    this.setQueryUrl({ page: 1 })
  }

  protected checkPageCurrentPageOfTotalPage() {
    if (this.currentPage < this.totalPage) {
      return true
    }
    return false
  }

  protected async customersExport() {
    this.isLoadingExport = true
    this.progress = 0
    const data: any[] = []
    const limit = this.maxRowExport
    let offset = 0
    const numberLoop = Math.ceil(this.total / limit)

    this.$bvModal.show('exportProgress')

    for (let i = 1; i <= numberLoop; i++) {
      const res: any = await this.customerApi.export({
        page: 1,
        search: this.searchKey,
        filter: this.filter,
        limit,
        offset,
      })

      if (res.status !== OK) {
        this.$bvModal.hide('exportProgress')
        this.$bvModal.show('exportMessage')
        return
      }

      offset = offset + limit
      data.push(...this.flattenItems(res.data, false))
      this.progress = offset <= this.total ? Math.round((offset / this.total) * 100) : 100
    }

    const ws: any = XLSX.utils.json_to_sheet(data)

    // Rename header
    const range = XLSX.utils.decode_range(ws['!ref'])
    for (let C = range.s.r; C <= Object.keys(this.fieldsExport).length; ++C) {
      const firstRow = XLSX.utils.encode_col(C) + 1
      if (!ws[firstRow]) {
        continue
      }
      ws[firstRow].v = this.fieldsExport[ws[firstRow].v]
    }

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'DANH_SACH_KH')

    XLSX.writeFile(wb, 'DANH_SACH_KH.xlsx')

    this.$bvModal.hide('exportProgress')
    this.isLoadingExport = false
  }

  private created() {
    this.queryParams = {
      page: 1,
    }
    this.fetchAttributes()
  }

  private setQueryUrl(params: { page: number, search?: string } = { page: 1, search: '' }) {
    if (this.currentPage !== +this.$route.query.page ||
      this.searchKey !== this.$route.query.search
    ) {
      this.$router.replace({
        name: this.PERMISSION.CUSTOMER.INDEX,
        query: {
          page: params.page.toString(),
          search: this.searchKey,
        },
      }).catch((e: any) => {
        // throw e
      })
    }

    this.fetch()
  }

  private fetchAttributes() {
    this.$store.dispatch(GET_CUSTOMER_ATTRIBUTES).then(() => {
      this.fields = this.buildFields()
      this.fieldsExport = this.buildFieldsExport()
      this.fetch()
    })
  }

  private buildFields() {
    const fields: ITableField[] = []
    const stickyColumns = ['ten_kh']
    this.customerAttributes.forEach((attribute) => {
      if (!attribute.is_enabled) {
        return
      }
      fields.push({
        key: attribute.slug,
        label: attribute.name,
        attributeId: attribute.id,
        stickyColumn: stickyColumns.includes(attribute.slug),
        tdClass: attribute.slug,
        thClass: attribute.slug,
      })
    })
    return [{
      key: 'actions',
      label: 'Hành động',
      tdClass: 'actions',
      thClass: 'actions',
    }, ...fields, {
      key: 'created_by',
      label: 'Tạo bởi',
      tdClass: 'created_by',
      thClass: 'created_by',
    }, {
      key: 'created_at',
      label: 'Ngày tạo',
      tdClass: 'created_at',
      thClass: 'created_at',
    }, {
      key: 'updated_at',
      label: 'Ngày cập nhật',
      tdClass: 'updated_at',
      thClass: 'updated_at',
    }]
  }

  private buildFieldsExport() {
    const fields: { [key: string]: any } = {}
    this.customerAttributes.forEach((attribute) => {
      if (!attribute.is_enabled) {
        return
      }
      fields[attribute.slug] = attribute.name
    })
    fields.created_by = 'Tạo bởi'
    fields.created_at = 'Ngày tạo'
    fields.updated_at = 'Ngày cập nhật'
    return fields
  }

  private fetch() {
    this.isLoading = true
    const { page, search } = this.$route.query
    this.currentPage = +page || 1
    this.searchKey = search as string || ''
    this.customerApi.filter({ page: this.currentPage, search: this.searchKey, filter: this.filter }).then((res: any) => {
      this.isLoading = false
      if (!(res.data && res.data.length)) {
        this.items = []
        return
      }
      this.items = this.flattenItems(res.data)
      const meta = res.meta
      const pagination = meta && meta.pagination || {}
      this.total = pagination.total || 0
      this.perPage = pagination.per_page || 10
      this.totalPage = pagination.total_pages || 1
    })
  }

  private flattenItems(datas: any, hasId: boolean = true) {
    const items: any[] = []
    datas.forEach((data: any) => {
      const item = {} as any
      if (hasId) {
        item.id = data.id
      }
      data.attributes.forEach((attribute: any) => {
        if (attribute.is_enabled) {
          item[attribute.slug] = this.getValueByType(attribute, attribute.attribute_values.map((t: { value: any }) => t.value).join(', '))
        }
      })
      const user = this.allUsers.find((t) => t.id === data.created_by)
      item.created_by = user && user.name
      item.created_at = moment(data.created_at).format('DD/MM/YYYY')
      item.updated_at = moment(data.updated_at).format('DD/MM/YYYY')
      items.push(item)
    })
    return items
  }

  private getValueByType(attribute: IAttribute, value: string) {
    if (!value) {
      return
    }
    const items: string[] = value.split(', ')
    const values: string[] = []
    switch (+attribute.attribute_input_type_id) {
      case InputType['Date/ Ngày tháng năm']:
        return moment(value).format('DD/MM/YYYY')
      case InputType['Datetime/ Ngày giờ']:
        return moment(value).format('DD/MM/YYYY HH:mm:ss')
      case InputType['Phone/ Số điện thoại']:
        return filters.phoneFormat(value)
      case InputType['Number/ Số']:
        return filters.numberFormat(value)
      case InputType['Price/ Tiền tệ']:
        return filters.priceFormat(value)
      case InputType['Select/ 1 lựa chọn']:
      case InputType['Select/ Nhiều lựa chọn']:
      case InputType['Checkbox/ Nhiều lựa chọn']:
      case InputType['Radio/ 1 lựa chọn']:
        const selectedAttribute = this.customerAttributes.find((t) => t.id === attribute.id)
        const options = selectedAttribute && selectedAttribute.attribute_options || []
        options.forEach((option) => {
          if (option && option.id && items.includes(option.id.toString())) {
            values.push(option.name)
          }
        })
        return values.join(', ')
      case InputType['User/ 1 người dùng']:
      case InputType['Users/ Nhiều người dùng']:
        this.allUsers.forEach((user) => {
          if (user && user.id && items.includes(user.id.toString())) {
            values.push(user.name)
          }
        })
        return values.join(', ')
      default:
        return value
    }
  }
}
