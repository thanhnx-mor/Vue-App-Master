import Vue from 'vue'
import Vuex from 'vuex'

import { UserStore } from '@/modules/users/store/index'
import { CustomerStore } from '@/modules/customers/store/index'
import { RoleStore } from '@/modules/roles/store/index'
import { SettingStore } from '@/modules/settings/store/index'
import { ContactStore } from '@/modules/contacts/store/index'
import { ProductStore } from '@/modules/products/store/index'
import { DealStore } from '@/modules/deals/store/index'
import { SaleStore } from '@/modules/sales/store/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user: UserStore,
    customer: CustomerStore,
    contact: ContactStore,
    product: ProductStore,
    deal: DealStore,
    role: RoleStore,
    setting: SettingStore,
    sale: SaleStore,
  },
})
