import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Mixins from '@/mixins'
import { IBreadcrumb, ITableField } from '@/types/interface'
import SidebarLeft from '../../../../components/sidebarLeft/SidebarLeft'
import Create from '../../../../components/deal/stage/create/Create'
import Edit from '../../../../components/deal/stage/edit/Edit'
import { IDealStage } from '@/modules/deals/interface'
import moment from 'moment'
import EventBus from '@/event-bus'
import { GET_DEAL_STAGES } from '@/modules/deals/type'

@Component({
  components: {
    SidebarLeft,
    Create,
    Edit,
  },
  computed: {
    ...mapGetters(['dealStages']),
  },
})

export default class DealStage extends Mixins {
  protected isLoading: boolean = false
  protected dealStages!: IDealStage[]
  protected fields: ITableField[] = [{
    key: 'actions',
    label: 'Hành động',
    tdClass: 'td-actions',
  }, {
    key: 'name',
    label: 'Tên trạng thái xử lý',
  }, {
    key: 'created_at',
    label: 'Ngày tạo',
  }, {
    key: 'updated_at',
    label: 'Ngày cập nhật',
  }]
  protected breadcrumbItems: IBreadcrumb[] = [{
    text: 'Trang chủ',
    to: '/',
  }, {
    text: 'Cài đặt quy trình làm việc',
  }, {
    text: 'Danh sách trạng thái xử lý',
    active: true,
  }]

  protected get items() {
    if (!this.dealStages || !this.dealStages.length) {
      return []
    }
    return this.dealStages.map((t) => {
      return {
        ...t,
        created_at: moment(t.created_at).format('DD/MM/YYYY'),
        updated_at: moment(t.created_at).format('DD/MM/YYYY'),
      }
    })
  }

  constructor() {
    super()
  }

  public destroyed() {
    EventBus.$off('showModalDealStageEdit')
  }

  protected onEdit(id: number) {
    EventBus.$emit('showModalDealStageEdit', id)
  }

  protected onRefresh(isSuccess: boolean) {
    if (isSuccess) {
      this.fetch()
    }
  }

  private created() {
    this.fetch()
  }

  private fetch() {
    this.isLoading = true
    this.$store.dispatch(GET_DEAL_STAGES).then(() => {
      this.isLoading = false
    })
  }
}
