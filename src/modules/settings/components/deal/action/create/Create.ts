import Mixins from '@/mixins'

import { Component } from 'vue-property-decorator'
import { UNPROCESSABLE_ENTITY, OK } from '@/types/const'
import { IDealAction } from '@/modules/deals/interface'
import DealApi from '@/services/DealApi'

@Component({

})

export default class DealActionCreate extends Mixins {
  protected dealAction: IDealAction = this.init()
  protected isLoading: boolean = false
  protected serverErrors: object = {}
  private dealApi: DealApi

  constructor() {
    super()
    this.dealApi = new DealApi()
  }

  get isDisabled() {
    if (this.isLoading) {
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

    this.isLoading = true

    this.dealApi.createDealAction(this.dealAction).then((res) => {
      this.isLoading = false

      if (res.status === UNPROCESSABLE_ENTITY) {
        this.serverErrors = res.data.errors
        this.toastError('Thêm hành động thất bại.')
        return
      }

      if (res.status === OK) {
        this.onCancel()
        this.$emit('onCreated', true)
        this.$bvModal.hide('dealActionCreateModal')
        this.toastSuccess('Thêm hành động thành công.')
      }
    })
  }

  protected onCancel() {
    (this.$refs.validationObserver as any).reset()
    this.serverErrors = {}
    this.isLoading = false
    this.dealAction = this.init()
  }

  private init() {
    return {
      name: '',
    } as IDealAction
  }
}
