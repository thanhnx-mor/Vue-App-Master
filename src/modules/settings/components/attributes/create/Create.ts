import AttributeCommonMixins from '../AttributeCommonMixins'
import { Component, Prop } from 'vue-property-decorator'
import { UNPROCESSABLE_ENTITY, OK } from '@/types/const'

@Component({
})

export default class AttributeCreate extends AttributeCommonMixins {
  @Prop({ default: '' })
  protected createAction!: string

  constructor() {
    super()
  }

  get isDisabled() {
    if (this.isLoading || this.attributeOptionMessageError) {
      return true
    }
    return false
  }

  protected async onSubmit(bvModalEvt: any) {
    bvModalEvt.preventDefault()

    const isValid = await (this.$refs.validationObserver as any).validate()
    if (!isValid) {
      return
    }

    if (this.isEnabledAttributeOptions && !this.attribute.attribute_options.length) {
      this.attributeOptionMessageError = 'Giá trị là bắt buộc'
      return
    }

    this.isLoading = true

    this.attribute.is_required = this.attribute.is_required ? 1 : 0
    this.attribute.is_unique = this.attribute.is_unique ? 1 : 0
    this.attribute.is_enabled = this.attribute.is_enabled ? 1 : 0

    this.$store.dispatch(this.createAction, this.attribute).then((res) => {
      this.isLoading = false

      if (res.status === UNPROCESSABLE_ENTITY) {
        this.serverErrors = res.data.errors
        this.toastError('Thêm trường dữ liệu thất bại.')
        this.attribute.is_required = this.attribute.is_required === 1 ? true : false
        this.attribute.is_unique = this.attribute.is_unique === 1 ? true : false
        this.attribute.is_enabled = this.attribute.is_enabled === 1 ? true : false
        return
      }

      if (res.status === OK) {
        this.onCancel()
        this.$emit('onCreated', true)
        this.$bvModal.hide('attributeCreateModal')
        this.toastSuccess('Thêm trường dữ liệu thành công.')
      }
    })
  }

  protected onCancel() {
    (this.$refs.validationObserver as any).reset()
    this.serverErrors = {}
    this.isLoading = false
    this.attributeOptionMessageError = ''
    this.attributeOptionName = ''
    this.attribute = this.initAttribute()
  }
}
