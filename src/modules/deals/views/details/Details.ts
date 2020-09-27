import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import moment from 'moment'

import { GET_DEAL_ATTRIBUTES } from '../../type'
import { IAttribute, IAttributeOptions } from '@/modules/settings/interface'
import { IBreadcrumb, ITableField } from '@/types/interface'
import { IDeal } from '../../interface'
import { InputType } from '@/types/enum'
import { IUser } from '@/modules/users/interface'
import DealApi from '@/services/DealApi'
import Delete from '../../components/delete/Delete.vue'
import Edit from '../../components/edit/Edit.vue'
import filters from '@/utils/filters'
import Mixins from '@/mixins'
import EventBus from '@/event-bus'

@Component({
  components: {
    Delete,
    Edit,
  },
  computed: {
    ...mapGetters(['dealAttributes', 'allUsers']),
  },
})
export default class DealDetails extends Mixins {

  protected allUsers!: IUser[]
  protected deal: IDeal = {} as IDeal
  protected dealAttributes!: IAttribute[]
  protected attributes: Array<{ [key: string]: string | number | boolean }> = []
  protected isEdit: boolean = false
  protected isLoading: boolean = true
  protected isLoadingUpdate = false
  protected serverErrors = {}
  protected dealProducts: any = []
  protected productFields: ITableField[] = [{
    key: 'product_code',
    label: 'Mã SP',
    tdClass: 'product_code',
    thClass: 'product_code',
  }, {
    key: 'product_name',
    label: 'Tên SP',
    tdClass: 'product_name',
    thClass: 'product_name',
  }, {
    key: 'quantity',
    label: 'Số lượng',
    tdClass: 'quantity',
    thClass: 'quantity',
  }, {
    key: 'product_unit',
    label: 'Đơn vị',
    tdClass: 'product_unit',
    thClass: 'product_unit',
  }, {
    key: 'price',
    label: 'Đơn giá niêm yết',
    tdClass: 'price',
    thClass: 'price',
  }, {
    key: 'discount_type',
    label: 'Chiết khấu',
    tdClass: 'discount_type',
    thClass: 'discount_type',
  }, {
    key: 'sale_price',
    label: 'Đơn giá bán',
    tdClass: 'sale_price',
    thClass: 'sale_price',
  }, {
    key: 'total_price',
    label: 'Thành tiền',
    tdClass: 'total_price',
    thClass: 'total_price',
  }, {
    key: 'customer_name',
    label: 'Người sử dụng cuối',
    tdClass: 'customer_name',
    thClass: 'customer_name',
  }, {
    key: 'is_delivered',
    label: 'Trạng thái giao hàng',
    tdClass: 'is_delivered',
    thClass: 'is_delivered',
  }]
  protected attributesReadOnly = [
    'trang_thai_giao_dich',
    'tong_thanh_toan',
    'trang_thai_thanh_toan',
    'tong_thanh_tien',
    'tong_tien_da_thanh_toan',
    'loai_vat',
    'loai_chiet_khau',
    'gia_tri_chiet_khau',
    'tong_chiet_khau',
  ]
  protected attributesDisable = [
    'ma_kh_dh',
    'ten_kh_dh',
    'sdt_kh_dh',
    'email_kh_dh',
    'ma_dh',
    'ten_dh',
    'ghi_chu',
    'tong_thanh_toan',
    'tong_thanh_tien',
    'tong_tien_da_thanh_toan',
    'loai_vat',
    'tong_tien_vat',
    'loai_chiet_khau',
    'gia_tri_chiet_khau',
    'tong_chiet_khau',
    'nguoi_phu_trach_dh',
  ]
  protected inputType = InputType
  private dealApi: DealApi

  constructor() {
    super()
    this.dealApi = new DealApi()
  }

  protected get breadcrumbItems(): IBreadcrumb[] {
    return [{
      text: 'Trang chủ',
      to: '/',
    }, {
      text: 'Danh sách đơn hàng',
      to: { name: this.PERMISSION.DEAL.INDEX },
    }, {
      text: this.dealName() || 'Chi tiết đơn hàng',
      active: true,
    }]
  }

  public destroyed() {
    EventBus.$off('showModalDealUpdate')
  }

  protected get filters() {
    return filters
  }

  protected getAttribute(slug: string) {
    if (this.deal.attributes) {
      const index = this.deal.attributes.findIndex((t) => t.slug === slug)
      return this.deal.attributes[index] || {}
    }
  }

  protected dealName() {
    const attributes = this.deal.attributes || []
    const attribute = attributes.filter((t: { slug: string }) => t.slug === 'ten_dh')[0]
    return attribute && attribute.attribute_values[0].value || ''
  }

  protected getValueByType(attribute: IAttribute, value: string) {
    if (!value) {
      return
    }
    let item: IAttributeOptions | IUser
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
        const selectedAttribute = this.dealAttributes.find((t) => t.id === attribute.id)
        const options = selectedAttribute && selectedAttribute.attribute_options || []
        item = options.find((t) => t.id === +value) as IAttributeOptions
        return item && item.name
      case InputType['User/ 1 người dùng']:
      case InputType['Users/ Nhiều người dùng']:
        item = this.allUsers.find((t) => t.id === +value) as IUser
        return item && item.name
      default:
        return value
    }
  }

  protected isMultiple(inputType: number) {
    return [InputType['Select/ Nhiều lựa chọn'], InputType['Checkbox/ Nhiều lựa chọn'], InputType['Users/ Nhiều người dùng']].includes(+inputType)
  }

  protected showModalDealUpdate() {
    EventBus.$emit('showModalDealUpdate', this.deal.id)
  }

  protected onUpdated(deal: any) {
    deal = this.initData(deal)
    this.deal = deal
    this.dealProducts = deal.products
    this.$nextTick(() => {
      this.$forceUpdate()
    })
  }

  protected setClassDealPaymentStatus(name: string) {
    if (name === 'Thanh toán 1 phần') {
      return 'text-warning'
    }
    if (name === 'Thanh toán hết') {
      return 'text-success'
    }
    return 'text-error'
  }

  private created() {
    this.fetchAttributes()
  }

  private fetchAttributes() {
    this.isLoading = true
    this.$store.dispatch(GET_DEAL_ATTRIBUTES).then(() => {
      this.fetch()
    })
  }

  private fetch() {
    this.dealApi.details(+this.$route.params.id).then((res: any) => {
      this.isLoading = false
      this.deal = this.initData(res.data)
      this.dealProducts = res.data.products
    })
  }

  private initData(data: IDeal) {
    return {
      ...data,
      attributes: data.attributes.filter((t) => t.is_enabled).map((t) => ({
        ...t,
        [t.slug]: this.isMultiple(t.attribute_input_type_id) ? t.attribute_values.map((x) => x.value) : t.attribute_values.map((x) => x.value).join(', '),
      })),
    }
  }

}
