import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

import Mixins from '@/mixins'
import { USER_STATUS_CODE_DEFAULT, OK, UNPROCESSABLE_ENTITY } from '@/types/const'
import UserApi from '@/services/UserApi'
import { IUser } from '../../interface'

@Component({
  computed: {
    ...mapGetters(['statusCodes', 'allRoles']),
  },
})

export default class Create extends Mixins {
  protected statusCodes!: Array<{ code: number, label: string }>
  protected user: IUser = this.initUser()
  protected serverErrors: object = {}
  protected isLoading: boolean = false
  private userApi: UserApi

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

  protected async onSubmit(bvModalEvt: any) {
    bvModalEvt.preventDefault()
    const isValid = await (this.$refs.validationObserver as any).validate()
    if (!isValid) {
      return
    }
    this.isLoading = true
    const res = await this.userApi.create(this.user)
    this.isLoading = false
    if (res.status === UNPROCESSABLE_ENTITY) {
      this.serverErrors = res.data.errors
      this.toastError('Thêm thành viên thất bại.')
      return
    }
    if (res.status === OK) {
      this.onCancel()
      this.$emit('onCreated', true)
      this.$bvModal.hide('userCreateModal')
      this.toastSuccess('Thêm thành viên thành công.')
    }
  }

  protected onCancel() {
    (this.$refs.validationObserver as any).reset()
    this.serverErrors = {}
    this.isLoading = false
    this.user = this.initUser()
  }

  private initUser() {
    return this.user = {
      name: '',
      email: '',
      password: '',
      status_code: USER_STATUS_CODE_DEFAULT,
    } as IUser
  }
}
