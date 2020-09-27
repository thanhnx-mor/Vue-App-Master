import { Component } from 'vue-property-decorator'
import { debounce } from 'lodash'
import moment from 'moment'
import { IAttribute } from '@/modules/settings/interface'
import { ITableField } from '@/types/interface'
import { InputType } from '@/types/enum'
import { IUser } from '@/modules/users/interface'
import filters from '@/utils/filters'
import Mixins from '@/mixins'
import EventBus from '@/event-bus'
import { IDeal, IDealLeadType, IDealStage, IDealActionResult } from '../interface'
import { mapGetters } from 'vuex'

@Component({
    computed: {
        ...mapGetters(['dealAttributes', 'allUsers', 'dealActionResults', 'dealLeadTypes', 'dealStages']),
    },
})

export default class DealListCommon extends Mixins {
    protected allUsers!: IUser[]
    protected currentPage!: number
    protected dealAttributes!: IAttribute[]
    protected fields: ITableField[] = []
    protected fieldsExport: { [key: string]: any } = {}
    protected isLoading: boolean = true
    protected isLoadingRemove = false
    protected isLoadingExport = false
    protected items: IDeal[] = []
    protected perPage!: number
    protected queryParams!: object
    protected searchKey: string = ''
    protected total: number = 0
    protected totalPage!: number
    protected filter: { [key: string]: any } = {}
    protected showFilter: boolean = false
    protected filterCustom: { [key: string]: any } = {}
    protected maxRowExport: number = 1000
    protected progress: number = 0
    protected highlightAction: boolean = false
    protected dealLeadTypes!: IDealLeadType[]
    protected dealStages!: IDealStage[]
    protected dealActionResults!: IDealActionResult[]
    protected debounces = debounce(() => this.setQueryUrl(), 8000)
    protected fieldsDisable = ['loai_vat', 'loai_chiet_khau', 'gia_tri_chiet_khau']
    protected sortOrder: { [key: string]: number } = {
        ma_dh: 1, ten_dh: 2, ngay_dat_hang: 3, ma_kh_dh: 6, ten_kh_dh: 7, sdt_kh_dh: 8,
        email_kh_dh: 9, tong_thanh_tien: 10, tong_tien_vat: 11, tong_chiet_khau: 12,
        tong_tien_da_thanh_toan: 13, tong_thanh_toan: 14,
    }
    protected get hasFilter() {
        if (this.searchKey || Object.keys(this.filter).length || Object.keys(this.filterCustom).length) {
            return true
        }
        return false
    }

    protected toggleHighlightAction() {
        this.highlightAction = !this.highlightAction
        this.$nextTick(() => {
            this.$forceUpdate()
        })
    }

    protected onChange(page: number) {
        if (page === this.currentPage) {
            return
        }
        this.currentPage = page
        const query = { page, ...this.filterCustom }
        this.setQueryUrl(query)
    }

    protected onRefresh() {
        this.currentPage = 1
        this.setQueryUrl({ page: 1 })
    }

    protected onDebounce() {
        this.debounces()
    }

    protected onSearch() {
        const searchKey = this.searchKey && this.searchKey.trim() || ''
        if (searchKey && searchKey !== this.$route.query.search) {
            this.currentPage = 1
            this.debounces.cancel()
            const query = { page: 1, ...this.filterCustom }
            this.setQueryUrl(query)
        }
    }

    protected toggleFilter() {
        this.showFilter = !this.showFilter
        if (!this.showFilter) {
            this.onCancelFilter()
        }
        this.$nextTick(() => {
            EventBus.$emit('showFilter', this.showFilter)
        })
    }

    protected onCancelFilter() {
        this.showFilter = false
        this.filter = {}
        const query = { page: 1, ...this.filterCustom }
        this.setQueryUrl(query)
    }

    protected onFilter(filter: object) {
        this.filter = filter
        this.currentPage = 1
        const query = { page: 1, ...this.filterCustom }
        this.setQueryUrl(query)
    }

    protected onFilterCustom(filteByName: string, value: number) {
        if (value === 0 ||
            this.filterCustom[filteByName] && this.filterCustom[filteByName] === value
        ) {
            delete this.filterCustom[filteByName]
        } else {
            this.filterCustom[filteByName] = value
        }
        const query = { page: 1, ...this.filterCustom }
        this.setQueryUrl(query)
    }

    protected checkPageCurrentPageOfTotalPage() {
        if (this.currentPage < this.totalPage) {
            return true
        }
        return false
    }

    protected convertDealProductExport(deal: any, dealProduct: any) {
        const newData: any = {}
        const isDelivered = [0, 1]
        Object.keys(deal).forEach((t: any) => {
            if (t === 'deal_products') {
                return
            }
            if (t === 'email_kh_dh') {
                newData[t] = deal[t]
                newData.deal_product_code = dealProduct.product_code || ''
                newData.deal_product_name = dealProduct.product_name || ''
                newData.deal_product_quantity = +dealProduct.quantity || ''
                newData.deal_product_price = filters.priceFormat(dealProduct.price) || ''
                newData.deal_product_discount = dealProduct.discount_type && dealProduct.discount_type === '%' ? +dealProduct.discount + '%' : filters.priceFormat(dealProduct.discount) || ''
                newData.deal_product_sale_price = filters.priceFormat(dealProduct.sale_price) || ''
                newData.deal_product_total_price = filters.priceFormat(dealProduct.total_price) || ''
                newData.deal_product_customer_name = dealProduct.customer_name || ''
                newData.deal_product_delivered = isDelivered.includes(+dealProduct.is_delivered) ? dealProduct.is_delivered === 0 ? 'Chưa giao' : 'Đã giao' : ''
            }
            newData[t] = deal[t]
        })

        return newData
    }

    protected setClassDealPaymentStatus(name: string) {
        if (name === 'Thanh toán 1 phần') {
            return 'text-warning'
        }
        if (name === 'Thanh toán hết') {
            return 'text-success'
        }
        return 'text-error'
    }

    protected setQueryUrl(params: { page: number, search?: string, stage_id?: number, lead_type_id?: number, action_id?: number } =
        // tslint:disable-next-line: no-empty
        { page: 1, search: '', stage_id: undefined, lead_type_id: undefined, action_id: undefined }) {
    }

    protected flattenItems(datas: any, hasId: boolean = true) {
        const items: any[] = []
        datas.forEach((data: any) => {
            const item = {} as any
            if (hasId) {
                item.id = data.id
                item.customer_id = data.customer_id
            }
            item.deal_products = data.deal_products
            const attributes = data.attributes
            attributes.forEach((attribute: any, index: number) => {
                attribute.sort_order = this.sortOrder[attribute.slug] || attributes.length + index
            })

            attributes.sort((a: any, b: any) => {
                return a.sort_order - b.sort_order
            })

            attributes.forEach((attribute: any) => {
                if (!attribute.is_enabled || this.fieldsDisable.includes(attribute.slug)) {
                    return
                }
                item[attribute.slug] = this.getValueByType(attribute, attribute.attribute_values.map((t: { value: any }) => t.value).join(', '))
            })

            let dealStages = ''
            let dealLeadTypes = ''

            if (data.latest_action_history) {
                dealLeadTypes = this.getDealLeadTypeName(data.latest_action_history.lead_type_id)
                dealStages = this.getDealStageName(data.latest_action_history.stage_id)
            }

            const newItem: any = {}
            Object.keys(item).forEach((t: any) => {
                if (t === 'ngay_dat_hang') {
                    newItem[t] = item[t]
                    newItem.deal_stages = dealStages
                    newItem.deal_lead_types = dealLeadTypes
                }
                newItem[t] = item[t]
            })

            const user = this.allUsers.find((t) => t.id === data.created_by)
            newItem.created_by = user && user.name
            newItem.created_at = moment(data.created_at).format('DD/MM/YYYY')
            newItem.updated_at = moment(data.updated_at).format('DD/MM/YYYY')
            items.push(newItem)
        })
        return items
    }

    protected getValueByType(attribute: IAttribute, value: string) {
        if (!value) {
            return
        }
        const items: string[] = value.split(', ')
        const values: string[] = []
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
                options.forEach((option) => {
                    if (option && option.id && items.includes(option.id.toString())) {
                        values.push(option.name)
                    }
                })
                return values.join(', ')
            case InputType['User/ 1 người dùng']:
            case InputType['Users/ Nhiều người dùng']:
                this.allUsers.forEach((user) => {
                    if (user && user.id && items.includes(user.id.toString())) {
                        values.push(user.name)
                    }
                })
                return values.join(', ')
            default:
                return value
        }
    }

    protected getDealStageName(dealStageId: number) {
        const dealStage = this.dealStages.find((t: any) => t.id === dealStageId)
        return dealStage && dealStage.name || ''
    }

    protected getDealLeadTypeName(dealLeadTypeId: number) {
        const dealLeadType = this.dealLeadTypes.find((t: any) => t.id === dealLeadTypeId)
        return dealLeadType && dealLeadType.name || ''
    }
}
