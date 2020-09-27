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
    ...mapGetters(['allUsers']),
  },
})

export default class FilterAttribute extends Mixins {
  protected inputType = InputType
  protected allUsers!: IUser[]
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
  protected showFilter: boolean = false
  protected filterItem: { [key: string]: any } = {}

  @Prop()
  protected data?: object

  @Prop()
  protected attributes!: IAttribute[]

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

  protected isDisabled() {
    const filterErrors = this.filterErrors || undefined
    const filterItem: any = this.filterItem || undefined
    const filtersByAttributeSlug = this.filtersByAttributeSlug || undefined
    let filtersByAttributeSlugCached: any = localStorage.getItem('filterCached') || undefined

    if (!filterErrors || !filterItem || !filtersByAttributeSlug) {
      return true
    }

    const slug = filterItem.key

    if (filtersByAttributeSlugCached) {
      filtersByAttributeSlugCached = JSON.parse(filtersByAttributeSlugCached)
      if (this.filterItemHasValuesBySlug(slug, filtersByAttributeSlugCached)
        && !filtersByAttributeSlug[slug].condition) {
        return false
      }
    }

    if (!filterErrors.is_valid ||
      !this.filterItemHasValuesBySlug(slug, filtersByAttributeSlug)
    ) {
      return true
    }

    return false
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

  protected userOptions() {
    return this.allUsers.length && this.allUsers.map((t) => {
      return {
        id: t.id,
        name: t.name,
      }
    }) || []
  }

  protected getOptions(attributeId: number) {
    const selectedAttribute = this.attributes.find((t: IAttribute) => t.id === attributeId)
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

  protected getAttributeInputTypeIdByAttributeId(attributeId: number) {
    let attributeInputTypeId = null
    if (this.attributes.length) {
      const selectedAttribute = this.attributes.find((attribute) => attribute.id === attributeId)
      if (selectedAttribute) {
        attributeInputTypeId = selectedAttribute.attribute_input_type_id
      }
    }
    return attributeInputTypeId
  }

  protected onFilterItem() {
    const filtersByAttributeSlug = this.filtersByAttributeSlug
    localStorage.setItem('filterCached', JSON.stringify(filtersByAttributeSlug))
    this.$emit('onFilter', this.convertFilterDataPushToServer(filtersByAttributeSlug))
  }

  protected onShowFilterItem(item: any) {
    this.filterItem = item
    this.$nextTick(() => {
      this.$bvModal.show('filterByItem')
      this.$forceUpdate()
    })
  }

  protected onCancelFilterItem() {
    const slug = this.filterItem && this.filterItem.key || undefined
    let filtersByAttributeSlugCached: any = localStorage.getItem('filterCached') || undefined
    if (!filtersByAttributeSlugCached) {
      this.resetDataFilterItem(slug)
      this.nextTickAndForceUpdate()
      return
    }
    filtersByAttributeSlugCached = JSON.parse(filtersByAttributeSlugCached)
    const hasValues = this.filterItemHasValuesBySlug(slug, filtersByAttributeSlugCached) || false
    if (!hasValues) {
      this.resetDataFilterItem(slug)
      this.nextTickAndForceUpdate()
      return
    }
    this.filterErrors[slug] = {}
    this.filterErrors.is_valid = true
    if (filtersByAttributeSlugCached[slug]) {
      this.filtersByAttributeSlug[slug] = { ...this.filtersByAttributeSlug[slug], ...filtersByAttributeSlugCached[slug] }
    }
    this.nextTickAndForceUpdate()
  }

  protected removeFilterItem(data: any) {
    const slug = data && data.key || undefined
    this.resetDataFilterItem(slug)

    const filtersByAttributeSlug = this.filtersByAttributeSlug
    localStorage.setItem('filterCached', JSON.stringify(filtersByAttributeSlug))
    this.$emit('onFilter', this.convertFilterDataPushToServer(filtersByAttributeSlug))

    this.nextTickAndForceUpdate()
  }

  protected filterItemHasValuesBySlug(slug: string, data: any) {
    const filter: any = this.convertFilterDataPushToServer(data)
    if (!filter) {
      return false
    }
    if (filter.others && filter.others.length) {
      const other = filter.others.find((item: any) => item.key === slug)
      if (other) {
        return true
      }
    }
    if (filter.attributes && filter.attributes.length) {
      const attribute = filter.attributes.find((item: any) => item.slug === slug)
      if (attribute) {
        return true
      }
    }
    return false
  }

  protected convertFilterDataPushToServer(data: any) {
    if (!data) {
      return
    }
    const filtersByAttributeSlug = data
    const attributes: any[] = []
    const others: any[] = []

    Object.keys(filtersByAttributeSlug).forEach((attributeSlug) => {
      const attribute = Object.assign({}, {
        ...filtersByAttributeSlug[attributeSlug],
      })

      const attributeConditionId = attribute.condition && attribute.condition.id || undefined
      const attributeConditionValue = attribute.condition && attribute.condition.condition || undefined

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
            attribute.condition = attributeConditionValue
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
                  attribute.condition = attributeConditionValue
                  attributes.push(attribute)
                }
                break
              case InputType['Number/ Số']:
              case InputType['Price/ Tiền tệ']:
                if (attributeConditionId) {
                  switch (attributeConditionId) {
                    case 1:
                      attribute.attribute_values = null
                      break
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                      attribute.attribute_values = attribute.attribute_values || undefined
                      break
                    case 8:
                      attribute.attribute_values = attribute.range && attribute.range.from && attribute.range.to ?
                        [attribute.range.from, attribute.range.to] : undefined
                      break
                  }
                }
                if (typeof (attribute.attribute_values) !== 'undefined') {
                  attribute.condition = attributeConditionValue
                  attributes.push(attribute)
                }
                break
              default:
                if (attributeConditionId) {
                  switch (attributeConditionId) {
                    case 1:
                      attribute.attribute_values = null
                      break
                    case 2:
                    case 3:
                      attribute.attribute_values = attribute.attribute_values || undefined
                      break
                  }
                }
                if (typeof (attribute.attribute_values) !== 'undefined') {
                  attribute.condition = attributeConditionValue
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

    return filter
  }

  protected getLabelCurrentFilterItem(data: any) {
    const slug = data && data.key || undefined
    const attributeId = data && data.attributeId || undefined
    let filtersByAttributeSlugCached: any = localStorage.getItem('filterCached') || undefined
    if (!filtersByAttributeSlugCached) {
      return
    }
    filtersByAttributeSlugCached = JSON.parse(filtersByAttributeSlugCached)
    const hasValues = this.filterItemHasValuesBySlug(slug, filtersByAttributeSlugCached) || false
    if (!hasValues) {
      return
    }
    const attribute = filtersByAttributeSlugCached[slug]
    const attributeInputTypeId = this.getAttributeInputTypeIdByAttributeId(attributeId)
    const attributeConditionId = attribute.condition && attribute.condition.id || undefined
    const attributeConditionLabel = attribute.condition && attribute.condition.label || undefined
    switch (slug) {
      case 'created_by':
        return 'Chứa giá trị: ' + attribute.value.map((t: any) => t.name).join(', ')
      case 'created_at':
      case 'updated_at':
        const value = this.getValuesInputTypeDateTimeByCondition(attribute, 'value')
        if (attributeConditionId) {
          switch (attributeConditionId) {
            case 2:
            case 3:
              return 'Chứa giá trị: ' + moment(value).format('DD/MM/YYYY')
            case 4:
            case 5:
            case 6:
              return 'Trong khoảng: Từ ' + moment(value[0]).format('DD/MM/YYYY') +
                ' Đến ' + moment(value[1]).format('DD/MM/YYYY')
            case 7:
              const label = []
              if (attribute.date.day) {
                label.push('Ngày: ' + attribute.date.day)
              }
              if (attribute.date.month) {
                label.push('Tháng: ' + attribute.date.month)
              }
              if (attribute.date.year) {
                label.push('Năm: ' + attribute.date.year)
              }
              return 'Thuộc 1 trong các giá trị: ' + label.join(', ')
          }
        }
      default:
        switch (attributeInputTypeId) {
          case InputType['Select/ 1 lựa chọn']:
          case InputType['Select/ Nhiều lựa chọn']:
          case InputType['Checkbox/ Nhiều lựa chọn']:
          case InputType['Radio/ 1 lựa chọn']:
          case InputType['User/ 1 người dùng']:
          case InputType['Users/ Nhiều người dùng']:
            return 'Chứa giá trị: ' + attribute.attribute_values.map((t: any) => t.name).join(', ')
          case InputType['Date/ Ngày tháng năm']:
          case InputType['Datetime/ Ngày giờ']:
            const attributeValues = this.getValuesInputTypeDateTimeByCondition(attribute, 'attribute_values')
            if (attributeConditionId) {
              switch (attributeConditionId) {
                case 1:
                  return 'Bỏ trống giá trị'
                case 2:
                case 3:
                  return 'Chứa giá trị: ' + moment(attributeValues).format('DD/MM/YYYY')
                case 4:
                case 5:
                case 6:
                  return 'Trong khoảng: Từ ' + moment(attributeValues[0]).format('DD/MM/YYYY') +
                    ' Đến ' + moment(attributeValues[1]).format('DD/MM/YYYY')
                case 7:
                  const label = []
                  if (attribute.date.day) {
                    label.push('Ngày: ' + attribute.date.day)
                  }
                  if (attribute.date.month) {
                    label.push('Tháng: ' + attribute.date.month)
                  }
                  if (attribute.date.year) {
                    label.push('Năm: ' + attribute.date.year)
                  }
                  return 'Thuộc 1 trong các giá trị: ' + label.join(', ')
              }
            }
          case InputType['Number/ Số']:
          case InputType['Price/ Tiền tệ']:
            if (attributeConditionId) {
              switch (attributeConditionId) {
                case 1:
                  return 'Bỏ trống giá trị'
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                  return attributeConditionLabel + ': ' + attribute.attribute_values
                case 8:
                  return 'Trong khoảng: Từ ' + attribute.range.from +
                    ' Đến ' + attribute.range.to
              }
            }
            break
          default:
            if (attributeConditionId) {
              switch (attributeConditionId) {
                case 1:
                  return 'Bỏ trống giá trị'
                case 2:
                case 3:
                  return attributeConditionLabel + ': ' + attribute.attribute_values
              }
            }
        }
    }
  }

  protected changeFiltersByAttributeSlug() {
    this.nextTickAndForceUpdate()
  }

  protected changeConditionInputTypeDateTime(attributeSlug: string) {
    this.filterErrors[attributeSlug] = {}
    this.filterErrors.is_valid = true
    this.filtersByAttributeSlug[attributeSlug] = {
      ...this.filtersByAttributeSlug[attributeSlug],
      attribute_values: undefined,
      date: {
        day: undefined,
        month: undefined,
        year: undefined,
      },
    }
    this.nextTickAndForceUpdate()
  }

  protected validationInputTypeDateTime(attributeSlug: string) {
    this.filterErrors[attributeSlug] = {}
    this.filterErrors.is_valid = true
    const attribute = this.filtersByAttributeSlug[attributeSlug] || undefined
    const condition = attribute.condition || undefined
    const conditionId = condition && condition.id || undefined
    const day = attribute.date && attribute.date.day || undefined
    const month = attribute.date && attribute.date.month || undefined
    const year = attribute.date && attribute.date.year || undefined
    if (conditionId !== 7) {
      return
    }
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
    this.nextTickAndForceUpdate()
  }

  protected changeConditionInputTypeNumberAndPrice(attributeSlug: string) {
    this.filterErrors[attributeSlug] = {}
    this.filterErrors.is_valid = true
    this.filtersByAttributeSlug[attributeSlug] = {
      ...this.filtersByAttributeSlug[attributeSlug],
      attribute_values: undefined,
      range: {
        from: undefined,
        to: undefined,
      },
    }
    this.nextTickAndForceUpdate()
  }

  protected validationInputTypeNumberAndPrice(attributeSlug: string) {
    this.filterErrors[attributeSlug] = {}
    this.filterErrors.is_valid = true
    const attribute = this.filtersByAttributeSlug[attributeSlug] || undefined
    const condition = attribute.condition || undefined
    const conditionId = condition && condition.id || undefined
    const attributeValues = attribute.attribute_values || undefined
    const from = attribute.range && attribute.range.from || undefined
    const to = attribute.range && attribute.range.to || undefined
    const isNumber = !!(attribute.attribute_input_type_id === InputType['Number/ Số'])
    if (!conditionId || conditionId === 1) {
      return
    }
    if (conditionId !== 8) {
      if (!attributeValues) {
        this.nextTickAndForceUpdate()
        return
      }
      if (isNumber && !this.checkValueInputTypeNumber(attributeValues)) {
        this.filterErrors[attributeSlug].value = 'Giá trị có định dạng không đúng'
        this.filterErrors.is_valid = false
      }
      if (!isNumber && !Number.isInteger(+attributeValues)) {
        this.filterErrors[attributeSlug].value = 'Giá trị chỉ có thể có các kí tự số'
        this.filterErrors.is_valid = false
      }
      if (attributeValues.length > this.isMaxLengthText) {
        this.filterErrors[attributeSlug].value = 'Giá trị không nhiều hơn ' + this.isMaxLengthText + ' ký tự.'
        this.filterErrors.is_valid = false
      }
      this.nextTickAndForceUpdate()
      return
    }

    if (!from) {
      this.filterErrors[attributeSlug].from = 'Không được bỏ trống trường này.'
      this.filterErrors.is_valid = false
      this.nextTickAndForceUpdate()
      return
    }
    if (!to) {
      this.filterErrors[attributeSlug].to = 'Không được bỏ trống trường này.'
      this.filterErrors.is_valid = false
      this.nextTickAndForceUpdate()
      return
    }
    if (isNumber && !this.checkValueInputTypeNumber(from)) {
      this.filterErrors[attributeSlug].from = 'Giá trị có định dạng không đúng'
      this.filterErrors.is_valid = false
    }
    if (isNumber && !this.checkValueInputTypeNumber(to)) {
      this.filterErrors[attributeSlug].to = 'Giá trị có định dạng không đúng'
      this.filterErrors.is_valid = false
    }
    if (!isNumber && !Number.isInteger(+from)) {
      this.filterErrors[attributeSlug].from = 'Giá trị chỉ có thể có các kí tự số'
      this.filterErrors.is_valid = false
    }
    if (!isNumber && !Number.isInteger(+to)) {
      this.filterErrors[attributeSlug].to = 'Giá trị chỉ có thể có các kí tự số'
      this.filterErrors.is_valid = false
    }
    if (from >= to) {
      this.filterErrors[attributeSlug].from = 'Giá trị phải nhỏ hơn giá trị thứ 2'
      this.filterErrors.is_valid = false
    }
    if (from.length > this.isMaxLengthText) {
      this.filterErrors[attributeSlug].from = 'Giá trị không nhiều hơn ' + this.isMaxLengthText + ' ký tự.'
      this.filterErrors.is_valid = false
    }
    if (to.length > this.isMaxLengthText) {
      this.filterErrors[attributeSlug].to = 'Giá trị không nhiều hơn ' + this.isMaxLengthText + ' ký tự.'
      this.filterErrors.is_valid = false
    }
    this.nextTickAndForceUpdate()
  }

  protected changeConditionInputTypeText(attributeSlug: string) {
    this.filterErrors[attributeSlug] = {}
    this.filterErrors.is_valid = true
    this.filtersByAttributeSlug[attributeSlug] = {
      ...this.filtersByAttributeSlug[attributeSlug],
      attribute_values: undefined,
    }
    this.nextTickAndForceUpdate()
  }

  protected validationInputTypeText(attributeSlug: string) {
    this.filterErrors[attributeSlug] = {}
    this.filterErrors.is_valid = true
    const attribute = this.filtersByAttributeSlug[attributeSlug] || undefined
    const attributeValues = attribute.attribute_values || undefined
    const isTextarea = !!(attribute.attribute_input_type_id === InputType['Textarea/ Đoạn văn bản'])
    if (!attributeValues) {
      this.nextTickAndForceUpdate()
      return
    }
    if (isTextarea && attributeValues.length > this.isMaxLengthTextarea) {
      this.filterErrors[attributeSlug].value = 'Giá trị không nhiều hơn ' + this.isMaxLengthTextarea + ' ký tự.'
      this.filterErrors.is_valid = false
    }
    if (!isTextarea && attributeValues.length > this.isMaxLengthText) {
      this.filterErrors[attributeSlug].value = 'Giá trị không nhiều hơn ' + this.isMaxLengthText + ' ký tự.'
      this.filterErrors.is_valid = false
    }
    this.nextTickAndForceUpdate()
  }

  private created() {
    localStorage.removeItem('filterCached')
    this.setDefaultFilterData()
    EventBus.$on('showFilter', (showFilter: boolean) => {
      this.showFilter = showFilter
      if (!this.showFilter) {
        localStorage.removeItem('filterCached')
        this.setDefaultFilterData()
      }
    })
  }

  private getValuesInputTypeDateTimeByCondition(attribute: any, attributeValues: string) {
    const condition = attribute && attribute.condition || undefined
    const conditionId = condition && condition.id || undefined
    if (conditionId) {
      switch (conditionId) {
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
          return attribute[attributeValues] && attribute[attributeValues][0] && attribute[attributeValues][1]
            ? attribute[attributeValues] : undefined
        case 7:
          return attribute.date && (attribute.date.day || attribute.date.month || attribute.date.year) ?
            attribute.date : undefined
      }
    }
  }

  private setDefaultFilterData() {
    if (this.attributes.length) {
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
      this.attributes.forEach((attribute: IAttribute) => {
        if (!attribute.is_enabled) {
          return
        }

        this.filtersByAttributeSlug[attribute.slug] = {
          attribute_id: attribute.id,
          attribute_input_type_id: attribute.attribute_input_type_id,
          attribute_values: undefined,
          condition: undefined,
          slug: attribute.slug,
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

  private resetDataFilterItem(slug: string) {
    this.filterErrors[slug] = {}
    this.filterErrors.is_valid = true
    this.filtersByAttributeSlug[slug] = {
      ...this.filtersByAttributeSlug[slug],
      condition: undefined,
      value: undefined,
      attribute_values: undefined,
      date: {
        day: undefined,
        month: undefined,
        year: undefined,
      },
      range: {
        from: undefined,
        to: undefined,
      },
    }
  }

  private nextTickAndForceUpdate() {
    this.$nextTick(() => {
      this.$forceUpdate()
    })
  }
}
