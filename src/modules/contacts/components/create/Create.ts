import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

import { InputType } from '@/types/enum'
import { IUser } from '@/modules/users/interface'
import { IAttribute } from '@/modules/settings/interface'
import { UNPROCESSABLE_ENTITY, INTERNAL_SERVER_ERROR, OK } from '@/types/const'
import DatePicker from 'vue2-datepicker'
import Multiselect from 'vue-multiselect'
import ContactApi from '@/services/ContactApi'
import Mixins from '@/mixins'

@Component({
  components: {
    DatePicker,
    Multiselect,
  },
  computed: {
    ...mapGetters(['contactAttributes', 'activeUsers']),
  },
})
export default class ContactCreate extends Mixins {

  protected contactAttributes!: IAttribute[]
  protected attributes: Array<{ [key: string]: string | number | boolean }> = []
  protected serverErrors: object = {}
  protected isLoading: boolean = false
  protected inputType = InputType
  protected activeUsers!: IUser[]
  private contactApi: ContactApi

  constructor() {
    super()
    this.contactApi = new ContactApi()
  }

  protected isSimpleType(attributeInputTypeId: number) {
    return [InputType['Text/ Văn bản'], InputType['Phone/ Số điện thoại'], InputType['Email/ Thư điện tử'], InputType['Number/ Số'], InputType['Price/ Tiền tệ']].includes(attributeInputTypeId)
  }

  protected getOptions(attribute: any) {
    const attributeInputTypeId = attribute && attribute.attribute_input_type_id || undefined
    const attributeId = attribute && attribute.attribute_id || undefined
    switch (attributeInputTypeId) {
      case this.inputType['User/ 1 người dùng']:
      case this.inputType['Users/ Nhiều người dùng']:
        return this.activeUsers
      default:
        const selectedAttribute = this.contactAttributes.find((t) => t.id === attributeId)
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
      this.$bvModal.hide('contactCreateModal')
      this.toastSuccess('Thêm liên hệ thành công.')
    }
    const onFail = (res: any) => {
      const resData = res.data
      this.serverErrors = resData.errors
      this.toastError('Thêm liên hệ thất bại.')
    }
    this.contactApi.create({ attributes: data, created_by: this.currentUser.id }).then((res) => {
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
    const hiddenAtts = ['ma_lh']
    const attributes = this.contactAttributes.filter((t) => t.is_default)
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
