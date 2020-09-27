import { Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import DatePicker from 'vue2-datepicker'
import Multiselect from 'vue-multiselect'

import { IAttribute, IAttributeOptions } from '@/modules/settings/interface'
import { InputType } from '@/types/enum'
import { IUser } from '@/modules/users/interface'
import Mixins from '@/mixins'
import filters from '@/utils/filters'
import moment from 'moment'

@Component({
  components: {
    DatePicker,
    Multiselect,
  },
  computed: {
    ...mapGetters(['dealAttributes', 'allUsers']),
  },
})
export default class ShowDealAttribute extends Mixins {
  @Prop()
  protected attribute?: IAttribute

  protected allUsers!: IUser[]
  protected dealAttributes!: IAttribute[]
  protected inputType = InputType

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
        const selectedAttribute = this.dealAttributes.find((t) => t.id === attribute.id)
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
