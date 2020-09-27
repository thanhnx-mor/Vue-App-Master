import AttributeCommonMixins from '../AttributeCommonMixins'
import { Component, Prop } from 'vue-property-decorator'

import EventBus from '@/event-bus'
import { UNPROCESSABLE_ENTITY, OK } from '@/types/const'
import { IAttribute, IAttributeOptions } from '../../../interface'

@Component
export default class AttributeEdit extends AttributeCommonMixins {

  @Prop({ default: '' })
  protected detailsAction!: string
  @Prop({ default: '' })
  protected updateAction!: string

  protected isLoading = false
  private attributeId!: number
  private attributeCached!: IAttribute

  constructor() {
    super()
  }

  get isDisabled() {
    if (!this.attribute || !this.attributeCached) {
      return true
    }

    const attributeOptionsId = this.attribute.attribute_options && this.attribute.attribute_options.length ?
      this.attribute.attribute_options.map((t: any) => {
        return t.id
      }) : []

    const attributeCachedOptionsId = this.attributeCached.attribute_options &&
      this.attributeCached.attribute_options.length ?
      this.attributeCached.attribute_options.map((t: any) => {
        return t.id
      }) : []

    const isChange = (this.attribute.name !== this.attributeCached.name) ||
      (this.attribute.slug !== this.attributeCached.slug) ||
      (this.attribute.is_required !== this.attributeCached.is_required) ||
      (this.attribute.is_unique !== this.attributeCached.is_unique) ||
      (this.attribute.is_enabled !== this.attributeCached.is_enabled) ||
      (attributeOptionsId.join() !== attributeCachedOptionsId.join())

    if (this.isLoading || this.attributeOptionMessageError || !isChange) {
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
    const attr = {
      ...this.attribute,
      is_required: this.attribute.is_required ? 1 : 0,
      is_unique: this.attribute.is_unique ? 1 : 0,
      is_enabled: this.attribute.is_enabled ? 1 : 0,
    }

    this.$store.dispatch(this.updateAction, attr).then((res) => {
      this.isLoading = false

      if (res.status === UNPROCESSABLE_ENTITY) {
        this.serverErrors = res.data.errors
        this.toastError('Cập nhật trường dữ liệu thất bại.')
        return
      }

      if (res.status === OK) {
        this.onCancel()
        this.$emit('onUpdated', true)
        this.$bvModal.hide('attributeUpdateModal')
        this.toastSuccess('Cập nhật trường dữ liệu thành công.')
      }
    })
  }

  protected onCancel() {
    (this.$refs.validationObserver as any).reset()
    this.serverErrors = {}
    this.isLoading = false
    this.attributeOptionMessageError = ''
    this.attributeOptionName = ''
  }

  private created() {
    this.showModalAttributeEdit()
  }

  private showModalAttributeEdit() {
    EventBus.$on(this.prefix + 'ShowModalAttributeEdit', (attributeId: number) => {
      this.attributeId = attributeId
      this.$bvModal.show('attributeUpdateModal')
      this.getAttributeBydId()
    })
  }

  private getAttributeBydId() {
    this.isLoading = true
    this.$store.dispatch(this.detailsAction, this.attributeId).then((res) => {
      this.isLoading = false
      const data = res.data as IAttribute
      data.is_required = !!data.is_required
      data.is_unique = !!data.is_unique
      data.is_enabled = !!data.is_enabled
      this.attribute = data
      this.attributeCached = Object.assign({}, {
        ...data,
        attribute_options: data.attribute_options && data.attribute_options.length ?
          data.attribute_options.map((t: IAttributeOptions) => {
            return t
          }) : [],
      })
    })
  }

}
