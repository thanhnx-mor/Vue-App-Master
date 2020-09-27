import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

import { IAttribute } from '@/modules/settings/interface'
import { IUser } from '@/modules/users/interface'
import { InputType } from '@/types/enum'
import { UNPROCESSABLE_ENTITY, INTERNAL_SERVER_ERROR, OK } from '@/types/const'
import DatePicker from 'vue2-datepicker'
import Multiselect from 'vue-multiselect'
import ProductApi from '@/services/ProductApi'
import Mixins from '@/mixins'
import utils from '@/utils/utils'

@Component({
  components: {
    DatePicker,
    Multiselect,
  },
  computed: {
    ...mapGetters(['productAttributes', 'activeUsers']),
  },
})
export default class ProductCreate extends Mixins {

  protected productAttributes!: IAttribute[]
  protected attributes: Array<{ [key: string]: string | number | boolean }> = []
  protected serverErrors: object = {}
  protected isLoading: boolean = false
  protected inputType = InputType
  protected activeUsers!: IUser[]
  private productApi: ProductApi

  constructor() {
    super()
    this.productApi = new ProductApi()
  }

  protected isSimpleType(attributeInputTypeId: number) {
    return [InputType['Text/ Văn bản'], InputType['Phone/ Số điện thoại'], InputType['Email/ Thư điện tử'], InputType['Number/ Số'], InputType['Price/ Tiền tệ']].includes(attributeInputTypeId)
  }

  protected setDefaultValueSKU() {
    const productNameAttribute: any = this.attributes.find((t: any) => t.slug === 'ten_sp') || undefined
    const productName = productNameAttribute && productNameAttribute[productNameAttribute.slug] || ''
    const productSKU = productName && utils.changeAlias(productName).replace(/ /g, '_') || ''
    this.attributes.forEach((t: any) => {
      if (t.slug === 'ma_sku') {
        t[t.slug] = productSKU
      }
    })
  }

  protected getOptions(attribute: any) {
    const attributeInputTypeId = attribute && attribute.attribute_input_type_id || undefined
    const attributeId = attribute && attribute.attribute_id || undefined
    switch (attributeInputTypeId) {
      case this.inputType['User/ 1 người dùng']:
      case this.inputType['Users/ Nhiều người dùng']:
        return this.activeUsers
      default:
        const selectedAttribute = this.productAttributes.find((t) => t.id === attributeId)
        return selectedAttribute && selectedAttribute.attribute_options.map((t) => ({ name: t.name, id: t.id })) || []
    }
  }

  protected async onSubmit(bvModalEvt: any) {
    bvModalEvt.preventDefault()
    const isValid = await (this.$refs.validationObserver as any).validate()
    if (!isValid) {
      return
    }
    const data: Array<{ [key: string]: string | number | boolean }> = []
    this.attributes.forEach((attribute) => {
      let value: any
      if ([InputType['Select/ Nhiều lựa chọn'], InputType['Users/ Nhiều người dùng']].includes(+attribute.attribute_input_type_id)) {
        value = attribute[attribute.slug as string] && (attribute[attribute.slug as string] as any).map((t: any) => t.id) || ''
      } else if ([InputType['Select/ 1 lựa chọn'], InputType['User/ 1 người dùng']].includes(+attribute.attribute_input_type_id)) {
        value = attribute[attribute.slug as string] && (attribute[attribute.slug as string] as any).id || ''
      } else {
        value = attribute[attribute.slug as string]
      }

      if (attribute[attribute.slug as string]) {
        data.push({
          ...attribute,
          value,
        })
      }
    })
    this.isLoading = true
    const onSuccess = () => {
      this.onCancel()
      this.$emit('onCreated', true)
      this.$bvModal.hide('productCreateModal')
      this.toastSuccess('Thêm sản phẩm thành công.')
    }
    const onFail = (res: any) => {
      const resData = res.data
      this.serverErrors = resData.errors
      this.toastError('Thêm sản phẩm thất bại.')
    }
    this.productApi.create({ attributes: data, created_by: this.currentUser.id }).then((res) => {
      this.isLoading = false
      if ([UNPROCESSABLE_ENTITY, INTERNAL_SERVER_ERROR].includes(res.status)) {
        onFail(res)
        return
      }
      if (res.status === OK) {
        onSuccess()
      }
    })
  }

  protected onCancel() {
    (this.$refs.validationObserver as any).reset()
    this.serverErrors = {}
    this.isLoading = false
    this.createForm()
  }

  private created() {
    this.createForm()
  }

  private createForm() {
    const hiddenAtts = ['ma_sp']
    const attributes = this.productAttributes.filter((t) => t.is_default)
    this.attributes = []
    attributes.forEach((attribute: IAttribute) => {
      if (hiddenAtts.includes(attribute.slug)) {
        return
      }
      this.attributes.push({
        [attribute.slug]: '',
        attribute_id: attribute.id,
        attribute_input_type_id: attribute.attribute_input_type_id,
        is_required: attribute.is_required,
        is_unique: attribute.is_unique,
        name: attribute.name,
        slug: attribute.slug,
      })
    })
  }
}
