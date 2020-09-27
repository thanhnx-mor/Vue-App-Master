import { Component } from 'vue-property-decorator'

import Mixins from '@/mixins'
import { IMenu } from '@/types/interface'

@Component
export default class UserSidebarLeft extends Mixins {
  constructor() {
    super()
  }
  protected get menu(): IMenu[] {
    return [
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
    ]
  }
}
