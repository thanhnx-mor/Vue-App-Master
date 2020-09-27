import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Mixins from '@/mixins'
import { IBreadcrumb, ITableField } from '@/types/interface'
import SidebarLeft from '../../../../components/sidebarLeft/SidebarLeft'
import EventBus from '@/event-bus'
import moment from 'moment'
import { GET_DEAL_LEAD_TYPES } from '@/modules/deals/type'
import { IDealLeadType } from '@/modules/deals/interface'
import Create from '../../../../components/deal/leadType/create/Create'
import Edit from '../../../../components/deal/leadType/edit/Edit'

@Component({
  components: {
    SidebarLeft,
    Create,
    Edit,
  },
  computed: {
    ...mapGetters(['dealLeadTypes']),
  },
})

export default class DealLeadType extends Mixins {

  protected isLoading: boolean = false
  protected dealLeadTypes!: IDealLeadType[]
  protected fields: ITableField[] = [{
    key: 'actions',
    label: 'Hành động',
    tdClass: 'td-actions',
  }, {
    key: 'name',
    label: 'Tên lead',
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
    text: 'Danh sách phân loại lead',
    active: true,
  }]

  protected get items() {
    if (!this.dealLeadTypes || !this.dealLeadTypes.length) {
      return []
    }
    return this.dealLeadTypes.map((t) => {
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
    EventBus.$off('showModalDealLeadTypeEdit')
  }

  protected onEdit(id: number) {
    EventBus.$emit('showModalDealLeadTypeEdit', id)
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
    this.$store.dispatch(GET_DEAL_LEAD_TYPES).then(() => {
      this.isLoading = false
    })
  }
}
