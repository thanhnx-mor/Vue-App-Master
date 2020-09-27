import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'

import './Interceptor'
import { IResponse } from '@/types/interface'

export default class BaseApi {
  protected request(config: AxiosRequestConfig) {
    return axios.request(config)
  }

  protected get(url: string, config?: AxiosRequestConfig) {
    return axios.get(url, config) as Promise<IResponse>
  }

  protected getSerialize(url: string, config?: AxiosRequestConfig) {
    const paramsSerializer = (params: any) => {
      return qs.stringify(params, { encode: true })
    }
    return axios.get(url, { ...config, paramsSerializer }) as Promise<IResponse>
  }

  protected getByBlob(url: string, config?: AxiosRequestConfig) {
    return axios.get(url, { ...config, responseType: 'blob' }) as Promise<IResponse>
  }

  protected delete(url: string, config?: AxiosRequestConfig) {
    return axios.delete(url, config)
  }

  protected post(url: string, data: any, config?: AxiosRequestConfig) {
    return axios.post(url, data, config)
  }

  protected put(url: string, data: any, config?: AxiosRequestConfig) {
    return axios.put(url, data, config)
  }
}
