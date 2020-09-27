import { Component, Prop } from 'vue-property-decorator'

import Mixins from '@/mixins'
import EventBus from '@/event-bus'
import { IAttribute } from '@/modules/settings/interface'
import { UNPROCESSABLE_ENTITY, OK } from '@/types/const'

@Component
export default class AttributeDelete extends Mixins {
  @Prop({ default: '' })
  protected deleteAction!: string

  @Prop({ default: '' })
  protected checkBeforeDeleteAction!: string

  @Prop({ default: '' })
  protected prefix!: string

  protected isLoading: boolean = false
  protected attribute: IAttribute = {
    id: 0,
    name: '',
  } as IAttribute

  constructor() {
    super()
  }

  protected onSubmit(bvModalEvt: any) {
    bvModalEvt.preventDefault()
    this.isLoading = true

    this.$store.dispatch(this.deleteAction, this.attribute.id).then((res) => {
      this.isLoading = false

      if (res.status === UNPROCESSABLE_ENTITY) {
        this.toastError('Xóa trường dữ liệu thất bại.')
        this.$bvModal.hide('attributeDeleteModal')
        this.$bvModal.show('attributeDeleteModalMessage')
        return
      }
      if (res.status === OK) {
        this.$emit('onDeleted', true)
        this.$bvModal.hide('attributeDeleteModal')
        this.toastSuccess('Xóa trường dữ liệu thành công.')
      }
    })
  }

  protected onClose() {
    this.$bvModal.hide('attributeDeleteModal')
  }

  private created() {
    this.showModalAttributeDelete()
  }

  private showModalAttributeDelete() {
    EventBus.$on(this.prefix + 'ShowModalAttributeDelete', (attribute: IAttribute) => {
      this.attribute = attribute
      this.checkBeforeDelete()
    })
  }

  private checkBeforeDelete() {
    this.$store.dispatch(this.checkBeforeDeleteAction, this.attribute.id).then((res) => {

      if (res.status === UNPROCESSABLE_ENTITY) {
        this.$bvModal.show('attributeDeleteModalMessage')
        return
      }

      this.$bvModal.show('attributeDeleteModal')
    })
  }

}
