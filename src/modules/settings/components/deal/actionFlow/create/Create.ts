import Mixins from '@/mixins'

import { Component } from 'vue-property-decorator'
import { UNPROCESSABLE_ENTITY, OK } from '@/types/const'
import { IDealAction, IDealActionFlow, IDealActionResult, IDealStage, IDealLeadType, IDealStatus } from '@/modules/deals/interface'
import DealApi from '@/services/DealApi'
import EventBus from '@/event-bus'
import { mapGetters } from 'vuex'
import Multiselect from 'vue-multiselect'

@Component({
  components: {
    Multiselect,
  },
  computed: {
    ...mapGetters(['dealActions', 'dealActionResults', 'dealStages', 'dealLeadTypes', 'dealStatus']),
  },
})

export default class DealActionFlowCreate extends Mixins {
  protected dealActionFlow: IDealActionFlow = this.init()
  protected dealActions!: IDealAction[]
  protected dealActionResults!: IDealActionResult[]
  protected dealStages!: IDealStage[]
  protected dealLeadTypes!: IDealLeadType[]
  protected dealStatus!: IDealStatus[]
  protected isLoading: boolean = false
  protected serverErrors: object = {}
  protected dealWorkflowId!: number
  protected dealActionFlowTimeType = [
    { id: 1, name: 'Phút' },
    { id: 2, name: 'Giờ' },
    { id: 3, name: 'Ngày' },
  ]
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

    let dealActionFlow: any = this.dealActionFlow

    dealActionFlow = {
      ...dealActionFlow,
      action_id: dealActionFlow.action_id && dealActionFlow.action_id.id || undefined,
      action_result_id: dealActionFlow.action_result_id && dealActionFlow.action_result_id.id || undefined,
      next_action_id: dealActionFlow.next_action_id && dealActionFlow.next_action_id.id || undefined,
      next_action_time: +dealActionFlow.next_action_time || undefined,
      next_action_timetype: dealActionFlow.next_action_timetype && dealActionFlow.next_action_timetype.id || undefined,
      stage_id: dealActionFlow.stage_id && dealActionFlow.stage_id.id || undefined,
      lead_type_id: dealActionFlow.lead_type_id && dealActionFlow.lead_type_id.id || undefined,
      status_code: dealActionFlow.status_code && dealActionFlow.status_code.id || undefined,
    }

    this.dealApi.createDealActionFlow(dealActionFlow).then((res) => {
      this.isLoading = false

      if (res.status === UNPROCESSABLE_ENTITY) {
        this.serverErrors = res.data.errors
        this.toastError('Thêm luồng tác nghiệp thất bại.')
        return
      }

      if (res.status === OK) {
        this.onCancel()
        this.$emit('onCreated', true)
        this.$bvModal.hide('dealActionFlowCreateModal')
        this.toastSuccess('Thêm luồng tác nghiệp thành công.')
      }
    })
  }

  protected onCancel() {
    (this.$refs.validationObserver as any).reset()
    this.serverErrors = {}
    this.isLoading = false
    this.dealActionFlow = this.init()
  }

  private created() {
    this.showModalDealActionFlowCreate()
  }

  private showModalDealActionFlowCreate() {
    EventBus.$on('showModalDealActionFlowCreate', (dealWorkflowId: number) => {
      this.dealWorkflowId = dealWorkflowId
      this.$bvModal.show('dealActionFlowCreateModal')
      this.dealActionFlow.workflow_id = this.dealWorkflowId
    })
  }

  private init() {
    return {
      workflow_id: undefined,
      action_id: undefined,
      action_result_id: undefined,
      lead_type_id: undefined,
      stage_id: undefined,
      status_code: undefined,
      next_action_id: undefined,
      next_action_time: undefined,
      next_action_timetype: undefined,
    } as IDealActionFlow
  }
}
