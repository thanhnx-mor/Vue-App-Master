import { Component, Prop } from 'vue-property-decorator'
import Mixins from '@/mixins'
import { IDealActionHistory, IDealAction, IDealActionResult, IDealStage, IDealLeadType } from '@/modules/deals/interface'
import { IUser } from '@/modules/users/interface'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters(['allUsers', 'dealActions', 'dealActionResults', 'dealStages', 'dealLeadTypes']),
  },
})

export default class ListDealActionWithoutPagination extends Mixins {
  @Prop()
  protected dealActionHistories?: IDealActionHistory[]

  protected allUsers!: IUser[]
  protected dealActions!: IDealAction[]
  protected dealActionResults!: IDealActionResult[]
  protected dealStages!: IDealStage[]
  protected dealLeadTypes!: IDealLeadType[]
  protected dealActionInfoTimeType = [
    { id: 1, name: 'Phút' },
    { id: 2, name: 'Giờ' },
    { id: 3, name: 'Ngày' },
  ]

  protected getUserName(userId: number) {
    const user = this.allUsers.find((t) => t.id === userId)
    return user && user.name || ''
  }

  protected getDealActionResultName(dealActionResultId: number) {
    const dealActionResult = this.dealActionResults.find((t: any) => t.id === dealActionResultId)
    return dealActionResult && dealActionResult.name || ''
  }

  protected getDealActionName(dealActionId: number) {
    const dealAction = this.dealActions.find((t: any) => t.id === dealActionId)
    return dealAction && dealAction.name || ''
  }

  protected getDealStageName(dealStageId: number) {
    const dealStage = this.dealStages.find((t: any) => t.id === dealStageId)
    return dealStage && dealStage.name || ''
  }

  protected getDealLeadTypeName(dealLeadTypeId: number) {
    const dealLeadType = this.dealLeadTypes.find((t: any) => t.id === dealLeadTypeId)
    return dealLeadType && dealLeadType.name || ''
  }

  protected getNextActionTime(actionTimeValue: number, actionTimeType: number) {
    if (!actionTimeValue || !actionTimeType) {
      return
    }
    const dealActionFlowTimeType = this.dealActionInfoTimeType.find((t) => t.id === actionTimeType)
    if (!dealActionFlowTimeType) {
      return
    }
    return actionTimeValue + ' ' + dealActionFlowTimeType.name.toLocaleLowerCase()
  }
}
