import { Component, Prop } from 'vue-property-decorator'
import Mixins from '@/mixins'
import { ICustomer } from '@/modules/customers/interface'
import Edit from '@/modules/customers/components/edit/Edit'

@Component({
  components: {
    Edit,
  },
})

export default class EditCustomer extends Mixins {
  @Prop()
  protected customer?: ICustomer
  @Prop()
  protected serverErrors?: object

  constructor() {
    super()
  }
}
