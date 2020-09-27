import { Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { IAttribute } from '@/modules/settings/interface'
import { IUser } from '@/modules/users/interface'
import { InputType } from '@/types/enum'
import filters from '@/utils/filters'
import Mixins from '@/mixins'
import ShowAttribute from '@/modules/deals/components/showAttribute/ShowAttribute'
import { ITableField } from '@/types/interface'
@Component({
  components: {
    ShowAttribute,
  },
  computed: {
    ...mapGetters(['dealAttributes', 'activeUsers', 'allUsers']),
  },
})

export default class ShowDeal extends Mixins {
  @Prop()
  protected deal?: any

  protected dealAttributes!: IAttribute[]
  protected isLoading: boolean = false
  protected isLoadingGetData: boolean = false
  protected inputType = InputType
  protected activeUsers!: IUser[]
  protected allUsers!: IUser[]
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
  },
  //  {
  //   key: 'customer',
  //   label: 'Người sử dụng cuối',
  //   tdClass: 'customer',
  //   thClass: 'customer',
  // },
  {
    key: 'is_delivered',
    label: 'Trạng thái giao hàng',
    tdClass: 'is_delivered',
    thClass: 'is_delivered',
  }]
  protected dealProductDiscountType!: any
  protected delivered = [
    { id: 0, label: 'Chưa giao' },
    { id: 1, label: 'Đã giao' },
  ]

  constructor() {
    super()
  }

  protected get filters() {
    return filters
  }

  protected get getDealProductDiscountType() {
    const attribute: any = this.getAttribute('loai_chiet_khau')
    if (!attribute) {
      return
    }
    return attribute.attribute_options.map((t: any) => {
      return {
        ...t,
        label: 'CK ' + t.name.toLowerCase(),
      }
    })
  }


  protected getOptions(attribute: any) {
    const attributeInputTypeId = attribute.attribute_input_type_id || undefined
    const attributeId = attribute.id || undefined
    switch (attributeInputTypeId) {
      case this.inputType['User/ 1 người dùng']:
      case this.inputType['Users/ Nhiều người dùng']:
        return this.activeUsers
      default:
        const selectedAttribute = this.dealAttributes.find((t) => t.id === attributeId)
        return selectedAttribute && selectedAttribute.attribute_options.map((t) => ({ name: t.name, id: t.id })) || []
    }
  }

  protected getAttribute(slug: string) {
    const index = this.deal && this.deal.attributes.findIndex((t: any) => t.slug === slug) || undefined
    return index && this.deal.attributes[index] || {}
  }

  private created() {
    this.setDataAttribute()
  }

  private setDataAttribute() {
    const hiddenAttributes = ['ma_dh', 'trang_thai_giao_dich', 'trang_thai_thanh_toan', 'tong_tien_da_thanh_toan',
      'phan_loai_leads_dh', 'tien_trinh_xu_ly_dh', 'trang_thai_xu_ly_dh', 'nguoi_phu_trach_dh']
    const infoAttributes = ['ten_dh', 'ma_kh_dh', 'ten_kh_dh']
    const attributeReadOnly = ['ma_kh_dh', 'ten_kh_dh']
    const infoExtendAttributes = ['ngay_dat_hang', 'dia_chi_giao_hang', 'sdt_lien_he', 'nguoi_nhan']
    const attributeSetInitData = ['loai_chiet_khau', 'loai_vat']
    if (!this.deal) {
      return
    }
    const attributes: any = []
    this.deal.attributes.forEach((attribute: any) => {
      let position: number = 0
      attribute.attribute_options = this.getOptions(attribute)
      if (hiddenAttributes.includes(attribute.slug)) {
        return
      }

      if (infoAttributes.includes(attribute.slug)) {
        position = 1
      }

      if (infoExtendAttributes.includes(attribute.slug) || !attribute.is_default) {
        position = 3
      }

      if (attributeSetInitData.includes(attribute.slug)) {
        attribute[attribute.slug] = attribute[attribute.slug] && attribute.attribute_options.find((t: any) => t.id === +(attribute[attribute.slug])) || undefined
      }

      attributes.push({
        ...attribute,
        attribute_id: attribute.id,
        is_disabled: attributeReadOnly.includes(attribute.slug) ? true : false,
        position,
      })
    })

    this.deal.attributes = attributes

    if (!this.deal.products.length) {
      this.dealProductDiscountType = this.getDealProductDiscountType[0]
      return
    }

    this.deal.products = this.deal.products.map((t: any) => {
      return {
        ...t,
        discount: +t.discount,
        is_delivered: this.delivered.find((item: any) => item.id === t.is_delivered),
        is_loading_search_customers: false,
      }
    })
    const discountType = this.deal.products && this.deal.products[0].discount_type || undefined
    this.dealProductDiscountType = this.getDealProductDiscountType.find((t: any) => t.name === discountType)
  }
}
