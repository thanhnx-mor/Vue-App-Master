import { Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

import { IAttribute } from '@/modules/settings/interface'
import { IUser } from '@/modules/users/interface'
import { InputType } from '@/types/enum'
import filters from '@/utils/filters'
import moment from 'moment'
import DatePicker from 'vue2-datepicker'
import Multiselect from 'vue-multiselect'
import ProductApi from '@/services/ProductApi'
import CustomerApi from '@/services/CustomerApi'
import Mixins from '@/mixins'
import EditAttribute from '@/modules/deals/components/editAttribute/EditAttribute.vue'
import { ITableField } from '@/types/interface'
import { debounce } from 'lodash'

@Component({
  components: {
    EditAttribute,
    Multiselect,
    DatePicker,
  },
  computed: {
    ...mapGetters(['dealAttributes', 'activeUsers', 'allUsers', 'productAttributes']),
  },
})

export default class EditDeal extends Mixins {
  @Prop()
  protected deal?: any
  @Prop()
  protected serverErrors?: object

  protected dealAttributes!: IAttribute[]
  protected productAttributes!: IAttribute[]
  protected isLoading: boolean = false
  protected isLoadingGetProducts: boolean = false
  protected isLoadingGetData: boolean = false
  protected inputType = InputType
  protected activeUsers!: IUser[]
  protected allUsers!: IUser[]
  protected products: any = []
  protected customers: any = []
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
  {
    key: 'customer',
    label: 'Người sử dụng cuối',
    tdClass: 'customer',
    thClass: 'customer',
  },
  {
    key: 'is_delivered',
    label: 'Trạng thái giao hàng',
    tdClass: 'is_delivered',
    thClass: 'is_delivered',
  }, {
    key: 'actions',
    label: '',
    tdClass: 'actions',
    thClass: 'actions',
  }]
  protected dealProductDiscountType!: any
  protected productSearchKey: string = ''
  protected customerSearchKey: string = ''
  protected delivered = [
    { id: 0, label: 'Chưa giao' },
    { id: 1, label: 'Đã giao' },
  ]

  private productApi: ProductApi
  private customerApi: CustomerApi
  private productDebounces = debounce(() => this.getProducts(), 800)
  private customerDebounces = debounce((dealProduct: any) => this.getCustomers(dealProduct), 800)

  constructor() {
    super()
    this.productApi = new ProductApi()
    this.customerApi = new CustomerApi()
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

  protected isMultiple(inputType: number) {
    return [InputType['Select/ Nhiều lựa chọn'], InputType['Checkbox/ Nhiều lựa chọn'], InputType['Users/ Nhiều người dùng']].includes(+inputType)
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

  protected searchProducts(searchKey: string = '') {
    this.isLoadingGetProducts = true
    this.productSearchKey = searchKey
    this.productDebounces()
  }

  protected getProducts() {
    this.productApi.filter({ page: 1, search: this.productSearchKey, filter: {} }).then((res: any) => {
      if (!(res.data && res.data.length)) {
        this.isLoadingGetProducts = false
        this.products = []
        return
      }
      this.products = this.flattenItems(res.data)
      this.isLoadingGetProducts = false
    })
  }

  protected removeDealProduct(index: number) {
    if (!this.deal) {
      return
    }
    this.deal.products.splice(index, 1)
    this.setDealTotalPayment()
  }

  protected selectDealProduct(product: any) {
    this.deal.products.push({
      product_id: product.id,
      product_code: product.ma_sp,
      product_name: product.ten_sp,
      product_unit: product.don_vi,
      product_type: product.loai_sp,
      quantity: 1,
      price: product.gia_niem_yet,
      total_price: product.gia_niem_yet,
      note: '',
      discount_type: this.dealProductDiscountType && this.dealProductDiscountType.name || undefined,
      discount: 0,
      sale_price: product.gia_niem_yet,
      customer_id: this.deal.customer_id,
      customer_code: this.getAttribute('ma_kh_dh')[this.getAttribute('ma_kh_dh').slug] || '',
      customer_name: this.getAttribute('ten_kh_dh')[this.getAttribute('ten_kh_dh').slug] || '',
      customer_email: this.getAttribute('sdt_kh_dh')[this.getAttribute('sdt_kh_dh').slug] || '',
      customer_phone: this.getAttribute('email_kh_dh')[this.getAttribute('email_kh_dh').slug] || '',
      is_loading_search_customers: false,
      is_delivered: this.delivered[0],
    })
    this.setDealTotalPayment()
  }

  protected searchCustomers(searchKey: string = '', dealProduct: any) {
    this.customers = []
    dealProduct.is_loading_search_customers = true
    this.customerSearchKey = searchKey
    this.customerDebounces(dealProduct)
  }

  protected async getCustomers(dealProduct: any) {
    await this.customerApi.filter({ page: 1, search: this.customerSearchKey, filter: {} }).then((res: any) => {
      if (!(res.data && res.data.length)) {
        this.customers = []
        dealProduct.is_loading_search_customers = false
        return
      }
      this.customers = this.flattenItems(res.data)
      dealProduct.is_loading_search_customers = false
      if (dealProduct.customer_id) {
        dealProduct.customer = this.customers.find((t: any) => dealProduct.customer_id === t.id)
      }
    })
  }

  protected changeDealProductCustomer(rowData: any) {
    rowData.customer_id = rowData.customer && rowData.customer.id || ''
    rowData.customer_code = rowData.customer && rowData.customer.ma_kh || ''
    rowData.customer_name = rowData.customer && rowData.customer.ten_kh || ''
    rowData.customer_email = rowData.customer && rowData.customer.email || ''
    rowData.customer_phone = rowData.customer && rowData.customer.sdt || ''
  }

  protected getAttribute(slug: string) {
    const index = this.deal && this.deal.attributes.findIndex((t: any) => t.slug === slug) || undefined
    return index && this.deal.attributes[index] || {}
  }

  protected setDealTotalPayment() {
    this.setDealTotalPrice()
    this.setDealTotalDiscount()
    this.setDealTotalVAT()

    const attributeTotalPrice: any = this.getAttribute('tong_thanh_tien')
    const attributeTotalVAT: any = this.getAttribute('tong_tien_vat')
    const attributeTotalPayment: any = this.getAttribute('tong_thanh_toan')
    const attributeTotalDiscount: any = this.getAttribute('tong_chiet_khau')
    const totalPrice = attributeTotalPrice[attributeTotalPrice.slug] || 0
    const totalDiscount = attributeTotalDiscount[attributeTotalDiscount.slug] || 0
    const totalVAT = attributeTotalVAT[attributeTotalVAT.slug] || 0

    attributeTotalPayment[attributeTotalPayment.slug] = totalPrice + totalVAT - totalDiscount
    this.$nextTick(() => {
      this.$root.$emit('bv::refresh::table', 'dealProductsTable')
      this.$forceUpdate()
    })
  }

  protected changeDealDiscountType() {
    const attributeDiscountValue: any = this.getAttribute('gia_tri_chiet_khau')
    const attributeTotalDiscount: any = this.getAttribute('tong_chiet_khau')
    attributeDiscountValue[attributeDiscountValue.slug] = 0
    attributeTotalDiscount[attributeTotalDiscount.slug] = 0
    this.$nextTick(() => {
      this.$forceUpdate()
    })
  }

  protected changeDealProductDiscountType() {
    this.deal.products = this.deal.products.map((t: any) => {
      return {
        ...t,
        discount_type: this.dealProductDiscountType && this.dealProductDiscountType.name || undefined,
        discount: 0,
      }
    })
  }

  protected setDealProductTotalPrice(product: any) {
    const discountType = this.dealProductDiscountType && this.dealProductDiscountType.name || undefined
    let totalDiscount = 0
    const salePrice = product.sale_price || 0
    const quantity = product.quantity || 0
    const discount = product.discount || 0
    let totalPrice = Math.round(+salePrice * quantity)
    if (discountType) {
      switch (discountType) {
        case '%':
          totalDiscount = Math.round((discount / 100) * salePrice)
          break
        default:
          totalDiscount = discount
          break
      }
    }
    totalPrice = totalPrice - Math.round(totalDiscount * quantity)
    product.total_price = Number.isNaN(totalPrice) ? 0 : totalPrice
    this.setDealTotalPayment()
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
      case InputType['Datetime/ Ngày giờ']:
      case InputType['Phone/ Số điện thoại']:
      case InputType['Number/ Số']:
      case InputType['Price/ Tiền tệ']:
        return value
      case InputType['Select/ 1 lựa chọn']:
      case InputType['Select/ Nhiều lựa chọn']:
      case InputType['Checkbox/ Nhiều lựa chọn']:
      case InputType['Radio/ 1 lựa chọn']:
        const selectedAttribute = this.productAttributes.find((t) => t.id === attribute.id)
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

  private setDealTotalPrice() {
    const attributeTotalPrice: any = this.getAttribute('tong_thanh_tien')
    const totalPrice = this.deal.products.reduce((previous: any, current: any) => {
      const previousTotalPrice = +previous || 0
      const currentTotalPrice = +current.total_price
      return previousTotalPrice + currentTotalPrice
    }, 0)
    attributeTotalPrice[attributeTotalPrice.slug] = totalPrice
  }

  private setDealTotalVAT() {
    const attributeTotalPrice: any = this.getAttribute('tong_thanh_tien')
    const attributeVATType: any = this.getAttribute('loai_vat')
    const attributeTotalVAT: any = this.getAttribute('tong_tien_vat')
    const totalPrice = attributeTotalPrice[attributeTotalPrice.slug] || 0
    let VATValue = 0
    if (attributeVATType && attributeVATType[attributeVATType.slug].name) {
      switch (attributeVATType[attributeVATType.slug].name) {
        case '5%':
          VATValue = 0.05
          break
        case '10%':
          VATValue = 0.1
          break
        default:
          VATValue = 0
          break
      }
    }
    const totalVAT = Math.round(totalPrice * VATValue)
    attributeTotalVAT[attributeTotalVAT.slug] = totalVAT
  }

  private setDealTotalDiscount() {
    const attributeTotalPrice: any = this.getAttribute('tong_thanh_tien')
    const attributeDiscountType: any = this.getAttribute('loai_chiet_khau')
    const attributeDiscountValue: any = this.getAttribute('gia_tri_chiet_khau')
    const attributeTotalDiscount: any = this.getAttribute('tong_chiet_khau')
    const totalPayment = attributeTotalPrice[attributeTotalPrice.slug] || 0
    let totalDiscount = 0
    if (attributeDiscountType && attributeDiscountType[attributeDiscountType.slug]) {
      const discountValue = attributeDiscountValue[attributeDiscountValue.slug] || 0
      switch (attributeDiscountType[attributeDiscountType.slug].name) {
        case '%':
          totalDiscount = Number.isNaN(Math.round((discountValue / 100) * totalPayment)) ? 0 : Math.round((discountValue / 100) * totalPayment)
          break
        default:
          totalDiscount = discountValue
          break
      }
    }
    attributeTotalDiscount[attributeTotalDiscount.slug] = totalDiscount
  }
}
