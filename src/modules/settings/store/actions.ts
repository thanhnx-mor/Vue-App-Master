
import SettingApi from '@/services/SettingApi'
import { GET_ATTRIBUTE_INPUT_TYPES, SET_ATTRIBUTE_INPUT_TYPES } from '../type'

const settingApi = new SettingApi()

export const actions = {
  async [GET_ATTRIBUTE_INPUT_TYPES](context: any) {
    try {
      const res = await settingApi.attributeInputTypes()
      context.commit(SET_ATTRIBUTE_INPUT_TYPES, res.data)
      return res
    } catch (e) {
      return e
    }
  },
}
