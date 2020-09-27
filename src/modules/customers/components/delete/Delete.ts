import { Component, Prop } from 'vue-property-decorator'

import CustomerApi from '@/services/CustomerApi'
import Mixins from '@/mixins'
import { OK } from '@/types/const'

@Component
export default class CustomerDelete extends Mixins {

  protected id: string = ''
  protected isLoading: boolean = false
  protected name: string = ''
  private customerApi: CustomerApi

  constructor() {
    super()
    this.customerApi = new CustomerApi()
  }

  protected remove() {
    this.isLoading = true
    this.customerApi.remove(+this.id).then((res) => {
      this.isLoading = false
      if (res.status === OK) {
        this.onClose()
        this.$emit('onDeleted')
        this.toastSuccess(`Khách hàng ${this.name} đã xóa thành công.`)
      }
    })
  }

  protected onClose() {
    this.$bvModal.hide('customerDeleteModal')
  }

}
