import { Component } from 'vue-property-decorator'

import { IMenu } from '@/types/interface'
import Mixins from '@/mixins'
import AuthApi from '@/services/AuthApi'

@Component({
})
export default class MainHeader extends Mixins {
  private authApi: AuthApi

  constructor() {
    super()
    this.authApi = new AuthApi()

  }

  protected logout() {
    this.authApi.logout()
    this.$router.push({ name: 'login' })
  }

  protected get menu(): IMenu[] {
    return [{
      name: 'Trang chủ',
      to: '/',
      hasPermission: true,
    }, {
      name: 'Khách hàng',
      to: { name: this.PERMISSION.CUSTOMER.INDEX },
      hasPermission: this.hasPermission([this.PERMISSION.CUSTOMER['*'],
      this.PERMISSION.CUSTOMER.INDEX]),
      listRouteNameNeedActive: [this.PERMISSION.CUSTOMER.INDEX, this.PERMISSION.CUSTOMER.SHOW],
    },
    //  {
    //   name: 'Liên hệ',
    //   to: { name: this.PERMISSION.CONTACT.INDEX },
    //   hasPermission: this.hasPermission([this.PERMISSION.CONTACT['*'],
    //   this.PERMISSION.CONTACT.INDEX]),
    //   listRouteNameNeedActive: [this.PERMISSION.CONTACT.INDEX, this.PERMISSION.CONTACT.SHOW],
    // },
    {
      name: 'Bán hàng',
      to: '#',
      hasPermission: true,
      isDropdown: true,
      listRouteNameNeedActive: [this.PERMISSION.DEAL.INDEX, this.PERMISSION.DEAL.SHOW,
      this.PERMISSION.PRODUCT.INDEX, this.PERMISSION.PRODUCT.SHOW],
      subItems: [
        {
          name: 'Đơn hàng',
          to: { name: this.PERMISSION.DEAL.INDEX },
          hasPermission: this.hasPermission([this.PERMISSION.DEAL['*'],
          this.PERMISSION.DEAL.INDEX]),
        }, {
          name: 'Sản phẩm',
          to: { name: this.PERMISSION.PRODUCT.INDEX },
          hasPermission: this.hasPermission([this.PERMISSION.PRODUCT['*'],
          this.PERMISSION.PRODUCT.INDEX]),
        },
      ],
    },
    {
      name: 'Thành viên',
      to: '#',
      hasPermission: true,
      isDropdown: true,
      listRouteNameNeedActive: [this.PERMISSION.USER.INDEX, this.PERMISSION.ROLE.INDEX],
      subItems: [
        {
          name: 'Tài khoản',
          to: { name: this.PERMISSION.USER.INDEX },
          hasPermission: this.hasPermission([this.PERMISSION.USER['*'],
          this.PERMISSION.USER.INDEX]),
        }, {
          name: 'Vai trò',
          to: { name: this.PERMISSION.ROLE.INDEX },
          hasPermission: this.hasPermission([this.PERMISSION.ROLE['*'],
          this.PERMISSION.ROLE.INDEX]),
        },
      ],
    },
    {
      name: 'Đơn hàng của tôi',
      to: { name: this.PERMISSION.DEAL.ME.INDEX },
      hasPermission: this.hasPermission([this.PERMISSION.DEAL['*'], this.PERMISSION.DEAL.ME['*'],
      this.PERMISSION.DEAL.ME.INDEX]),
      listRouteNameNeedActive: [this.PERMISSION.DEAL.ME.INDEX],
    },
    {
      name: 'Thanh toán đơn hàng',
      to: { name: this.PERMISSION.DEAL.PAYMENT.INDEX },
      hasPermission: this.hasPermission([this.PERMISSION.DEAL['*'], this.PERMISSION.DEAL.PAYMENT['*'],
      this.PERMISSION.DEAL.PAYMENT.INDEX]),
      listRouteNameNeedActive: [this.PERMISSION.DEAL.PAYMENT.INDEX],
    },
    ]
  }

  protected get configMenu(): IMenu[] {
    return [{
      name: 'Cài đặt trường thông tin KH',
      to: { name: this.PERMISSION.CUSTOMER.ATTRIBUTE.INDEX },
      hasPermission: this.hasPermission([this.PERMISSION.CUSTOMER['*'],
      this.PERMISSION.CUSTOMER.ATTRIBUTE['*'], this.PERMISSION.CUSTOMER.ATTRIBUTE.INDEX]),
    },
    // {
    //   name: 'Cài đặt trường thông tin LH',
    //   to: { name: this.PERMISSION.CONTACT.ATTRIBUTE.INDEX },
    //   hasPermission: this.hasPermission([this.PERMISSION.CONTACT['*'],
    //   this.PERMISSION.CONTACT.ATTRIBUTE['*'], this.PERMISSION.CONTACT.ATTRIBUTE.INDEX]),
    // },
    {
      name: 'Cài đặt trường thông tin SP',
      to: { name: this.PERMISSION.PRODUCT.ATTRIBUTE.INDEX },
      hasPermission: this.hasPermission([this.PERMISSION.PRODUCT['*'],
      this.PERMISSION.PRODUCT.ATTRIBUTE['*'], this.PERMISSION.PRODUCT.ATTRIBUTE.INDEX]),
    },
    {
      name: 'Cài đặt trường thông tin ĐH',
      to: { name: this.PERMISSION.DEAL.ATTRIBUTE.INDEX },
      hasPermission: this.hasPermission([this.PERMISSION.DEAL['*'],
      this.PERMISSION.DEAL.ATTRIBUTE['*'], this.PERMISSION.DEAL.ATTRIBUTE.INDEX]),
    },
    {
      name: 'Cài đặt quy trình làm việc',
      to: { name: this.PERMISSION.DEAL.WORKFLOW.INDEX },
      hasPermission: this.hasPermission([this.PERMISSION.DEAL.WORKFLOW['*'], this.PERMISSION.DEAL.WORKFLOW.INDEX]),
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
