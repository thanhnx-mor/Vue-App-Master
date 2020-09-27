import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Mixins from '@/mixins'
import EventBus from '@/event-bus'

import {
  GET_CUSTOMER_ATTRIBUTES,
  GET_CUSTOMER_ATTRIBUTE_CREATE,
  GET_CUSTOMER_ATTRIBUTE_SHOW,
  GET_CUSTOMER_ATTRIBUTE_UPDATE,
  GET_CUSTOMER_ATTRIBUTE_DELETE,
  GET_CUSTOMER_CHECK_BEFORE_ATTRIBUTE_DELETE,
} from '@/modules/customers/type'
import { GET_ATTRIBUTE_INPUT_TYPES } from '@/modules/settings/type'
import { IBreadcrumb, ITableField } from '@/types/interface'
import { IAttribute, IAttributeInputType } from '../../../../interface'

import SidebarLeft from '../../../../components/sidebarLeft/SidebarLeft'
import Create from '../../../../components/attributes/create/Create'
import Edit from '../../../../components/attributes/edit/Edit'
import Delete from '../../../../components/attributes/delete/Delete'

@Component({
  components: {
    SidebarLeft,
    Create,
    Edit,
    Delete,
  },
  computed: {
    ...mapGetters(['customerAttributes', 'attributeInputTypes']),
  },
})

export default class ListCustomerAttributes extends Mixins {

  protected breadcrumbItems: IBreadcrumb[] = [{
    text: 'Trang chủ',
    to: '/',
  }, {
    text: 'Cài đặt trường thông tin KH',
    active: true,
  }]

  protected customerAttributes!: IAttribute[]
  protected attributeInputTypes!: IAttributeInputType[]
  protected GET_CUSTOMER_ATTRIBUTE_CREATE: string = GET_CUSTOMER_ATTRIBUTE_CREATE
  protected GET_CUSTOMER_ATTRIBUTE_SHOW: string = GET_CUSTOMER_ATTRIBUTE_SHOW
  protected GET_CUSTOMER_ATTRIBUTE_UPDATE: string = GET_CUSTOMER_ATTRIBUTE_UPDATE
  protected GET_CUSTOMER_ATTRIBUTE_DELETE: string = GET_CUSTOMER_ATTRIBUTE_DELETE
  protected GET_CUSTOMER_CHECK_BEFORE_ATTRIBUTE_DELETE: string = GET_CUSTOMER_CHECK_BEFORE_ATTRIBUTE_DELETE
  protected prefix: string = '_kh'

  protected fields: ITableField[] = [{
    key: 'actions',
    label: 'Hành động',
    tdClass: 'td-actions',
  }, {
    key: 'name',
    label: 'Tên trường dữ liệu',
  }, {
    key: 'slug',
    label: 'Slug',
  }, {
    key: 'attribute_input_type_name',
    label: 'Kiểu điền dữ liệu',
  }, {
    key: 'is_required',
    label: 'Bắt buộc',
  }, {
    key: 'is_unique',
    label: 'Không cho trùng',
  }, {
    key: 'is_enabled',
    label: 'Hiển thị',
  }]

  constructor() {
    super()
  }

  get attributes() {
    if (!this.customerAttributes.length) {
      return []
    }

    return this.customerAttributes.map((t: IAttribute) => {
      return {
        ...t,
        name: t.is_default ? t.name + '<span class="small"> (Mặc định)</span>' : t.name,
        is_required: t.is_required ? true : false,
        is_unique: t.is_unique ? true : false,
        is_enabled: t.is_enabled ? true : false,
        attribute_input_type_name: this.customAttributeInputTypes[t.attribute_input_type_id],
      }
    })
  }

  public destroyed() {
    EventBus.$off(this.prefix + 'ShowModalAttributeEdit')
    EventBus.$off(this.prefix + 'ShowModalAttributeDelete')
  }

  get customAttributeInputTypes() {
    const attributeInputTypes: { [key: number]: string } = {}
    this.attributeInputTypes.forEach((t) => {
      attributeInputTypes[t.id] = t.name
    })
    return attributeInputTypes
  }

  protected rowClass(item: any, type: any) {
    if (!item || type !== 'row') { return }
    if (item.is_default) { return 'table-row-disabled-bg' }
  }

  protected onEdit(id: number) {
    EventBus.$emit(this.prefix + 'ShowModalAttributeEdit', id)
  }

  protected onDelete(attribute: object) {
    EventBus.$emit(this.prefix + 'ShowModalAttributeDelete', attribute)
  }

  protected onRefresh(isSuccess: boolean) {
    if (isSuccess) {
      this.fetchCustomerAttributes()
    }
  }

  private created() {
    this.fetchCustomerAttributes()
    this.fetchAttributeInputTypes()
  }

  private fetchCustomerAttributes() {
    this.$store.dispatch(GET_CUSTOMER_ATTRIBUTES)
  }

  private fetchAttributeInputTypes() {
    this.$store.dispatch(GET_ATTRIBUTE_INPUT_TYPES)
  }
}
