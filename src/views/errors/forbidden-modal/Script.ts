import { Component } from 'vue-property-decorator'
import Mixins from '@/mixins'

@Component
export default class ForbiddenModal extends Mixins {
  constructor() {
    super()
  }

  protected reloadPage() {
    return window.location.reload()
  }
}
