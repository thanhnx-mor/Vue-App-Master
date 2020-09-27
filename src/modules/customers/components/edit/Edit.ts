import { Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import DatePicker from 'vue2-datepicker'
import Multiselect from 'vue-multiselect'

import { IAttribute } from '@/modules/settings/interface'
import { InputType } from '@/types/enum'
import { IUser } from '@/modules/users/interface'
import Mixins from '@/mixins'

@Component({
  components: {
    DatePicker,
    Multiselect,
  },
  computed: {
    ...mapGetters(['customerAttributes', 'activeUsers']),
  },
})
export default class CustomerEdit extends Mixins {

  @Prop()
  protected attribute?: IAttribute
  @Prop()
  protected serverErrors?: {}

  protected activeUsers!: IUser[]
  protected customerAttributes!: IAttribute[]
  protected inputType = InputType
  protected uneditableField: string[] = ['ma_kh']

  constructor() {
    super()
  }

  protected get isSimpleType() {
    if (this.attribute) {
      return [InputType['Text/ Văn bản'], InputType['Phone/ Số điện thoại'], InputType['Email/ Thư điện tử'], InputType['Number/ Số'], InputType['Price/ Tiền tệ']].includes(this.attribute.attribute_input_type_id)
    }
  }

  protected get options() {
    switch (this.attribute?.attribute_input_type_id) {
      case this.inputType['User/ 1 người dùng']:
      case this.inputType['Users/ Nhiều người dùng']:
        return this.activeUsers
      default:
        const selectedAttribute = this.customerAttributes.find((t) => t.id === this.attribute?.id)
        return selectedAttribute && selectedAttribute.attribute_options.map((t) => ({ name: t.name, id: t.id })) || []
    }
  }

  protected get isEditable() {
    if (this.attribute) {
      return !['ma_kh'].includes(this.attribute.slug)
    }
  }

  private created() {
    this.initData()
  }

  private initData() {
    const attribute = this.attribute as any
    const values: Array<{}> = []
    if (!attribute[attribute.slug]) {
      return
    }
    switch (attribute?.attribute_input_type_id) {
      case InputType['Select/ 1 lựa chọn']:
        attribute[attribute.slug] = this.options?.find((t) => t.id === +attribute[attribute.slug])
        break
      case InputType['Select/ Nhiều lựa chọn']:
        attribute[attribute.slug].forEach((item: string) => {
          const value = this.options?.find((t) => t.id === +item)
          if (value && value.id) {
            values.push(value)
          }
        })
        attribute[attribute.slug] = values
        break
      case InputType['User/ 1 người dùng']:
        attribute[attribute.slug] = this.activeUsers.find((t) => t.id === +attribute[attribute.slug])
        break
      case InputType['Users/ Nhiều người dùng']:
        attribute[attribute.slug].forEach((item: string) => {
          const value = this.activeUsers.find((t) => t.id === +item)
          if (value && value.id) {
            values.push(value)
          }
        })
        attribute[attribute.slug] = values
        break
    }
  }

}
