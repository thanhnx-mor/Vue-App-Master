import { Component } from 'vue-property-decorator'

import Mixins from '@/mixins'
import { IMenu } from '@/types/interface'

@Component
export default class SidebarLeft extends Mixins {
  constructor() {
    super()
  }
  protected get menu(): IMenu[] {
    return [
      {
        name: 'Trường thông tin KH',
        to: { name: this.PERMISSION.CUSTOMER.ATTRIBUTE.INDEX },
        hasPermission: this.hasPermission([this.PERMISSION.CUSTOMER['*'],
        this.PERMISSION.CUSTOMER.ATTRIBUTE['*'], this.PERMISSION.CUSTOMER.ATTRIBUTE.INDEX]),
      },
      // {
      //   name: 'Trường thông tin LH',
      //   to: { name: this.PERMISSION.CONTACT.ATTRIBUTE.INDEX },
      //   hasPermission: this.hasPermission([this.PERMISSION.CONTACT['*'],
      //   this.PERMISSION.CONTACT.ATTRIBUTE['*'], this.PERMISSION.CONTACT.ATTRIBUTE.INDEX]),
      // },
      {
        name: 'Trường thông tin SP',
        to: { name: this.PERMISSION.PRODUCT.ATTRIBUTE.INDEX },
        hasPermission: this.hasPermission([this.PERMISSION.PRODUCT['*'],
        this.PERMISSION.PRODUCT.ATTRIBUTE['*'], this.PERMISSION.PRODUCT.ATTRIBUTE.INDEX]),
      },
      {
        name: 'Trường thông tin ĐH',
        to: { name: this.PERMISSION.DEAL.ATTRIBUTE.INDEX },
        hasPermission: this.hasPermission([this.PERMISSION.DEAL['*'],
        this.PERMISSION.DEAL.ATTRIBUTE['*'], this.PERMISSION.DEAL.ATTRIBUTE.INDEX]),
      },
      {
        name: 'Cài đặt quy trình làm việc',
        to: '#',
        hasPermission: this.hasPermission([this.PERMISSION.DEAL.WORKFLOW['*'], this.PERMISSION.DEAL.WORKFLOW.INDEX]),
        isSubItem: true,
        isSubItemName: 'subItemWorkflow',
        class: 'has-sub-item',
        listRouteNameNeedActive: [this.PERMISSION.DEAL.WORKFLOW.INDEX, 'dealAction', 'dealActionResult', 'dealStage', 'dealLeadType'],
        subItems: [
          {
            name: 'Quy trình làm việc',
            to: { name: this.PERMISSION.DEAL.WORKFLOW.INDEX },
            hasPermission: this.hasPermission([this.PERMISSION.DEAL.WORKFLOW['*'], this.PERMISSION.DEAL.WORKFLOW.INDEX]),
          },
          {
            name: 'Danh sách hành động',
            to: { name: 'dealAction' },
            hasPermission: true,
          },
          {
            name: 'Danh sách kết quả xử lý',
            to: { name: 'dealActionResult' },
            hasPermission: true,
          },
          {
            name: 'Danh sách trạng thái xử lý',
            to: { name: 'dealStage' },
            hasPermission: true,
          },
          {
            name: 'Danh sách phân loại lead',
            to: { name: 'dealLeadType' },
            hasPermission: true,
          },
        ],
      },
      {
        name: 'Quản lý nhân viên bán hàng',
        to: { name: this.PERMISSION.SALE_MANAGEMENT.INDEX },
        hasPermission: this.hasPermission([this.PERMISSION.SALE_MANAGEMENT['*'],
        this.PERMISSION.SALE_MANAGEMENT.INDEX]),
      },
    ]
  }
}
