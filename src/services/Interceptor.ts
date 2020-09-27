import axios from 'axios'

import utils from '@/utils/utils'
import { UNAUTHORIZED, FORBIDDEN_ACCESS } from '@/types/const'
import router from '@/router'

axios.interceptors.request.use((request) => {
  request.headers = {
    'Authorization': `Bearer ${utils.getCookie('access_token')}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  return request
})
const app = document.getElementById('app')
const forbiddenModal = document.getElementById('forbiddenModal')
axios.interceptors.response.use((response) => {
  app?.classList.add('d-block')
  app?.classList.remove('d-none')
  forbiddenModal?.classList.add('d-none')
  forbiddenModal?.classList.remove('d-flex')
  const data = response.data
  data.status = response.status
  return data
}, (error: any) => {
  const res = error.response
  const isPopup = res.config.params && res.config.params.is_popup || false
  switch (res.status) {
    case UNAUTHORIZED:
      utils.deleteCookie('access_token')
      const { pathname, search } = window.location
      const returnUrl = pathname + search
      router.push({ path: '/login', query: { returnUrl } })
      break
    case FORBIDDEN_ACCESS:
      if (isPopup) {
        const showForbiddenModal = document.getElementById('showForbiddenModal')
        showForbiddenModal?.click()
        break
      }
      app?.classList.add('d-none')
      forbiddenModal?.classList.add('d-flex')
      break
  }
  return Promise.resolve(res)
})
