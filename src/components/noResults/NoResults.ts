import { Component, Prop } from 'vue-property-decorator'

import Mixins from '@/mixins'

@Component
export default class NoResults extends Mixins {

  @Prop({ default: 'fas fa-search fa-9x' })
  protected icon?: string
  @Prop({ default: 'Không có kết quả!' })
  protected title?: string
  @Prop({ default: 'Chúng tôi không tìm thấy kết quả nào phù hợp với mong muốn của bạn.' })
  protected msg?: string

  constructor() {
    super()
  }

}
