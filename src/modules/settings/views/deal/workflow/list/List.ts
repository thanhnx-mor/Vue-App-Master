import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Mixins from '@/mixins'
import { IBreadcrumb, ITableField } from '@/types/interface'
import SidebarLeft from '../../../../components/sidebarLeft/SidebarLeft'
import CreateDealWorkFlow from '../../../../components/deal/workflow/create/Create'
import EditDealWorkFlow from '../../../../components/deal/workflow/edit/Edit'
import CreateDealActionFlow from '../../../../components/deal/actionFlow/create/Create'
import EditDealActionFlow from '../../../../components/deal/actionFlow/edit/Edit'
import EventBus from '@/event-bus'
import { GET_DEAL_WORKFLOWS, GET_DEAL_ACTION_FLOWS, GET_DEAL_ACTION_RESULTS, GET_DEAL_LEAD_TYPES, GET_DEAL_STAGES, GET_DEAL_ACTIONS } from '@/modules/deals/type'
import { IDealWorkflow, IDealLeadType, IDealStage, IDealActionResult, IDealAction, IDealActionFlow, IDealStatus } from '@/modules/deals/interface'

@Component({
  components: {
    SidebarLeft,
    CreateDealWorkFlow,
    EditDealWorkFlow,
    CreateDealActionFlow,
    EditDealActionFlow,
  },
  computed: {
    ...mapGetters(['dealWorkflows', 'dealActions', 'dealActionResults', 'dealActionFlows', 'dealStages', 'dealLeadTypes', 'dealStatus']),
  },
})

export default class DealWorkFlow extends Mixins {
  protected isLoading: boolean = false
  protected dealWorkflows!: IDealWorkflow[]
  protected dealActions!: IDealAction[]
  protected dealActionResults!: IDealActionResult[]
  protected dealStages!: IDealStage[]
  protected dealLeadTypes!: IDealLeadType[]
  protected dealActionFlows!: IDealActionFlow[]
  protected dealStatus!: IDealStatus[]
  protected fields: ITableField[] = [{
    key: 'actions',
    label: 'Hành động',
    tdClass: 'td-actions',
  }, {
    key: 'action',
    label: 'Hành động',
  }, {
    key: 'action_result',
    label: 'Kết quả hành xử lý',
  }, {
    key: 'next_action',
    label: 'Hành động tiếp theo',
  }, {
    key: 'next_action_time',
    label: 'Thời gian diễn ra hành động tiếp theo',
  }, {
    key: 'stage',
    label: 'Trạng thái xử lý',
  }, {
    key: 'lead_type',
    label: 'Loại lead',
  }, {
    key: 'status',
    label: 'Trạng thái đơn hàng',
  }]
  protected breadcrumbItems: IBreadcrumb[] = [{
    text: 'Trang chủ',
    to: '/',
  }, {
    text: 'Cài đặt quy trình làm việc',
  }, {
    text: 'Quy trình làm việc',
    active: true,
  }]
  protected dealActionFlowTimeType = [
    { id: 1, name: 'Phút' },
    { id: 2, name: 'Giờ' },
    { id: 3, name: 'Ngày' },
  ]

  protected get items() {
    if (!this.dealWorkflows || !this.dealWorkflows.length) {
      return []
    }
    return this.dealWorkflows
  }

  constructor() {
    super()
  }

  public destroyed() {
    EventBus.$off('showModalDealWorkflowEdit')
    EventBus.$off('showModalDealActionFlowCreate')
    EventBus.$off('showModalDealActionFlowEdit')
  }

  protected onEditDealWorkflow(id: number) {
    EventBus.$emit('showModalDealWorkflowEdit', id)
  }

  protected onCreateDealActionFlow(dealWorkflowId: number) {
    EventBus.$emit('showModalDealActionFlowCreate', dealWorkflowId)
  }

  protected onEditDealActionFlow(dealWorkflowId: number, dealActionFlowId: number) {
    EventBus.$emit('showModalDealActionFlowEdit', { deal_workflow_id: dealWorkflowId, deal_action_flow_id: dealActionFlowId })
  }

  protected onRefresh(isSuccess: boolean) {
    if (isSuccess) {
      this.fetchDealWorkflow()
    }
  }

  protected convertDataDealActionFlows(dealActionFlows: any) {
    if (!dealActionFlows.length) {
      return []
    }
    return dealActionFlows.map((t: any) => {
      return {
        ...t,
        action: this.getNameByIdAndData(t.action_id, this.dealActions),
        action_result: this.getNameByIdAndData(t.action_result_id, this.dealActionResults),
        next_action: this.getNameByIdAndData(t.next_action_id, this.dealActions),
        next_action_time: this.getNextActionTime(t.next_action_time, t.next_action_timetype),
        stage: this.getNameByIdAndData(t.stage_id, this.dealStages),
        lead_type: this.getNameByIdAndData(t.lead_type_id, this.dealLeadTypes),
        status: this.getNameByIdAndData(t.status_code, this.dealStatus),
      }
    })
  }

  private created() {
    this.fetch()
  }

  private async fetch() {
    this.isLoading = true
    this.$store.dispatch(GET_DEAL_ACTIONS)
    this.$store.dispatch(GET_DEAL_ACTION_RESULTS)
    this.$store.dispatch(GET_DEAL_STAGES)
    this.$store.dispatch(GET_DEAL_LEAD_TYPES)
    await this.fetchDealWorkflow()
    this.isLoading = false
  }

  private async fetchDealWorkflow() {
    await this.$store.dispatch(GET_DEAL_WORKFLOWS)
  }

  private getNameByIdAndData(id: number, data: any) {
    const item = data.find((t: any) => t.id === id)
    return item && item.name || undefined
  }

  private getNextActionTime(actionTimeValue: number, actionTimeType: number) {
    if (!actionTimeValue || !actionTimeType) {
      return
    }
    const dealActionFlowTimeType = this.dealActionFlowTimeType.find((t) => t.id === actionTimeType)
    if (!dealActionFlowTimeType) {
      return
    }
    return actionTimeValue + ' ' + dealActionFlowTimeType.name.toLocaleLowerCase()
  }
}
