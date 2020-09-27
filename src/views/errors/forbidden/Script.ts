import { Component } from 'vue-property-decorator'
import MainHeader from '@/components/mainHeader/MainHeader'
import MainFooter from '@/components/mainFooter/MainFooter'
import Errors from '../Errors'
@Component({
  components: {
    MainHeader,
    MainFooter,
  },
})
export default class Forbidden extends Errors {
  constructor() {
    super()
  }
}
