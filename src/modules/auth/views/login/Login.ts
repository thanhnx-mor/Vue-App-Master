import Mixins from '@/mixins'
import { Component } from 'vue-property-decorator'

import AuthApi from '@/services/AuthApi'
import { UNAUTHORIZED, FORBIDDEN_ACCESS } from '@/types/const'

@Component
export default class Login extends Mixins {

  protected form: { email: string, password: string } = { email: '', password: '' }
  protected isLoading: boolean = false
  protected isError: boolean = false
  protected msgError: string = ''
  private authApi: AuthApi

  constructor() {
    super()
    this.authApi = new AuthApi()
  }

  protected reset() {
    this.form = {
      email: '',
      password: '',
    }
    this.isError = false
    this.msgError = ''
    this.$nextTick(() => {
      (this.$refs.observer as any).reset()
    })
  }

  protected onSubmit() {
    this.isLoading = true
    this.isError = false
    this.authApi.login(this.form).then((res) => {
      this.isLoading = false
      const data = res as any
      switch (data.status) {
        case UNAUTHORIZED:
          this.isError = true
          this.msgError = 'Email hoặc mật khẩu không chính xác'
          return
        case FORBIDDEN_ACCESS:
          this.isError = true
          this.msgError = 'Không có quyền truy cập. Vui lòng liên hệ với quản trị'
          return
      }
      if (data.access_token) {
        this.authApi.setToken(data.access_token)
        const { returnUrl } = this.$route.query
        this.$router.push({ path: returnUrl as string || '/' })
      } else {
        this.toastError('Some error has occurred!')
      }
    })
  }
}
