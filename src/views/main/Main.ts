import { Component, Watch } from 'vue-property-decorator'
import Mixins from '@/mixins'

import MainHeader from '@/components/mainHeader/MainHeader'
import MainFooter from '@/components/mainFooter/MainFooter'
import { GET_CURRENT_USER, GET_ALL_USERS } from '@/modules/users/type'
import Forbidden from '@/views/errors/forbidden/Forbidden.vue'
import ForbiddenModal from '@/views/errors/forbidden-modal/ForbiddenModal.vue'

@Component({
  components: {
    MainHeader,
    MainFooter,
    Forbidden,
    ForbiddenModal,
  },
})

export default class Main extends Mixins {
  protected isForbidden = false

  constructor() {
    super()
  }

  @Watch('$route', { immediate: true, deep: true })
  public onUrlChange(route: any) {
    this.isForbidden = false
    const routeName = route.name || undefined
    const routeHasPermission = route.meta.hasPermission || false
    this.checkHasViewPageByRouteName(routeName, routeHasPermission)
  }

  private created() {
    this.getAllUsers()
    this.getCurrentUser()
  }

  private getAllUsers() {
    this.$store.dispatch(GET_ALL_USERS)
  }

  private getCurrentUser() {
    this.$store.dispatch(GET_CURRENT_USER).then(() => {
      const routeName = this.$router.currentRoute.name || undefined
      const routeHasPermission = this.$router.currentRoute.meta.hasPermission || false
      this.checkHasViewPageByRouteName(routeName, routeHasPermission)
    })
  }

  private checkHasViewPageByRouteName(routeName: any, routeHasPermission: boolean = false) {
    if (routeHasPermission) {
      this.isForbidden = false
      return
    }
    const currentUser = this.currentUser || {}
    const permissions = currentUser.permissions || []
    let hasPermission: boolean = false
    this.isForbidden = false
    if (routeName === 'main') {
      return
    }
    if (!Object.keys(currentUser).length) {
      return
    }
    if (this.isSuperAdmin(currentUser.id)) {
      return
    }
    if (routeName) {
      const arrayRouteName: string[] = routeName.split('.')
      const newArrayRouteName: string[] = []
      arrayRouteName.forEach((name: string, index: number) => {
        const newRouteName = arrayRouteName.slice(0, index + 1)
        if (newRouteName.length) {
          newArrayRouteName.push(newRouteName.join('.'))
        }
      })
      if (newArrayRouteName.length) {
        newArrayRouteName.forEach((name) => {
          if (permissions.includes(name)) {
            hasPermission = true
          }
        })
      }
      if (!hasPermission) {
        this.isForbidden = true
        return
      }
    }
  }
}
