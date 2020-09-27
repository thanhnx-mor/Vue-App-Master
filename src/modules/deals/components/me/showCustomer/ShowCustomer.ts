import { Component, Prop } from 'vue-property-decorator'
import Mixins from '@/mixins'
import { mapGetters } from 'vuex'
import { InputType } from '@/types/enum'
import { ICustomer } from '@/modules/customers/interface'
import moment from 'moment'
import { IAttribute, IAttributeOptions } from '@/modules/settings/interface'
import { IUser } from '@/modules/users/interface'
import filters from '@/utils/filters'

@Component({
  computed: {
    ...mapGetters(['customerAttributes', 'allUsers']),
  },
})

export default class ShowCustomer extends Mixins {
  protected inputType = InputType
  protected customerAttributes!: IAttribute[]
  protected allUsers!: IUser[]

  @Prop()
  protected customer?: ICustomer

  constructor() {
    super()
  }

  protected isMultiple(inputType: number) {
    return [InputType['Select/ Nhiều lựa chọn'], InputType['Checkbox/ Nhiều lựa chọn'], InputType['Users/ Nhiều người dùng']].includes(+inputType)
  }

  protected getValueByType(attribute: IAttribute, value: string) {
    if (!value) {
      return
    }
    let item: IAttributeOptions | IUser
    switch (+attribute.attribute_input_type_id) {
      case InputType['Date/ Ngày tháng năm']:
        return moment(value).format('DD/MM/YYYY')
      case InputType['Datetime/ Ngày giờ']:
        return moment(value).format('DD/MM/YYYY HH:mm:ss')
      case InputType['Phone/ Số điện thoại']:
        return filters.phoneFormat(value)
      case InputType['Number/ Số']:
        return filters.numberFormat(value)
      case InputType['Price/ Tiền tệ']:
        return filters.priceFormat(value)
      case InputType['Select/ 1 lựa chọn']:
      case InputType['Select/ Nhiều lựa chọn']:
      case InputType['Checkbox/ Nhiều lựa chọn']:
      case InputType['Radio/ 1 lựa chọn']:
        const selectedAttribute = this.customerAttributes.find((t) => t.id === attribute.id)
        const options = selectedAttribute && selectedAttribute.attribute_options || []
        item = options.find((t) => t.id === +value) as IAttributeOptions
        return item && item.name
      case InputType['User/ 1 người dùng']:
      case InputType['Users/ Nhiều người dùng']:
        item = this.allUsers.find((t) => t.id === +value) as IUser
        return item && item.name
      default:
        return value
    }
  }
}
