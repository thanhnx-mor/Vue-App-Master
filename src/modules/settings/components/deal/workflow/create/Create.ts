import Mixins from '@/mixins'

import { Component } from 'vue-property-decorator'
import { UNPROCESSABLE_ENTITY, OK } from '@/types/const'
import { IDealWorkflow } from '@/modules/deals/interface'
import DealApi from '@/services/DealApi'

@Component({

})

export default class DealWorkflowCreate extends Mixins {
  protected dealWorkflow: IDealWorkflow = this.init()
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

    this.dealApi.createDealWorkflow(this.dealWorkflow).then((res) => {
      this.isLoading = false

      if (res.status === UNPROCESSABLE_ENTITY) {
        this.serverErrors = res.data.errors
        this.toastError('Thêm quy trình làm việc thất bại.')
        return
      }

      if (res.status === OK) {
        this.onCancel()
        this.$emit('onCreated', true)
        this.$bvModal.hide('dealWorkflowCreateModal')
        this.toastSuccess('Thêm quy trình làm việc thành công.')
      }
    })
  }

  protected onCancel() {
    (this.$refs.validationObserver as any).reset()
    this.serverErrors = {}
    this.isLoading = false
    this.dealWorkflow = this.init()
  }

  private init() {
    return {
      name: '',
    } as IDealWorkflow
  }
}
