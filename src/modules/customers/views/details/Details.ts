import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import moment from 'moment'

import { GET_CUSTOMER_ATTRIBUTES } from '../../type'
import { IAttribute, IAttributeOptions } from '@/modules/settings/interface'
import { IBreadcrumb } from '@/types/interface'
import { ICustomer } from '../../interface'
import { InputType } from '@/types/enum'
import { IUser } from '@/modules/users/interface'
import { UNPROCESSABLE_ENTITY, INTERNAL_SERVER_ERROR, OK } from '@/types/const'
import CustomerApi from '@/services/CustomerApi'
import Delete from '../../components/delete/Delete.vue'
import Edit from '../../components/edit/Edit.vue'
import DealCreate from '@/modules/deals/components/create/Create'
import filters from '@/utils/filters'
import Mixins from '@/mixins'

@Component({
  components: {
    Delete,
    Edit,
    DealCreate,
  },
  computed: {
    ...mapGetters(['customerAttributes', 'allUsers']),
  },
})
export default class CustomerDetails extends Mixins {

  protected allUsers!: IUser[]
  protected customer: ICustomer = {} as ICustomer
  protected customerCached: ICustomer = {} as ICustomer
  protected customerAttributes!: IAttribute[]
  protected isEdit: boolean = false
  protected isLoading: boolean = true
  protected isLoadingUpdate = false
  protected serverErrors = {}
  protected inputType = InputType
  private customerApi: CustomerApi

  constructor() {
    super()
    this.customerApi = new CustomerApi()
  }

  protected get breadcrumbItems(): IBreadcrumb[] {
    return [{
      text: 'Trang chủ',
      to: '/',
    }, {
      text: 'Danh sách khách hàng',
      to: { name: this.PERMISSION.CUSTOMER.INDEX },
    }, {
      text: this.customerName() || 'Chi tiết khách hàng',
      active: true,
    }]
  }

  protected onCancel() {
    this.isEdit = false
    this.serverErrors = {}
    this.customer = this.initData(this.customerCached)
  }

  protected async onSubmit() {
    const data: Array<{}> = []
    const attributes = this.customer && this.customer.attributes as any || [] as any
    const ignoreField = ['ma_kh']
    const isValid = await (this.$refs.validationObserver as any).validate()
    if (!isValid) {
      this.scrollToViewFirstError('app', 120)
      return
    }
    attributes.forEach((attribute: { [key: string]: string | number | Array<{}> }) => {
      if (ignoreField.includes(attribute.slug as string)) {
        return
      }
      let value: string | number | Array<{}>
      if ([InputType['Select/ Nhiều lựa chọn'], InputType['Users/ Nhiều người dùng']].includes(+attribute.attribute_input_type_id)) {
        value = attribute[attribute.slug as string] && (attribute[attribute.slug as string] as Array<{ id: number }>).map((t) => t.id) || ''
      } else if ([InputType['Select/ 1 lựa chọn'], InputType['User/ 1 người dùng']].includes(+attribute.attribute_input_type_id)) {
        value = attribute[attribute.slug as string] && (attribute[attribute.slug as string] as any).id || ''
      } else {
        value = attribute[attribute.slug as string]
      }
      data.push({
        attribute_id: attribute.id,
        attribute_input_type_id: attribute.attribute_input_type_id,
        is_required: !!attribute.is_required,
        is_unique: attribute.is_unique,
        name: attribute.name,
        slug: attribute.slug,
        value,
      })
    })
    this.isLoadingUpdate = true
    const onSuccess = (res: any) => {
      this.customer = this.initData(res.data)
      this.customerCached = this.initData(res.data)
      this.isEdit = false
      this.toastSuccess(`Khách hàng ${this.customerName()} đã cập nhật thành công.`)
    }
    const onFail = (res: any) => {
      const resData = res.data
      this.serverErrors = resData.errors
      this.toastError('Cập nhật khách hàng thất bại.')
    }
    this.customerApi.update(this.customer.id as number, { attributes: data }).then((res) => {
      this.isLoadingUpdate = false
      if ([UNPROCESSABLE_ENTITY, INTERNAL_SERVER_ERROR].includes(res.status)) {
        onFail(res)
        return
      }
      if (res.status === OK) {
        onSuccess(res)
      }
    })
  }

  protected customerName() {
    const attributes = this.customer.attributes || []
    const attribute = attributes.filter((t: { slug: string }) => t.slug === 'ten_kh')[0]
    return attribute && attribute.attribute_values[0].value
  }

  protected onDelete() {
    const { deleteModal } = this.$refs as any
    deleteModal.name = this.customerName()
    deleteModal.id = this.customer.id
    this.$bvModal.show('customerDeleteModal')
  }

  protected onDeleted() {
    this.$router.push({ name: this.PERMISSION.CUSTOMER.INDEX })
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
        const selectedAttribute = this.customerAttributes.find((t) => t.id === attribute.id)
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

  private created() {
    this.fetchAttributes()
  }

  private fetchAttributes() {
    this.$store.dispatch(GET_CUSTOMER_ATTRIBUTES).then(() => {
      this.fetch()
    })
  }

  private fetch() {
    this.customerApi.details(+this.$route.params.id).then((res: any) => {
      this.isLoading = false
      this.customer = this.initData(res.data)
      this.customerCached = this.initData(res.data)
    })
  }

  private initData(data: ICustomer) {
    return {
      ...data,
      attributes: data.attributes.filter((t) => t.is_enabled).map((t) => ({
        ...t,
        [t.slug]: this.isMultiple(t.attribute_input_type_id) ? t.attribute_values.map((x) => x.value) : t.attribute_values.map((x) => x.value).join(', '),
      })),
    }
  }

}
