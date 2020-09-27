import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

import Mixins from '@/mixins'
import UserApi from '@/services/UserApi'
import { USER_STATUS_CODE_DEFAULT, UNPROCESSABLE_ENTITY, OK } from '@/types/const'
import { IUser } from '../../interface'
import EventBus from '@/event-bus'

@Component({
  computed: {
    ...mapGetters(['statusCodes', 'allRoles']),
  },
})

export default class Edit extends Mixins {
  protected statusCodes!: Array<{ code: number, label: string }>
  protected user: IUser = {
    id: -1,
    name: '',
    email: '',
    password: '',
    status_code: USER_STATUS_CODE_DEFAULT,
    roles: [],
  }
  protected serverErrors: object = {}
  protected isLoading: boolean = false
  private userApi: UserApi
  private userId!: number
  private userCached!: IUser

  constructor() {
    super()
    this.userApi = new UserApi()
  }

  get customStatusCodes() {
    if (!this.statusCodes.length) {
      return
    }

    return this.statusCodes.map((t) => ({
      ...t,
      value: t.code,
      text: t.label,
    }))
  }

  get isDisabled() {
    if (!this.user || !this.userCached) {
      return true
    }

    const isChange = (this.user.name !== this.userCached.name) ||
      (this.user.email !== this.userCached.email) ||
      (this.user.password !== this.userCached.password) ||
      (+this.user.status_code !== +this.userCached.status_code) ||
      (JSON.stringify(this.user.roles) !== JSON.stringify(this.userCached.roles))
    if (this.isLoading || !isChange) {
      return true
    }
    return false
  }

  protected async onSubmit(bvModalEvt: any) {
    bvModalEvt.preventDefault()
    const isValid = await (this.$refs.validationObserver as any).validate()
    if (!isValid) {
      return
    }

    this.isLoading = true
    this.user.password = this.user.password ? this.user.password : undefined
    const res = await this.userApi.update(this.userId, this.user)
    this.isLoading = false

    if (res.status === UNPROCESSABLE_ENTITY) {
      this.serverErrors = res.data.errors
      this.toastError('Cập nhật thành viên thất bại.')
      return
    }
    if (res.status === OK) {
      this.onCancel()
      this.$emit('onUpdated', true)
      this.$bvModal.hide('userUpdateModal')
      this.toastSuccess('Cập nhật thành viên thành công.')
    }
  }

  protected onCancel() {
    (this.$refs.validationObserver as any).reset()
    this.serverErrors = {}
    this.isLoading = false
  }

  private created() {
    this.showModalUserEdit()
  }

  private showModalUserEdit() {
    EventBus.$on('showModalUserEdit', (userId: number) => {
      this.userId = userId
      this.getUserById()
    })
  }

  private async getUserById() {
    const res = await this.userApi.show(this.userId)
    const data = res.data as IUser
    data.password = ''
    this.user = data
    if (this.user.roles && this.user.roles.length > 0) {
      (this.user.roles as any) = this.user.roles.map((role: any) => {
        return role.id
      })
    }
    this.userCached = Object.assign({}, data)
    this.$nextTick(() => {
      this.$bvModal.show('userUpdateModal')
    })
  }

}
