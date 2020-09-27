<style src="./Details.scss" lang="scss" scoped></style>
<script src="./Details.ts" lang="ts"></script>

<template>
  <div>
    <div class="body-upper">
      <b-breadcrumb :items="breadcrumbItems"></b-breadcrumb>
      <div class="actions" v-if="!isLoading">
        <template v-if="hasPermission([PERMISSION.DEAL['*'], PERMISSION.DEAL.UPDATE])">
          <b-button
            @click.prevent="showModalDealUpdate()"
            class="nt_btn nt_btn-warning nt-button-top"
          >
            <i class="fas fa-edit mr-2"></i>
            Sửa đơn hàng
          </b-button>
        </template>
        <template v-else>
          <b-button
            class="nt_btn nt_btn-warning nt-button-top permission-btn-disabled"
            v-b-tooltip.hover
            :title="messageNotPermission"
          >
            <i class="fas fa-edit mr-2"></i>
            Sửa đơn hàng
          </b-button>
        </template>
        <Edit @onUpdated="onUpdated" />
      </div>
    </div>

    <div class="body-content p-0">
      <b-overlay
        v-if="isLoading"
        :show="isLoading"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
      ></b-overlay>
      <template v-else>
        <b-overlay rounded opacity="0.6" spinner-small spinner-variant="primary" class="mb-4">
          <b-row>
            <b-col cols="12">
              <b-row>
                <div class="col-md-6">
                  <h4
                    v-if="getAttribute('ten_dh')[getAttribute('ten_dh').slug]"
                  >{{ getAttribute('ten_dh')[getAttribute('ten_dh').slug] }}</h4>
                  <h5>{{ getAttribute('ma_dh')[getAttribute('ma_dh').slug] }}</h5>
                  <div class="d-flex align-items-center mb-1">
                    <label class="font-weight-bold mb-0 mr-1">Khách hàng:</label>
                    <b-dropdown
                      :text="getAttribute('ten_kh_dh')[getAttribute('ten_kh_dh').slug]"
                      class="customer-info"
                    >
                      <b-dropdown-text>{{ getAttribute('ma_kh_dh')[getAttribute('ma_kh_dh').slug] }}</b-dropdown-text>
                      <b-dropdown-text
                        v-if="getAttribute('sdt_kh_dh')[getAttribute('sdt_kh_dh').slug]"
                      >{{ filters.phoneFormat(getAttribute('sdt_kh_dh')[getAttribute('sdt_kh_dh').slug]) }}</b-dropdown-text>
                      <b-dropdown-text
                        v-if="getAttribute('email_kh_dh')[getAttribute('email_kh_dh').slug]"
                      >{{ getAttribute('email_kh_dh')[getAttribute('email_kh_dh').slug] }}</b-dropdown-text>
                      <b-dropdown-text>
                        <router-link
                          :to="{ name: PERMISSION.CUSTOMER.SHOW, params: { id: deal.customer_id } }"
                          target="_blank"
                        >
                          Xem chi tiết
                          <i data-v-40c8d25b class="fas fa-external-link-alt ml-1"></i>
                        </router-link>
                      </b-dropdown-text>
                    </b-dropdown>
                  </div>
                  <div class="d-flex align-items-center">
                    <label class="font-weight-bold mb-0 mr-1">Người phụ trách:</label>
                    <template
                      v-if="getAttribute('nguoi_phu_trach_dh') && 
                    getAttribute('nguoi_phu_trach_dh').attribute_values.length"
                    >
                      <template
                        v-for="(item, index) in getAttribute('nguoi_phu_trach_dh').attribute_values"
                      >
                        <span
                          :key="index"
                          class="nt-badge-dropdown mr-2"
                        >{{ getValueByType(getAttribute('nguoi_phu_trach_dh'), item.value) }}</span>
                      </template>
                    </template>
                    <span class="not-value" v-else>Chưa cập nhật</span>
                  </div>
                </div>
                <div class="col-md-6 text-right">
                  <div class="mb-1">
                    <h5>Tổng giá trị đơn hàng: {{ filters.priceFormat(getAttribute("tong_thanh_toan")[getAttribute("tong_thanh_toan").slug]) }}</h5>
                  </div>
                  <div class="mb-1">
                    <h5>
                      Tổng tiền đã thanh toán:
                      <template
                        v-if="getAttribute('tong_tien_da_thanh_toan')[getAttribute('tong_tien_da_thanh_toan').slug]"
                      >{{ filters.priceFormat(getAttribute("tong_tien_da_thanh_toan")[getAttribute("tong_tien_da_thanh_toan").slug]) }}</template>
                      <template v-else>0</template>
                    </h5>
                  </div>
                  <div class="mb-1">
                    <h5>
                      Số tiền còn phải thanh toán:
                      <template
                        v-if="getAttribute('tong_tien_da_thanh_toan')[getAttribute('tong_tien_da_thanh_toan').slug]"
                      >{{ filters.priceFormat(getAttribute("tong_thanh_toan")[getAttribute("tong_thanh_toan").slug] - getAttribute("tong_tien_da_thanh_toan")[getAttribute("tong_tien_da_thanh_toan").slug]) }}</template>
                      <template
                        v-else
                      >{{ filters.priceFormat(getAttribute("tong_thanh_toan")[getAttribute("tong_thanh_toan").slug]) }}</template>
                    </h5>
                  </div>
                </div>
              </b-row>
            </b-col>
          </b-row>
        </b-overlay>
        <b-overlay rounded opacity="0.6" spinner-small spinner-variant="primary" class="mb-4">
          <b-row>
            <b-col cols="12">
              <b-row>
                <template v-for="(attribute, index) in deal.attributes">
                  <div
                    class="col-sm-6 pt-2 pb-2"
                    :key="index"
                    v-if="attribute.is_enabled && !attributesDisable.includes(attribute.slug)"
                  >
                    <div
                      class="form-group m-form__group nt-attribute-item"
                      style="margin: 0px;"
                      :class="[ attributesReadOnly.includes(attribute.slug) ? 'nt-attribute-item-disabled' : '',
                        !hasPermission([PERMISSION.DEAL['*'], PERMISSION.DEAL.UPDATE,]) ? 'nt-attribute-item-disabled' : '',
                      ]"
                    >
                      <label for="deal_group" class="font-weight-bold">
                        <span :class="{ required: attribute.is_required }">
                          {{ attribute.name }}
                          <i
                            v-if="attributesReadOnly.includes(attribute.slug)"
                            class="fas fa-lock ml-1"
                          ></i>
                        </span>
                      </label>
                      <div class="form-control nt-form-control-sm pl-0 pr-0 nt-border-none">
                        <div
                          class="item"
                          :class="[inputType['Textarea/ Đoạn văn bản'] === attribute.attribute_input_type_id ? 'nt-show-textarea' : '',]"
                        >
                          <span
                            class="not-value"
                            v-if="!attribute.attribute_values.length"
                          >Chưa cập nhật</span>
                          <span v-for="(item, indexA) in attribute.attribute_values" :key="indexA">
                            <template v-if="item.value">
                              <template v-if="isMultiple(attribute.attribute_input_type_id)">
                                <div
                                  class="nt-badge-dropdown mr-2 mb-2"
                                >{{ getValueByType(attribute, item.value) }}</div>
                              </template>
                              <span
                                v-else
                                :class="[attribute.slug === 'trang_thai_thanh_toan' ? setClassDealPaymentStatus(getValueByType(attribute, item.value)) : '']"
                              >
                                {{ getValueByType(attribute, item.value) }}
                                <i
                                  v-if="attribute.slug === 'trang_thai_thanh_toan' && getValueByType(attribute, item.value) === 'Thanh toán hết'"
                                  class="fas fa-check ml-1"
                                ></i>
                              </span>
                            </template>
                            <span class="not-value" v-else>Chưa cập nhật</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </b-row>
            </b-col>
          </b-row>
        </b-overlay>
        <b-overlay rounded opacity="0.6" spinner-small spinner-variant="primary">
          <b-row>
            <b-col cols="12" class="mt-4">
              <b-table
                bordered
                hover
                responsive
                :items="dealProducts"
                :fields="productFields"
                class="mt-2"
                sticky-header="calc(100vh - 300px)"
              >
                <template v-slot:custom-foot="data" v-if="dealProducts.length <= 0">
                  <b-tr>
                    <b-td
                      :colspan="data.fields.length"
                      class="text-center text-confirm"
                    >Không có sản phẩm nào.</b-td>
                  </b-tr>
                </template>
                <template v-slot:cell(product_name)="data">
                  <router-link
                    target="_blank"
                    :to="{ name: PERMISSION.PRODUCT.SHOW, params: { id: data.item.product_id } }"
                  >
                    {{ data.value }}
                    <i class="fas fa-external-link-alt ml-1"></i>
                  </router-link>
                </template>
                <template v-slot:cell(customer_name)="data">
                  <router-link
                    v-if="data.value"
                    target="_blank"
                    :to="{ name: PERMISSION.CUSTOMER.SHOW, params: { id: data.item.customer_id } }"
                  >
                    {{ data.value }}
                    <i class="fas fa-external-link-alt ml-1"></i>
                  </router-link>
                </template>
                <template v-slot:cell(price)="data">{{ filters.priceFormat(data.value) }}</template>
                <template v-slot:cell(sale_price)="data">{{ filters.priceFormat(data.value) }}</template>
                <template v-slot:cell(total_price)="data">{{ filters.priceFormat(data.value) }}</template>
                <template v-slot:cell(is_delivered)="data">
                  <template v-if="data.value == 0">Chưa giao hàng</template>
                  <template v-if="data.value == 1">Đã giao hàng</template>
                </template>
                <template v-slot:cell(discount_type)="data">
                  <template v-if="data.value == '%'">{{ filters.priceFormat(data.item.discount) }} %</template>
                  <template
                    v-if="data.value == 'Giá trị'"
                  >{{ filters.priceFormat(data.item.discount) }}</template>
                </template>
              </b-table>
              <div class="row mt-4">
                <div class="col-md-6">
                  <template>
                    <label class="font-weight-bold">{{ getAttribute("ghi_chu").name }}</label>
                    <div
                      class="nt-show-textarea"
                      v-if="getAttribute('ghi_chu')[getAttribute('ghi_chu').slug]"
                    >{{ getAttribute("ghi_chu")[getAttribute("ghi_chu").slug] }}</div>
                    <div class="not-value" v-else>Chưa cập nhật</div>
                  </template>
                </div>
                <div class="col-md-6" v-if="dealProducts.length">
                  <div class="col-md-8 pull-right float-right">
                    <div class="row mb-2">
                      <div class="col-md-8">
                        <label class="font-weight-bold">{{ getAttribute("tong_thanh_tien").name }}</label>:
                      </div>
                      <div
                        class="col-md-4 text-right"
                      >{{ filters.priceFormat(getAttribute("tong_thanh_tien")[getAttribute("tong_thanh_tien").slug]) }}</div>
                    </div>
                    <div class="row mb-2">
                      <div
                        class="col-md-8"
                        v-if="getValueByType(getAttribute('loai_chiet_khau'),getAttribute('loai_chiet_khau')[getAttribute('loai_chiet_khau').slug]) == '%'"
                      >
                        <label
                          class="font-weight-bold"
                        >Chiết khấu thêm ({{ filters.priceFormat(getAttribute("gia_tri_chiet_khau")[getAttribute("gia_tri_chiet_khau").slug]) }}%)</label>
                      </div>
                      <div
                        class="col-md-8"
                        v-if="getValueByType(getAttribute('loai_chiet_khau'),getAttribute('loai_chiet_khau')[getAttribute('loai_chiet_khau').slug]) == 'Giá trị'"
                      >
                        <label class="font-weight-bold">Chiết khấu thêm:</label>
                      </div>
                      <div
                        class="col-md-4 text-right"
                      >- {{ filters.priceFormat(getAttribute("tong_chiet_khau")[getAttribute("tong_chiet_khau").slug]) }}</div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-md-8">
                        <label
                          class="font-weight-bold"
                        >VAT ({{ getValueByType(getAttribute("loai_vat"),getAttribute("loai_vat")[getAttribute("loai_vat").slug]) }})</label>:
                      </div>
                      <div
                        class="col-md-4 text-right"
                      >+ {{filters.priceFormat(getAttribute("tong_tien_vat")[getAttribute("tong_tien_vat").slug]) }}</div>
                    </div>
                    <div class="nt-divider d-flex mt-3 mb-3"></div>
                    <div class="row">
                      <div class="col-md-8">
                        <label class="font-weight-bold">{{ getAttribute("tong_thanh_toan").name }}</label>:
                      </div>
                      <div
                        class="col-md-4 text-right"
                      >{{ filters.priceFormat(getAttribute("tong_thanh_toan")[getAttribute("tong_thanh_toan").slug]) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-overlay>
      </template>
    </div>
  </div>
</template>
