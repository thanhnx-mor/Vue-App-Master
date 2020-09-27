import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Vue from 'vue'

import { TOAST_SUCCESS, TOAST_ERROR, TOAST_INFO, TOAST_WARNING, SUPPERADMIN_ID } from '@/types/const'
import { InputType } from './types/enum'
import { IUser } from '@/modules/users/interface'
import { PERMISSION } from '@/types/permissions'

@Component({
  computed: {
    ...mapGetters(['currentUser']),
  },
})
export default class Mixins extends Vue {
  public PERMISSION = PERMISSION
  public currentUser!: IUser
  public isMaxLengthText: number = 250
  public isMaxLengthTextarea: number = 1025
  public messageNotPermission: string = 'Bạn không có quyền. Vui lòng liên hệ quản trị viên.'

  protected $snotify: any

  public toastSuccess(msg: string) {
    this.$snotify.success(msg, TOAST_SUCCESS)
  }

  public toastError(msg: string) {
    this.$snotify.error(msg, TOAST_ERROR)
  }

  public toastInfo(msg: string) {
    this.$snotify.info(msg, TOAST_INFO)
  }

  public toastWarning(msg: string) {
    this.$snotify.warning(msg, TOAST_WARNING)
  }

  public isSuperAdmin(id: number) {
    if (SUPPERADMIN_ID === id) { return true }
    return false
  }

  public hasPermission(permissionsName: string[] = []) {
    const currentUser = this.currentUser
    const permissions = currentUser.permissions || []
    let hasPermission = false
    if (!currentUser) {
      return
    }
    if (this.isSuperAdmin(currentUser.id)) {
      return true
    }
    if (permissions && permissions.length && permissionsName.length) {
      permissionsName.forEach((permissionName) => {
        if (permissions.includes(permissionName)) {
          hasPermission = true
        }
      })
    }
    if (hasPermission) {
      return true
    }
    return false
  }

  public getValidationState({ dirty = null, validated = null, valid = null }) {
    return dirty || validated ? valid : null
  }

  public resetAttributeError(attributre: string, errors: { [key: string]: string } = {}) {
    if (errors && errors[attributre]) {
      errors[attributre] = ''
    }
  }

  public getRules(filed: { is_required: number, attribute_input_type_id: number }) {
    const rules = { required: !!filed.is_required }
    switch (filed.attribute_input_type_id) {
      case InputType['Text/ Văn bản']:
        return { ...rules, max: 250 }
      case InputType['Date/ Ngày tháng năm']:
        return { ...rules }
      case InputType['Datetime/ Ngày giờ']:
        return { ...rules }
      case InputType['Phone/ Số điện thoại']:
        return { ...rules, numeric: true, min: 10, max: 12 }
      case InputType['Email/ Thư điện tử']:
        return { ...rules, email: true, max: 250 }
      case InputType['Number/ Số']:
        return { ...rules, regex: this.regexNumber() }
      case InputType['Price/ Tiền tệ']:
        return { ...rules, numeric: true }
      case InputType['Select/ 1 lựa chọn']:
        return { ...rules }
      case InputType['Select/ Nhiều lựa chọn']:
        return { ...rules }
      case InputType['Textarea/ Đoạn văn bản']:
        return { ...rules, max: 1025 }
      case InputType['Checkbox/ Nhiều lựa chọn']:
        return { ...rules }
      case InputType['Radio/ 1 lựa chọn']:
        return { ...rules }
      case InputType['User/ 1 người dùng']:
        return { ...rules }
      case InputType['Users/ Nhiều người dùng']:
        return { ...rules }
      default:
        return rules
    }
  }

  public regexNumber() {
    return /^\d*\.?\d{1,2}$/
  }

  public regexPayment() {
    return /^[-]?[1-9]{1}[0-9]*$/
  }

  public checkValueInputTypeNumber(value: string) {
    return value.match(this.regexNumber())
  }

  public scrollToViewFirstError(elId: any, minusHeight: number = 0) {
    const bodyContent = document.getElementById(elId)
    const isInValid = bodyContent?.getElementsByClassName('is-invalid')
    const hasVerticalScrollbar = bodyContent && bodyContent.scrollHeight > (window.innerHeight - minusHeight) ? true : false
    if (!hasVerticalScrollbar) {
      return
    }
    isInValid?.[0].scrollIntoView()
  }
}
