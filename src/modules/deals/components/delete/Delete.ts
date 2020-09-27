import { Component, Prop } from 'vue-property-decorator'

import ProductApi from '@/services/ProductApi'
import Mixins from '@/mixins'
import { OK } from '@/types/const'

@Component
export default class ProductDelete extends Mixins {

  protected id: string = ''
  protected isLoading: boolean = false
  protected name: string = ''
  private productApi: ProductApi

  constructor() {
    super()
    this.productApi = new ProductApi()
  }

  protected remove() {
    this.isLoading = true
    this.productApi.remove(+this.id).then((res) => {
      this.isLoading = false
      if (res.status === OK) {
        this.onClose()
        this.$emit('onDeleted')
        this.toastSuccess(`Sản phẩm ${this.name} đã xóa thành công.`)
      }
    })
  }

  protected onClose() {
    this.$bvModal.hide('productDeleteModal')
  }

}
