import { Component, Prop, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Mixins from '@/mixins'
import { IDealActionFlow, IDealAction, IDealActionResult, IDealStage, IDealLeadType, IDealWorkflow } from '@/modules/deals/interface'
import Multiselect from 'vue-multiselect'
import { DEAL_STATUS_OPEND_CODE } from '@/types/const'
@Component({
  components: {
    Multiselect,
  },
  computed: {
    ...mapGetters(['dealWorkflows', 'dealActions', 'dealActionResults', 'dealStages', 'dealLeadTypes']),
  },
})

export default class CreateActionHistory extends Mixins {
  @Prop()
  protected dealActionInfo?: any
  @Prop()
  protected serverErrors?: any
  @Prop()
  protected latestActionHistory?: any

  protected actionInfo: object = this.dealActionInfo
  protected dealActions!: IDealAction[]
  protected dealActionResults!: IDealActionResult[]
  protected dealStages!: IDealStage[]
  protected dealLeadTypes!: IDealLeadType[]
  protected dealWorkflows!: IDealWorkflow[]
  protected dealActionInfoTimeType = [
    { id: 1, name: 'Phút' },
    { id: 2, name: 'Giờ' },
    { id: 3, name: 'Ngày' },
  ]

  constructor() {
    super()
  }

  @Watch('actionInfo', { immediate: true, deep: true })
  public onChangeActionInfo(newVal: any) {
    this.$emit('updateDataDealActionInfo', newVal)
  }

  protected setDataDealAction(actionInfo: any, slug: string = '') {
    this.$nextTick(() => {
      if (slug) {
        this.resetAttributeError(slug, this.serverErrors)
      }
      if (!actionInfo) {
        return
      }
      const actionId: number = actionInfo.action_id && actionInfo.action_id.id || undefined
      const actionResultId: number = actionInfo.action_result_id && actionInfo.action_result_id.id || undefined
      if (!actionId || !actionResultId) {
        return
      }
      const dealActionFlows = this.getDealActionFlowsByDealWorkflowId(actionInfo.workflow_id)
      if (!dealActionFlows || !dealActionFlows.length) {
        return
      }
      const dealActionFlow: any = dealActionFlows.find((t: any) => (t.action_id === actionId && t.action_result_id === actionResultId))
      if (!dealActionFlow) {
        actionInfo = {
          ...actionInfo,
          next_action_id: undefined,
          next_action_time: undefined,
          next_action_timetype: undefined,
          stage_id: undefined,
          lead_type_id: undefined,
        }
        this.actionInfo = actionInfo
        return
      }
      this.actionInfo = this.setDataDealActionFlowByDealActionFlow(actionInfo, dealActionFlow)
      this.$forceUpdate()
    })
  }

  private created() {
    this.setData()
  }

  private setData() {
    let actionInfo = this.dealActionInfo
    const nextActionId: number = this.latestActionHistory.next_action_id || undefined
    const dealActionFlows = this.getDealActionFlowsByDealWorkflowId(actionInfo.workflow_id)
    const dealActionFlow: any = dealActionFlows.find((t: any) => (t.action_id === nextActionId))

    if (!this.latestActionHistory || !Object.keys(this.latestActionHistory).length) {
      // set default data deal action info no action history
      const dealActionFlowOpen: any = dealActionFlows.find((t: any) => (t.status_code === DEAL_STATUS_OPEND_CODE))
      actionInfo = {
        ...actionInfo,
        action_id: this.dealActions.find((t) => t.id === dealActionFlowOpen.action_id) || undefined,
        action_result_id: this.dealActionResults.find((t) => t.id === dealActionFlowOpen.action_result_id) || undefined,
      }
      this.actionInfo = this.setDataDealActionFlowByDealActionFlow(actionInfo, dealActionFlowOpen)
      return
    }

    if (dealActionFlow) {
      actionInfo = {
        ...actionInfo,
        action_id: this.dealActions.find((t) => t.id === dealActionFlow.action_id) || undefined,
        action_result_id: this.dealActionResults.find((t) => t.id === dealActionFlow.action_result_id) || undefined,
      }
    }
    this.setDataDealAction(actionInfo)
  }

  private getDealActionFlowsByDealWorkflowId(workflowId: number) {
    const dealWorkflow = this.dealWorkflows.find((t) => t.id === workflowId)
    return dealWorkflow && dealWorkflow.deal_action_flows as IDealActionFlow[] || []
  }

  private setDataDealActionFlowByDealActionFlow(dealActionInfo: any, dealActionFlow: any) {
    return {
      ...dealActionInfo,
      next_action_id: this.dealActions.find((t) => t.id === dealActionFlow.next_action_id) || undefined,
      next_action_time: dealActionFlow.next_action_time || undefined,
      next_action_timetype: this.dealActionInfoTimeType.find((t) => t.id === dealActionFlow.next_action_timetype) || undefined,
      stage_id: this.dealStages.find((t) => t.id === dealActionFlow.stage_id) || undefined,
      lead_type_id: this.dealLeadTypes.find((t) => t.id === dealActionFlow.lead_type_id) || undefined,
    }
  }
}
