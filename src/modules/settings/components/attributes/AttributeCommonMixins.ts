import Mixins from '@/mixins'
import { Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

import utils from '@/utils/utils'
import { IAttribute, IAttributeInputType, IAttributeOptions } from '../../interface'
import { InputType } from '@/types/enum'

@Component({
  computed: {
    ...mapGetters(['attributeInputTypes']),
  },
})

export default class AttributeCommonMixins extends Mixins {

  @Prop({ default: '' })
  protected prefix!: string

  protected attribute: IAttribute = this.initAttribute()
  protected attributeInputTypes!: IAttributeInputType[]
  protected attributeOptionMessageError: string = ''
  protected attributeOptionName: string = ''
  protected isLoading: boolean = false
  protected serverErrors: object = {}

  constructor() {
    super()
  }

  get customAttributeInputTypes() {
    if (!this.attributeInputTypes.length) {
      return
    }

    return this.attributeInputTypes.map((t) => ({
      ...t,
      value: t.id,
      text: t.name,
    }))
  }

  get isHideUnique() {
    return ![InputType['Text/ Văn bản'], InputType['Email/ Thư điện tử'], InputType['Phone/ Số điện thoại']].includes(this.attribute.attribute_input_type_id)
  }

  get isEnabledAttributeOptions() {
    return [InputType['Select/ 1 lựa chọn'], InputType['Select/ Nhiều lựa chọn'], InputType['Radio/ 1 lựa chọn'], InputType['Checkbox/ Nhiều lựa chọn']].includes(this.attribute.attribute_input_type_id)
  }

  protected onAddAttributeOption() {
    this.attributeOptionMessageError = ''
    if (!this.attributeOptionName) {
      this.attributeOptionMessageError = 'Giá trị là bắt buộc'
      return
    }

    if (this.isUniqueAttributeOptionName(this.attributeOptionName)) {
      this.attributeOptionMessageError = 'Giá trị đã tồn tại'
      return
    }

    const attributeOption = { name: this.attributeOptionName } as IAttributeOptions
    this.attribute.attribute_options.push(attributeOption)
    this.attribute.attribute_options = this.sortOrderAttributeOptions()
    this.attributeOptionName = ''
  }

  protected onAddAttributeOptionEnter(evt: { keyCode: number }) {
    if (evt.keyCode === 13) {
      this.onAddAttributeOption()
      return
    }
    this.attributeOptionMessageError = ''
  }

  protected onDeleteAttributeOption(index: number) {
    this.attribute.attribute_options.splice(index, 1)
    this.attribute.attribute_options = this.sortOrderAttributeOptions()
  }

  protected changeAttributeInputType() {
    this.attributeOptionMessageError = ''
    this.attributeOptionName = ''
    this.attribute.is_unique = 0
    this.attribute.attribute_options = []
  }

  protected setAttributeSlug() {
    this.attribute.slug = this.attribute.name ?
      utils.changeAlias(this.attribute.name).replace(/ /g, '_') + this.prefix : ''
  }

  protected isUniqueAttributeOptionName(attributeOptionName: string) {
    attributeOptionName = attributeOptionName ? attributeOptionName.toLocaleLowerCase().trim() : ''
    const attributeOptions = this.attribute.attribute_options
    if (!attributeOptions.length || !attributeOptionName) {
      return false
    }

    const attributeOptionNames = attributeOptions.map((t: any) => {
      return t.name && t.name.toLocaleLowerCase().trim() || ''
    })

    return attributeOptionNames.indexOf(attributeOptionName) !== -1
  }

  protected sortOrderAttributeOptions() {
    if (!this.attribute.attribute_options.length) {
      return []
    }

    return this.attribute.attribute_options.map((t: any, index: number) => {
      return {
        ...t,
        sort_order: index + 1,
      }
    })
  }

  protected initAttribute() {
    return this.attribute = {
      id: 0,
      name: '',
      slug: '',
      attribute_input_type_id: 0,
      is_required: false,
      is_unique: false,
      is_enabled: true,
      attribute_options: [],
    } as IAttribute
  }
}
