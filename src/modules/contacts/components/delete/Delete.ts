import { Component, Prop } from 'vue-property-decorator'

import ContactApi from '@/services/ContactApi'
import Mixins from '@/mixins'
import { OK } from '@/types/const'

@Component
export default class ContactDelete extends Mixins {

  protected id: string = ''
  protected isLoading: boolean = false
  protected name: string = ''
  private contactApi: ContactApi

  constructor() {
    super()
    this.contactApi = new ContactApi()
  }

  protected remove() {
    this.isLoading = true
    this.contactApi.remove(+this.id).then((res) => {
      this.isLoading = false
      if (res.status === OK) {
        this.onClose()
        this.$emit('onDeleted')
        this.toastSuccess(`Liên hệ ${this.name} đã xóa thành công.`)
      }
    })
  }

  protected onClose() {
    this.$bvModal.hide('contactDeleteModal')
  }

}
