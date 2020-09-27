import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Mixins from '@/mixins'
import { IBreadcrumb, ITableField } from '@/types/interface'
import SidebarLeft from '../../../../components/sidebarLeft/SidebarLeft'
import Create from '../../../../components/deal/action/create/Create'
import Edit from '../../../../components/deal/action/edit/Edit'
import { IDealAction } from '@/modules/deals/interface'
import { GET_DEAL_ACTIONS } from '@/modules/deals/type'
import EventBus from '@/event-bus'
import moment from 'moment'

@Component({
  components: {
    SidebarLeft,
    Create,
    Edit,
  },
  computed: {
    ...mapGetters(['dealActions']),
  },
})

export default class DealActionList extends Mixins {
  protected isLoading: boolean = false
  protected dealActions!: IDealAction[]
  protected fields: ITableField[] = [{
    key: 'actions',
    label: 'Hành động',
    tdClass: 'td-actions',
  }, {
    key: 'name',
    label: 'Tên hành động',
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
    text: 'Danh sách hành động',
    active: true,
  }]

  protected get items() {
    if (!this.dealActions || !this.dealActions.length) {
      return []
    }
    return this.dealActions.map((t) => {
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
    EventBus.$off('showModalDealActionEdit')
  }

  protected onEdit(id: number) {
    EventBus.$emit('showModalDealActionEdit', id)
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
    this.$store.dispatch(GET_DEAL_ACTIONS).then(() => {
      this.isLoading = false
    })
  }
}
