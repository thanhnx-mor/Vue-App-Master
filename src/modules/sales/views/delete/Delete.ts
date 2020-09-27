import { Component } from 'vue-property-decorator'

import SaleApi from '@/services/SaleApi'
import Mixins from '@/mixins'
import { OK } from '@/types/const'
import EventBus from '@/event-bus'

@Component
export default class SaleDelete extends Mixins {
  protected id: string = ''
  protected isLoading: boolean = false
  protected name: string = ''
  private saleApi: SaleApi

  constructor() {
    super()
    this.saleApi = new SaleApi()
  }

  protected remove() {
    this.isLoading = true
    this.saleApi.remove(+this.id).then((res) => {
      this.isLoading = false
      if (res.status === OK) {
        this.onClose()
        this.$emit('onDeleted', true)
        this.toastSuccess(`Nhân viên bán hàng ${this.name} đã xóa thành công.`)
      }
    })
  }

  protected onClose() {
    this.$bvModal.hide('showModalSaleDelete')
  }

  private created() {
    this.showModalSaleDelete()
  }

  private showModalSaleDelete() {
    EventBus.$on('showModalSaleDelete', (data: any) => {
      this.name = data.name
      this.id = data.id
      this.$bvModal.show('showModalSaleDelete')
    })
  }
}
