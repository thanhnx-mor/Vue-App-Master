import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Mixins from '@/mixins'
import { IBreadcrumb, ITableField } from '@/types/interface'
import SidebarLeft from '../../../../components/sidebarLeft/SidebarLeft'
import Create from '../../../../components/deal/actionResult/create/Create'
import Edit from '../../../../components/deal/actionResult/edit/Edit'
import { GET_DEAL_ACTION_RESULTS } from '@/modules/deals/type'
import EventBus from '@/event-bus'
import moment from 'moment'
import { IDealActionResult } from '@/modules/deals/interface'

@Component({
  components: {
    SidebarLeft,
    Create,
    Edit,
  },
  computed: {
    ...mapGetters(['dealActionResults']),
  },
})

export default class DealActionResultList extends Mixins {

  protected isLoading: boolean = false
  protected dealActionResults!: IDealActionResult[]
  protected fields: ITableField[] = [{
    key: 'actions',
    label: 'Hành động',
    tdClass: 'td-actions',
  }, {
    key: 'name',
    label: 'Tên kết quả xử lý',
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
    text: 'Danh sách kết quả xử lý',
    active: true,
  }]

  protected get items() {
    if (!this.dealActionResults || !this.dealActionResults.length) {
      return []
    }
    return this.dealActionResults.map((t) => {
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
    EventBus.$off('showModalDealActionResultEdit')
  }

  protected onEdit(id: number) {
    EventBus.$emit('showModalDealActionResultEdit', id)
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
    this.$store.dispatch(GET_DEAL_ACTION_RESULTS).then(() => {
      this.isLoading = false
    })
  }
}
