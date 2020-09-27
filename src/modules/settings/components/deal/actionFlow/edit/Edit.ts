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

export default class DealActionFlowUpdate extends Mixins {
  protected dealActionFlow: IDealActionFlow = this.init()
  protected dealActionFlowCached: IDealActionFlow = this.init()
  protected dealActions!: IDealAction[]
  protected dealActionResults!: IDealActionResult[]
  protected dealStages!: IDealStage[]
  protected dealLeadTypes!: IDealLeadType[]
  protected dealStatus!: IDealStatus[]
  protected isLoading: boolean = false
  protected serverErrors: object = {}
  protected dealWorkflowId!: number
  protected dealActionFlowId!: number
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
    const dealActionFlow: any = this.dealActionFlow
    const dealActionFlowCached: any = this.dealActionFlowCached
    if (!dealActionFlow || !dealActionFlowCached) {
      return true
    }

    const actionId = dealActionFlow.action_id && dealActionFlow.action_id.id || ''
    const actionIdCached = dealActionFlowCached.action_id && dealActionFlowCached.action_id.id || ''

    const actionResultId = dealActionFlow.action_result_id && dealActionFlow.action_result_id.id || ''
    const actionResultIdCached = dealActionFlowCached.action_result_id && dealActionFlowCached.action_result_id.id || ''

    const nextActionId = dealActionFlow.next_action_id && dealActionFlow.next_action_id.id || ''
    const nextActionIdCached = dealActionFlowCached.next_action_id && dealActionFlowCached.next_action_id.id || ''

    const nextActionTime = +dealActionFlow.next_action_time || ''
    const nextActionTimeCached = +dealActionFlowCached.next_action_time || ''

    const nextActionTimeType = dealActionFlow.next_action_timetype && dealActionFlow.next_action_timetype.id || ''
    const nextActionTimeTypeCached = dealActionFlowCached.next_action_timetype && dealActionFlowCached.next_action_timetype.id || ''

    const stageId = dealActionFlow.stage_id && dealActionFlow.stage_id.id || ''
    const stageIdCached = dealActionFlowCached.stage_id && dealActionFlowCached.stage_id.id || ''

    const leadTypeId = dealActionFlow.lead_type_id && dealActionFlow.lead_type_id.id || ''
    const leadTypeIdCached = dealActionFlowCached.lead_type_id && dealActionFlowCached.lead_type_id.id || ''

    const statusCode = dealActionFlow.status_code && dealActionFlow.status_code.id || ''
    const statusCodeCached = dealActionFlowCached.status_code && dealActionFlowCached.status_code.id || ''

    const isChange = (actionId !== actionIdCached) ||
      (actionResultId !== actionResultIdCached) ||
      (nextActionId !== nextActionIdCached) ||
      (nextActionTime !== nextActionTimeCached) ||
      (nextActionTimeType !== nextActionTimeTypeCached) ||
      (stageId !== stageIdCached) ||
      (leadTypeId !== leadTypeIdCached) ||
      (statusCode !== statusCodeCached)

    if (this.isLoading || !isChange) {
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

    this.dealApi.updateDealActionFlow(this.dealActionFlowId, dealActionFlow).then((res) => {
      this.isLoading = false

      if (res.status === UNPROCESSABLE_ENTITY) {
        this.serverErrors = res.data.errors
        this.toastError('Chỉnh sửa luồng tác nghiệp thất bại.')
        return
      }

      if (res.status === OK) {
        this.onCancel()
        this.$emit('onUpdated', true)
        this.$bvModal.hide('dealActionFlowUpdateModal')
        this.toastSuccess('Chỉnh sửa luồng tác nghiệp thành công.')
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
    this.showModalDealActionFlowEdit()
  }

  private showModalDealActionFlowEdit() {
    EventBus.$on('showModalDealActionFlowEdit', (data: any) => {
      this.dealWorkflowId = data.deal_workflow_id
      this.dealActionFlowId = data.deal_action_flow_id
      this.dealActionFlow.workflow_id = this.dealWorkflowId
      this.$bvModal.show('dealActionFlowUpdateModal')
      this.getDealActionFlowById()
    })
  }

  private getDealActionFlowById() {
    this.isLoading = true
    this.dealApi.detailsDealActionFlow(this.dealActionFlowId).then((res) => {
      let data: any = res.data as IDealActionFlow
      data = {
        ...data,
        action_id: data.action_id && this.dealActions.find((t) => t.id === data.action_id) || undefined,
        action_result_id: data.action_result_id && this.dealActionResults.find((t) => t.id === data.action_result_id) || undefined,
        next_action_id: data.next_action_id && this.dealActions.find((t) => t.id === data.next_action_id) || undefined,
        next_action_time: data.next_action_time || undefined,
        next_action_timetype: data.next_action_timetype && this.dealActionFlowTimeType.find((t) => t.id === data.next_action_timetype) || undefined,
        stage_id: data.stage_id && this.dealStages.find((t) => t.id === data.stage_id) || undefined,
        lead_type_id: data.lead_type_id && this.dealLeadTypes.find((t) => t.id === data.lead_type_id) || undefined,
        status_code: data.status_code && this.dealStatus.find((t) => t.id === data.status_code) || undefined,
      }
      this.dealActionFlow = data
      this.dealActionFlowCached = Object.assign({}, data)
      this.isLoading = false
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
