import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import XLSX from 'xlsx'
import { GET_DEAL_ATTRIBUTES, GET_DEAL_STAGES, GET_DEAL_LEAD_TYPES } from '../../type'
import { IBreadcrumb, ITableField } from '@/types/interface'
import DealApi from '@/services/DealApi'
import NoResults from '@/components/noResults/NoResults.vue'
import FilterAttribute from '@/components/filterAttribute/FilterAttribute.vue'
import EventBus from '@/event-bus'
import { OK } from '@/types/const'
import DealListCommon from '../ListCommon'
@Component({
  components: {
    NoResults,
    FilterAttribute,
  },
  computed: {
    ...mapGetters([]),
  },
})

export default class DealList extends DealListCommon {
  protected breadcrumbItems: IBreadcrumb[] = [{
    text: 'Trang chủ',
    to: '/',
  }, {
    text: 'Đơn hàng',
    active: true,
  }]
  protected isLoadingStats: boolean = false
  protected stats: { [key: string]: string | number } = {}
  protected sortOrder: { [key: string]: number } = {
    ma_dh: 1, ten_dh: 2, ngay_dat_hang: 3, ma_kh_dh: 6, ten_kh_dh: 7, sdt_kh_dh: 8,
    email_kh_dh: 9, tong_thanh_tien: 10, tong_tien_vat: 11, tong_chiet_khau: 12,
    tong_tien_da_thanh_toan: 13, tong_thanh_toan: 14,
  }

  private dealApi: DealApi

  constructor() {
    super()
    this.dealApi = new DealApi()
  }

  public destroyed() {
    EventBus.$off('showFilter')
  }

  protected async dealsExport() {
    this.isLoadingExport = true
    this.progress = 0
    const data: any[] = []
    const limit = this.maxRowExport
    let offset = 0
    const numberLoop = Math.ceil(this.total / limit)

    this.$bvModal.show('exportProgress')

    for (let i = 1; i <= numberLoop; i++) {
      const res: any = await this.dealApi.export({
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

    const newData: any = []
    let rowStartMerge = 0
    let rowEndMerge = 0
    const merges: any = []
    data.forEach((item: any, index: number) => {
      const countPrevDealProducts = data[index - 1] && data[index - 1].deal_products.length || 1
      const countDealProducts = data[index].deal_products.length || 1

      rowStartMerge += countPrevDealProducts
      rowEndMerge += countDealProducts

      const newItem = this.convertDealProductExport(item, {})
      const colNotMerge = ['deal_product_code', 'deal_product_name', 'deal_product_quantity',
        'deal_product_price', 'deal_product_discount', 'deal_product_sale_price', 'deal_product_total_price',
        'deal_product_customer_name', 'deal_product_delivered',
      ]

      Object.keys(newItem).forEach((t: any, i: number) => {
        if (!colNotMerge.includes(t)) {
          merges.push(
            { s: { r: rowStartMerge, c: i }, e: { r: rowEndMerge, c: i } },
          )
        }
      })

      if (item.deal_products.length) {
        item.deal_products.forEach((product: any) => {
          newData.push(this.convertDealProductExport(item, product))
        })
      } else {
        newData.push(this.convertDealProductExport(item, {}))
      }
    })

    const ws: any = XLSX.utils.json_to_sheet(newData)

    ws['!merges'] = merges

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
    XLSX.utils.book_append_sheet(wb, ws, 'DANH_SACH_DH')

    XLSX.writeFile(wb, 'DANH_SACH_DH.xlsx')

    this.$bvModal.hide('exportProgress')
    this.isLoadingExport = false
  }

  protected setQueryUrl(params: { page: number, search?: string, stage_id?: number, lead_type_id?: number, action_id?: number } =
    { page: 1, search: '', stage_id: undefined, lead_type_id: undefined, action_id: undefined }) {
    this.$nextTick(() => {
      this.$router.replace({
        name: this.PERMISSION.DEAL.INDEX,
        query: {
          page: params.page.toString(),
          search: this.searchKey,
          stage_id: params.stage_id && params.stage_id.toString() || undefined,
          lead_type_id: params.lead_type_id && params.lead_type_id.toString() || undefined,
          action_id: params.action_id && params.action_id.toString() || undefined,
        },
      }).catch((e: any) => {
        // throw e
      })
      this.fetch()
    })
  }

  private created() {
    this.queryParams = {
      page: 1,
    }
    this.getData()
    this.getStats()
  }

  private getStats() {
    this.isLoadingStats = true
    this.dealApi.stats().then((res: any) => {
      const data = res.data
      const firtRow = {
        name: 'Tất cả',
        total: res.data.total || 0,
        id: 0,
      }
      data.stats_by_lead_type.unshift(firtRow)
      data.stats_by_stage.unshift(firtRow)
      data.stats_by_action.unshift(firtRow)
      this.stats = {
        deal_stages: data.stats_by_stage || [],
        deal_lead_types: data.stats_by_lead_type || [],
        deal_actions: data.stats_by_action || [],
      }
      this.isLoadingStats = false
    })
  }

  private async getData() {
    this.$store.dispatch(GET_DEAL_STAGES)
    this.$store.dispatch(GET_DEAL_LEAD_TYPES)
    await this.$store.dispatch(GET_DEAL_ATTRIBUTES)
    this.fields = this.buildFields()
    this.fieldsExport = this.buildFieldsExport()
    this.fetch()
  }

  private buildFields() {
    const fields: ITableField[] = []
    const stickyColumns = ['ten_dh']
    this.dealAttributes.forEach((attribute, index: number) => {
      if (!attribute.is_enabled || this.fieldsDisable.includes(attribute.slug)) {
        return
      }
      fields.push({
        key: attribute.slug,
        label: attribute.name,
        attributeId: attribute.id,
        stickyColumn: stickyColumns.includes(attribute.slug),
        tdClass: attribute.slug,
        thClass: attribute.slug,
        sortOrder: this.sortOrder[attribute.slug] || this.dealAttributes.length + index,
      })
    })

    fields.push({
      key: 'deal_stages',
      label: 'Trạng thái xử lý',
      tdClass: 'deal_stages',
      thClass: 'deal_stages',
      isHiddenFilter: true,
      sortOrder: 4,
    })

    fields.push({
      key: 'deal_lead_types',
      label: 'Phân loại lead',
      tdClass: 'deal_lead_types',
      thClass: 'deal_lead_types',
      isHiddenFilter: true,
      sortOrder: 5,
    })

    fields.sort((a: any, b: any) => {
      return a.sortOrder - b.sortOrder
    })

    return [
      ...fields, {
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
    this.dealAttributes.forEach((attribute) => {
      if (!attribute.is_enabled || this.fieldsDisable.includes(attribute.slug)) {
        return
      }
      fields[attribute.slug] = attribute.name
    })
    fields.created_by = 'Tạo bởi'
    fields.created_at = 'Ngày tạo'
    fields.updated_at = 'Ngày cập nhật'
    fields.deal_stages = 'Trạng thái xử lý'
    fields.deal_lead_types = 'Phân loại lead'
    fields.deal_product_code = 'Mã SP'
    fields.deal_product_name = 'Tên SP'
    fields.deal_product_quantity = 'Số lượng'
    fields.deal_product_price = 'Đơn giá niêm yết'
    fields.deal_product_discount = 'Chiết khấu'
    fields.deal_product_sale_price = 'Đơn giá bán'
    fields.deal_product_total_price = 'Thành tiền'
    fields.deal_product_customer_name = 'Người sử dụng cuối'
    fields.deal_product_delivered = 'Trạng thái giao hàng'
    return fields
  }

  private fetch() {
    this.isLoading = true
    const { page, search, stage_id, lead_type_id, action_id } = this.$route.query
    this.currentPage = +page || 1
    this.searchKey = search as string || ''
    this.filterCustom = {
      stage_id: +stage_id || undefined,
      lead_type_id: +lead_type_id || undefined,
      action_id: +action_id || undefined,
    }
    const filter = {
      ...this.filter,
      ...this.filterCustom,
    }
    this.dealApi.filter({ page: this.currentPage, search: this.searchKey, filter }).then((res: any) => {
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
}
