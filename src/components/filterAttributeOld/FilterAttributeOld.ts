import { Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import moment from 'moment'
import DatePicker from 'vue2-datepicker'
import Multiselect from 'vue-multiselect'

import { IAttribute } from '@/modules/settings/interface'
import { InputType } from '@/types/enum'
import { IUser } from '@/modules/users/interface'
import Mixins from '@/mixins'
import EventBus from '@/event-bus'

@Component({
  components: {
    DatePicker,
    Multiselect,
  },
  computed: {
    ...mapGetters(['customerAttributes', 'allUsers']),
  },
})

export default class FilterAttribute extends Mixins {
  protected inputType = InputType
  protected allUsers!: IUser[]
  protected customerAttributes!: IAttribute[]
  protected filterConditionsDateTime: any[] = [
    { id: 1, condition: '=', label: 'Bỏ trống' },
    { id: 2, condition: '=', label: 'Hôm qua' },
    { id: 3, condition: '=', label: 'Hôm nay' },
    { id: 4, condition: 'BETWEEN', label: 'Tuần này' },
    { id: 5, condition: 'BETWEEN', label: 'Tháng này' },
    { id: 6, condition: 'BETWEEN', label: 'Trong khoảng' },
    { id: 7, condition: 'IN', label: 'Ngày/tháng/năm chính xác' },
  ]
  protected filterConditionsNumber: any[] = [
    { id: 1, condition: '=', label: 'Bỏ trống' },
    { id: 2, condition: '=', label: 'Bằng' },
    { id: 3, condition: '!=', label: 'Khác' },
    { id: 4, condition: '>', label: 'Lớn hơn' },
    { id: 5, condition: '>=', label: 'Lớn hơn hoặc bằng' },
    { id: 6, condition: '<', label: 'Nhỏ hơn' },
    { id: 7, condition: '<=', label: 'Nhỏ hơn hoặc bằng' },
    { id: 8, condition: 'BETWEEN', label: 'Trong khoảng' },
  ]
  protected filterConditionsText: any[] = [
    { id: 1, condition: '=', label: 'Bỏ trống' },
    { id: 2, condition: 'LIKE', label: 'Chứa ký tự' },
    { id: 3, condition: 'NOT LIKE', label: 'Không chứa ký tự' },
  ]
  protected filtersByAttributeSlug: { [key: string]: any } = {}
  protected filterErrors: { [key: string]: any } = { is_valid: true }

  @Prop()
  protected data?: object

  constructor() {
    super()
  }

  protected get filterConditionsDateTimeByCreatedAtAndUpdatedAt() {
    const filterConditionsDateTime = this.filterConditionsDateTime.length ?
      this.filterConditionsDateTime.map((t) => {
        return t
      }) : []
    filterConditionsDateTime.splice(0, 1)
    return filterConditionsDateTime
  }

  protected userOptions() {
    return this.allUsers.length && this.allUsers.map((t) => {
      return {
        id: t.id,
        name: t.name,
      }
    }) || []
  }

  protected onFilter() {
    const filtersByAttributeSlug = this.filtersByAttributeSlug
    const attributes: any[] = []
    const others: any[] = []

    Object.keys(filtersByAttributeSlug).forEach((attributeSlug) => {
      const attribute = Object.assign({}, {
        ...filtersByAttributeSlug[attributeSlug],
      })

      switch (attributeSlug) {
        case 'created_by':
          attribute.condition = 'IN'
          attribute.value = attribute && attribute.value
            && attribute.value.map((t: any) => t.id) || []
          if (attribute.value.length) {
            others.push(attribute)
          }
          break
        case 'created_at':
        case 'updated_at':
          attribute.value = this.getValuesInputTypeDateTimeByCondition(attribute, 'value')
          if (attribute.value) {
            attribute.condition = attribute.condition ? attribute.condition.condition : undefined
            others.push(attribute)
          }
          break
        default:
          if (attribute) {
            switch (attribute.attribute_input_type_id) {
              case InputType['Select/ 1 lựa chọn']:
              case InputType['Select/ Nhiều lựa chọn']:
              case InputType['Checkbox/ Nhiều lựa chọn']:
              case InputType['Radio/ 1 lựa chọn']:
              case InputType['User/ 1 người dùng']:
              case InputType['Users/ Nhiều người dùng']:
                attribute.condition = 'IN'
                attribute.attribute_values = attribute && attribute.attribute_values
                  && attribute.attribute_values.map((t: any) => t.id) || []
                if (attribute.attribute_values.length) {
                  attributes.push(attribute)
                }
                break
              case InputType['Date/ Ngày tháng năm']:
              case InputType['Datetime/ Ngày giờ']:
                attribute.attribute_values = this.getValuesInputTypeDateTimeByCondition(attribute, 'attribute_values')
                if (typeof (attribute.attribute_values) !== 'undefined') {
                  attribute.condition = attribute.condition ? attribute.condition.condition : undefined
                  attributes.push(attribute)
                }
                break
              case InputType['Number/ Số']:
              case InputType['Price/ Tiền tệ']:
                if (attribute.condition && attribute.condition.id) {
                  switch (attribute.condition.id) {
                    case 1:
                      attribute.attribute_values = null
                      break
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                      attribute.attribute_values = attribute.attribute_values ? attribute.attribute_values : undefined
                      break
                    case 8:
                      attribute.attribute_values = [attribute.range.from, attribute.range.to]
                      break
                  }
                }
                if (typeof (attribute.attribute_values) !== 'undefined') {
                  attribute.condition = attribute.condition ? attribute.condition.condition : undefined
                  attributes.push(attribute)
                }
                break
              default:
                if (attribute.condition && attribute.condition.id) {
                  switch (attribute.condition.id) {
                    case 1:
                      attribute.attribute_values = null
                      break
                    case 2:
                    case 3:
                      attribute.attribute_values = attribute.attribute_values ? attribute.attribute_values : undefined
                      break
                  }
                }
                if (typeof (attribute.attribute_values) !== 'undefined') {
                  attribute.condition = attribute.condition ? attribute.condition.condition : undefined
                  attributes.push(attribute)
                }
                break
            }
          }
          break
      }
    })

    const filter = {
      attributes,
      others,
    }

    this.$emit('onFilter', filter)
  }

  protected onCancelFilter() {
    this.filterErrors = { is_valid: true }
    this.setDefaultFilterData()
    this.$emit('onCancelFilter', true)
    this.$emit('getFilterErrors', this.filterErrors)
  }

  protected getAttributeInputTypeIdByAttributeId(attributeId: number) {
    let attributeInputTypeId = null
    if (this.customerAttributes.length) {
      const selectedAttribute = this.customerAttributes.find((attribute) => attribute.id === attributeId)
      if (selectedAttribute) {
        attributeInputTypeId = selectedAttribute.attribute_input_type_id
      }
    }
    return attributeInputTypeId
  }

  protected isAttributeHasAttributeOptions(attributeInputTypeId: number) {
    if (attributeInputTypeId) {
      return [
        InputType['Select/ 1 lựa chọn'],
        InputType['Select/ Nhiều lựa chọn'],
        InputType['Checkbox/ Nhiều lựa chọn'],
        InputType['Radio/ 1 lựa chọn'],
        InputType['User/ 1 người dùng'],
        InputType['Users/ Nhiều người dùng'],
      ].includes(attributeInputTypeId)
    }
    return false
  }

  protected isDateTime(attributeInputTypeId: number) {
    if (attributeInputTypeId) {
      return [
        InputType['Date/ Ngày tháng năm'],
        InputType['Datetime/ Ngày giờ'],
      ].includes(attributeInputTypeId)
    }
    return false
  }

  protected getOptions(attributeId: number) {
    const selectedAttribute = this.customerAttributes.find((t: IAttribute) => t.id === attributeId)

    switch (selectedAttribute && selectedAttribute.attribute_input_type_id) {
      case InputType['User/ 1 người dùng']:
      case InputType['Users/ Nhiều người dùng']:
        return this.userOptions()
      case InputType['Select/ 1 lựa chọn']:
      case InputType['Select/ Nhiều lựa chọn']:
      case InputType['Checkbox/ Nhiều lựa chọn']:
      case InputType['Radio/ 1 lựa chọn']:
        const attributeOptions = selectedAttribute && selectedAttribute.attribute_options.map((t) => ({ name: t.name, id: t.id })) || []
        attributeOptions.unshift({
          name: 'Bỏ trống',
          id: null,
        })
        return attributeOptions
    }
  }

  protected changeFiltersByAttributeSlug() {
    this.$nextTick(() => {
      this.$forceUpdate()
    })
  }

  protected changeConditionInputTypeDateTime(attributeSlug: string) {
    this.$nextTick(() => {
      this.filterErrors[attributeSlug] = {}
      this.filterErrors.is_valid = true
      this.filtersByAttributeSlug[attributeSlug].attribute_values = undefined
      this.filtersByAttributeSlug[attributeSlug].date = {
        day: undefined,
        month: undefined,
        year: undefined,
      }
      this.$forceUpdate()
      this.$emit('getFilterErrors', this.filterErrors)
    })
  }

  protected checkValueFilterByAttributeSlugInputTypeDateTime(attributeSlug: string) {
    this.filterErrors[attributeSlug] = {}
    this.filterErrors.is_valid = true

    this.$nextTick(() => {
      const attribute = this.filtersByAttributeSlug[attributeSlug]
      const day = attribute.date && attribute.date.day ? attribute.date.day : undefined
      const month = attribute.date && attribute.date.month ? attribute.date.month : undefined
      const year = attribute.date && attribute.date.year ? attribute.date.year : undefined
      if (attribute.condition && attribute.condition.id === 7) {
        if ((day && isNaN(day)) || day < 1 || day > 31) {
          this.filterErrors[attributeSlug].day = 'Ngày phải có giá trị nằm trong khoảng giữa 1 và 31'
          this.filterErrors.is_valid = false
        }

        if ((month && isNaN(month)) || month < 1 || month > 12) {
          this.filterErrors[attributeSlug].month = 'Tháng phải có giá trị nằm trong khoảng giữa 1 và 12'
          this.filterErrors.is_valid = false
        }

        if ((year && isNaN(year)) || year < 1000 || year > 9999) {
          this.filterErrors[attributeSlug].year = 'Năm phải có giá trị nằm trong khoảng giữa 1000 và 9999'
          this.filterErrors.is_valid = false
        }
      }
      this.$emit('getFilterErrors', this.filterErrors)
      this.$forceUpdate()
    })
  }

  protected changeConditionInputTypeNumberAndPrice(attributeSlug: string) {
    this.$nextTick(() => {
      this.filterErrors[attributeSlug] = {}
      this.filterErrors.is_valid = true
      this.filtersByAttributeSlug[attributeSlug].attribute_values = undefined
      this.filtersByAttributeSlug[attributeSlug].range = {
        from: undefined,
        to: undefined,
      }
      this.$forceUpdate()
      this.$emit('getFilterErrors', this.filterErrors)
    })
  }

  protected checkValueFilterByAttributeSlugInputTypeNumberAndPrice(attributeSlug: string) {
    this.filterErrors[attributeSlug] = {}
    this.filterErrors.is_valid = true

    this.$nextTick(() => {
      const attribute = this.filtersByAttributeSlug[attributeSlug]
      const condition = attribute.condition ? attribute.condition : undefined
      const attributeValues = attribute.attribute_values ? attribute.attribute_values : undefined
      const from = attribute.range.from
      const to = attribute.range.to
      const isNumber = !!(attribute.attribute_input_type_id === InputType['Number/ Số'])

      if (condition && (condition.id !== 8 || condition.id !== 1)) {
        if (isNumber && attributeValues && !this.checkValueInputTypeNumber(attributeValues)) {
          this.filterErrors[attributeSlug].value = 'Giá trị có định dạng không đúng'
          this.filterErrors.is_valid = false
        }

        if (!isNumber && attributeValues && !Number.isInteger(+attributeValues)) {
          this.filterErrors[attributeSlug].value = 'Giá trị chỉ có thể có các kí tự số'
          this.filterErrors.is_valid = false
        }

        if (attributeValues && attributeValues.length > this.isMaxLengthText) {
          this.filterErrors[attributeSlug].value = 'Giá trị không nhiều hơn ' + this.isMaxLengthText + ' ký tự.'
          this.filterErrors.is_valid = false
        }
      }

      if (condition && condition.id === 8) {
        if (isNumber && attribute.range && from && !this.checkValueInputTypeNumber(from)) {
          this.filterErrors[attributeSlug].from = 'Giá trị có định dạng không đúng'
          this.filterErrors.is_valid = false
        }

        if (isNumber && attribute.range && to && !this.checkValueInputTypeNumber(to)) {
          this.filterErrors[attributeSlug].to = 'Giá trị có định dạng không đúng'
          this.filterErrors.is_valid = false
        }

        if (!isNumber && attribute.range && from && !Number.isInteger(+from)) {
          this.filterErrors[attributeSlug].from = 'Giá trị chỉ có thể có các kí tự số'
          this.filterErrors.is_valid = false
        }

        if (!isNumber && attribute.range && to && !Number.isInteger(+to)) {
          this.filterErrors[attributeSlug].to = 'Giá trị chỉ có thể có các kí tự số'
          this.filterErrors.is_valid = false
        }

        if (from && to && from >= to) {
          this.filterErrors[attributeSlug].from = 'Giá trị phải nhỏ hơn giá trị thứ 2'
          this.filterErrors.is_valid = false
        }

        if (!from) {
          this.filterErrors[attributeSlug].from = 'Không được bỏ trống trường này.'
          this.filterErrors.is_valid = false
        }

        if (!to) {
          this.filterErrors[attributeSlug].to = 'Không được bỏ trống trường này.'
          this.filterErrors.is_valid = false
        }

        if (from && from.length > this.isMaxLengthText) {
          this.filterErrors[attributeSlug].from = 'Giá trị không nhiều hơn ' + this.isMaxLengthText + ' ký tự.'
          this.filterErrors.is_valid = false
        }

        if (to && to.length > this.isMaxLengthText) {
          this.filterErrors[attributeSlug].to = 'Giá trị không nhiều hơn ' + this.isMaxLengthText + ' ký tự.'
          this.filterErrors.is_valid = false
        }
      }

      this.$emit('getFilterErrors', this.filterErrors)
      this.$forceUpdate()
    })
  }

  protected changeConditionInputTypeText(attributeSlug: string) {
    this.$nextTick(() => {
      this.filterErrors[attributeSlug] = {}
      this.filterErrors.is_valid = true
      this.filtersByAttributeSlug[attributeSlug].attribute_values = undefined
      this.$forceUpdate()
      this.$emit('getFilterErrors', this.filterErrors)
    })
  }

  protected checkValueFilterByAttributeSlugInputTypeText(attributeSlug: string) {
    this.filterErrors[attributeSlug] = {}
    this.filterErrors.is_valid = true

    this.$nextTick(() => {
      const attribute = this.filtersByAttributeSlug[attributeSlug]
      const isTextarea = !!(attribute.attribute_input_type_id === InputType['Textarea/ Đoạn văn bản'])
      const attributeValues = attribute.attribute_values ? attribute.attribute_values : undefined

      if (isTextarea && attributeValues && attributeValues.length > this.isMaxLengthTextarea) {
        this.filterErrors[attributeSlug].value = 'Giá trị không nhiều hơn ' + this.isMaxLengthTextarea + ' ký tự.'
        this.filterErrors.is_valid = false
      }

      if (!isTextarea && attributeValues && attributeValues.length > this.isMaxLengthText) {
        this.filterErrors[attributeSlug].value = 'Giá trị không nhiều hơn ' + this.isMaxLengthText + ' ký tự.'
        this.filterErrors.is_valid = false
      }

      this.$emit('getFilterErrors', this.filterErrors)
      this.$forceUpdate()
    })
  }

  private created() {
    this.setDefaultFilterData()

    EventBus.$on('setOnFilter', (data: boolean) => {
      if (data) {
        this.onFilter()
      }
    })

    EventBus.$on('setOnCancelFilter', (data: boolean) => {
      if (data) {
        this.onCancelFilter()
      }
    })
  }

  private getValuesInputTypeDateTimeByCondition(attribute: any, attributeValues: string) {
    const condition = attribute && attribute.condition ? attribute.condition : undefined
    if (condition && condition.id) {
      switch (condition.id) {
        case 1:
          return null
        case 2:
          return moment().add(-1, 'days').format('YYYY-MM-DD')
        case 3:
          return moment().format('YYYY-MM-DD')
        case 4:
          return [
            moment().startOf('week').format('YYYY-MM-DD'),
            moment().endOf('week').format('YYYY-MM-DD'),
          ]
        case 5:
          return [
            moment().startOf('month').format('YYYY-MM-DD'),
            moment().endOf('month').format('YYYY-MM-DD'),
          ]
        case 6:
          return attribute[attributeValues]
        case 7:
          return attribute.date && (attribute.date.day || attribute.date.month || attribute.date.year) ?
            attribute.date : undefined
      }
    }
  }

  private setDefaultFilterData() {
    if (this.customerAttributes.length) {
      this.filtersByAttributeSlug.created_by = {
        key: 'created_by',
        value: undefined,
        condition: undefined,
      }

      this.filtersByAttributeSlug.created_at = {
        key: 'created_at',
        value: undefined,
        condition: undefined,
      }

      this.filtersByAttributeSlug.updated_at = {
        key: 'updated_at',
        value: undefined,
        condition: undefined,
      }
      this.customerAttributes.forEach((attribute: IAttribute) => {
        if (!attribute.is_enabled) {
          return
        }

        this.filtersByAttributeSlug[attribute.slug] = {
          attribute_id: attribute.id,
          attribute_input_type_id: attribute.attribute_input_type_id,
          attribute_values: undefined,
          condition: undefined,
        }

        if (this.isDateTime(attribute.attribute_input_type_id)) {
          this.filtersByAttributeSlug[attribute.slug].date = {
            day: undefined,
            month: undefined,
            year: undefined,
          }
        }

        if (attribute.attribute_input_type_id === InputType['Number/ Số'] ||
          attribute.attribute_input_type_id === InputType['Price/ Tiền tệ']
        ) {
          this.filtersByAttributeSlug[attribute.slug].range = {
            from: undefined,
            to: undefined,
          }
        }
      })
    }
  }
}
