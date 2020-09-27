<style src="./EditDeal.scss" lang="scss" scoped></style>
<script src="./EditDeal.ts" lang="ts"></script>

<template>
  <div>
    <!-- Thông tin đơn hàng -->
    <div class="d-flex align-items-center row">
      <h3 class="col-md-9 col-sm-9 mb-0">Thông tin đơn hàng</h3>
      <div class="col-md-3 col-sm-3 text-right">
        <b-button v-b-toggle.dealInfo>
          <i class="fas fa-angle-down"></i>
        </b-button>
      </div>
    </div>
    <b-collapse visible id="dealInfo" class="w-100">
      <div class="row mt-3">
        <template v-for="(attribute, index) in deal.attributes">
          <div class="col-md-3" :key="index" v-if="attribute.position === 1">
            <EditAttribute :serverErrors="serverErrors" :attribute="attribute" />
          </div>
        </template>
      </div>
    </b-collapse>

    <div class="nt-divider d-flex mt-4 mb-4"></div>

    <!-- Thông tin sản phẩm -->
    <div class="d-flex align-items-center row">
      <h3 class="col-md-9 col-sm-9 mb-0">Thông tin sản phẩm</h3>
      <div class="col-md-3 col-sm-3 text-right">
        <b-button v-b-toggle.dealProduct>
          <i class="fas fa-angle-down"></i>
        </b-button>
      </div>
    </div>
    <b-collapse visible id="dealProduct">
      <b-table
        class="mt-3 table-deal-products"
        bordered
        :items="deal.products"
        :fields="productFields"
        id="dealProductsTable"
      >
        <template v-slot:head()="data">
          <template v-if="data.column === 'discount_type'">
            <validation-provider
              name="Chiết khấu"
              :rules="{ required: true }"
              v-slot="validationContext"
            >
              <multiselect
                :closeOnSelect="true"
                :multiple="false"
                :options="getDealProductDiscountType"
                deselectLabel="Ấn enter để bỏ chọn"
                label="label"
                placeholder="--Lựa chọn--"
                selectedLabel
                selectLabel="Ấn enter để chọn"
                trackBy="id"
                :allowEmpty="false"
                :showLabels="false"
                v-model="dealProductDiscountType"
                :id="'discount_type' + data.index"
                :name="'discount_type' + data.index"
                :state="getValidationState(validationContext)"
                :aria-describedby="'discount_type' + data.index + '-group-feedback'"
                :class="{ 'is-invalid': validationContext.errors[0] }"
                @input="changeDealProductDiscountType"
              ></multiselect>
              <b-form-invalid-feedback
                :id="'discount_type' + data.index + '-group-feedback'"
              >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
            </validation-provider>
          </template>
          <template v-else>{{ data.label }}</template>
        </template>

        <template v-slot:cell(product_name)="data">
          <router-link
            :to="{ name: PERMISSION.PRODUCT.SHOW, params: { id: data.item.product_id } }"
            target="_blank"
          >
            {{ data.value }}
            <i class="fas fa-external-link-alt ml-1"></i>
          </router-link>
        </template>

        <template v-slot:cell(quantity)="data">
          <validation-provider
            name="Số lượng"
            :rules="{ required: true, regex: regexNumber() }"
            v-slot="validationContext"
          >
            <b-form-input
              :id="'quantity' + data.index"
              :name="'quantity' + data.index"
              v-model="data.item.quantity"
              :state="getValidationState(validationContext)"
              :aria-describedby="'quantity' + data.index + '-group-feedback'"
              @keyup="setDealProductTotalPrice(data.item)"
            ></b-form-input>
            <b-form-invalid-feedback
              :id="'quantity' + data.index + '-group-feedback'"
            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
          </validation-provider>
        </template>

        <template v-slot:cell(discount_type)="data">
          <template v-if="dealProductDiscountType && dealProductDiscountType.name">
            <template v-if="dealProductDiscountType.name === '%'">
              <validation-provider
                name="Chiết khấu"
                :rules="{ required: true, numeric: true, max_value: 100, min_value: 0 }"
                v-slot="validationContext"
              >
                <b-form-input
                  :id="'chiet_khau' + data.index"
                  :name="'chiet_khau' + data.index"
                  v-model="data.item.discount"
                  :state="getValidationState(validationContext)"
                  :aria-describedby="'chiet_khau' + data.index + '-group-feedback'"
                  @keyup="setDealProductTotalPrice(data.item)"
                ></b-form-input>
                <b-form-invalid-feedback
                  :id="'chiet_khau' + data.index + '-group-feedback'"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </validation-provider>
            </template>
            <template v-else>
              <validation-provider
                name="Chiết khấu"
                :rules="{ required: true, numeric: true, max_value: data.item.total_price, min_value: 0 }"
                v-slot="validationContext"
              >
                <b-form-input
                  :id="'chiet_khau' + data.index"
                  :name="'chiet_khau' + data.index"
                  v-model="data.item.discount"
                  :state="getValidationState(validationContext)"
                  :aria-describedby="'chiet_khau' + data.index + '-group-feedback'"
                  @keyup="setDealProductTotalPrice(data.item)"
                ></b-form-input>
                <b-form-invalid-feedback
                  :id="'chiet_khau' + data.index + '-group-feedback'"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </validation-provider>
            </template>
          </template>
        </template>

        <template v-slot:cell(customer)="data">
          <multiselect
            :closeOnSelect="true"
            :multiple="false"
            :name="'search' + data.index"
            :options="customers"
            deselectLabel="Ấn enter để bỏ chọn"
            label="ten_kh"
            :placeholder="data.item.customer_name ? data.item.customer_name : 'Tìm kiếm và chọn khách hàng'"
            selectedLabel
            selectLabel="Ấn enter để chọn"
            trackBy="id"
            :showLabels="false"
            :internal-search="false"
            :searchable="true"
            :allowEmpty="false"
            :loading="data.item.is_loading_search_customers || false"
            @search-change="searchCustomers"
            @open="searchCustomers(data.item.customer_name || '', data.item)"
            @input="changeDealProductCustomer(data.item)"
            v-model="data.item.customer"
            :id="data.item"
          >
            <span slot="noResult">Không tìm thấy khách hàng nào.</span>
          </multiselect>
        </template>

        <template v-slot:cell(is_delivered)="data">
          <validation-provider
            name="Trạng thái giao hàng"
            :rules="{ required: true }"
            v-slot="validationContext"
          >
            <multiselect
              :closeOnSelect="true"
              :multiple="false"
              :options="delivered"
              deselectLabel="Ấn enter để bỏ chọn"
              label="label"
              placeholder="--Lựa chọn--"
              selectedLabel
              selectLabel="Ấn enter để chọn"
              trackBy="id"
              :allowEmpty="false"
              :showLabels="false"
              v-model="data.item.is_delivered"
              :id="'is_delivered' + data.index"
              :name="'is_delivered' + data.index"
              :state="getValidationState(validationContext)"
              :aria-describedby="'is_delivered' + data.index + '-group-feedback'"
              :class="{ 'is-invalid': validationContext.errors[0] }"
            ></multiselect>
            <b-form-invalid-feedback
              :id="'is_delivered' + data.index + '-group-feedback'"
            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
          </validation-provider>
        </template>

        <template v-slot:cell(price)="data">{{ filters.priceFormat(data.value) }}</template>
        <template v-slot:cell(sale_price)="data">{{ filters.priceFormat(data.value) }}</template>
        <template v-slot:cell(total_price)="data">{{ filters.priceFormat(data.value) }}</template>

        <template v-slot:cell(actions)="data">
          <b-button variant="danger" @click.prevent="removeDealProduct(data.index)">Xóa</b-button>
        </template>

        <template v-slot:custom-foot="data">
          <tr>
            <template v-for="(field, index) in data.fields">
              <td :key="index">
                <template v-if="field.key === 'product_name'">
                  <multiselect
                    :closeOnSelect="true"
                    :multiple="false"
                    :name="'searchProduct'"
                    :options="products"
                    deselectLabel="Ấn enter để bỏ chọn"
                    label="ten_sp"
                    placeholder="Tìm kiếm và chọn sản phẩm"
                    selectedLabel
                    selectLabel="Ấn enter để chọn"
                    trackBy="id"
                    :showLabels="false"
                    @search-change="searchProducts"
                    @open="searchProducts"
                    @select="selectDealProduct"
                    :internal-search="false"
                    :searchable="true"
                    :loading="isLoadingGetProducts"
                  >
                    <span slot="noResult">Không tìm thấy sản phẩm nào.</span>
                  </multiselect>
                </template>
              </td>
            </template>
          </tr>
        </template>
      </b-table>

      <div class="row mt-4">
        <div class="col-md-6">
          <validation-provider
            v-if="getAttribute('ghi_chu')"
            :rules="getRules(getAttribute('ghi_chu'))"
            v-slot="validationContext"
          >
            <label for="note" class="form-control-label font-weight-bold">
              <span>{{ getAttribute('ghi_chu').name }}</span>
            </label>
            <b-form-textarea
              id="note"
              name="note"
              :state="getValidationState(validationContext)"
              :aria-describedby="'note'"
              max-rows="6"
              rows="3"
              v-model="getAttribute('ghi_chu')[getAttribute('ghi_chu').slug]"
            ></b-form-textarea>
            <b-form-invalid-feedback id="note">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
          </validation-provider>
        </div>
        <div class="col-md-6">
          <div class="col-md-8 pull-right float-right">
            <div class="row mb-2">
              <div class="col-md-8">
                <label class="font-weight-bold">{{ getAttribute('tong_thanh_tien').name }}</label>:
              </div>
              <div
                class="col-md-4 text-right"
              >{{ filters.priceFormat(getAttribute('tong_thanh_tien')[getAttribute('tong_thanh_tien').slug]) }}</div>
            </div>
            <div class="row mb-2">
              <div class="col-md-12 mb-1">
                <label class="font-weight-bold">Chiết khấu thêm:</label>
              </div>
              <div class="col-md-8">
                <div class="row">
                  <div class="col-md-6">
                    <validation-provider
                      name="Loại chiết khấu"
                      :rules="{ required: true }"
                      v-slot="validationContext"
                    >
                      <multiselect
                        :closeOnSelect="true"
                        :multiple="false"
                        :options="getAttribute('loai_chiet_khau').attribute_options"
                        deselectLabel="Ấn enter để bỏ chọn"
                        label="name"
                        placeholder="--Lựa chọn--"
                        selectedLabel
                        selectLabel="Ấn enter để chọn"
                        trackBy="id"
                        :allowEmpty="false"
                        :showLabels="false"
                        v-model="getAttribute('loai_chiet_khau')[getAttribute('loai_chiet_khau').slug]"
                        id="loat_chiet_khau"
                        name="loat_chiet_khau"
                        :state="getValidationState(validationContext)"
                        :aria-describedby="'loat_chiet_khau-group-feedback'"
                        :class="{ 'is-invalid': validationContext.errors[0] }"
                        @input="changeDealDiscountType"
                      ></multiselect>
                      <b-form-invalid-feedback
                        :id="'loat_chiet_khau-group-feedback'"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </validation-provider>
                  </div>
                  <div class="col-md-6">
                    <template
                      v-if="getAttribute('loai_chiet_khau')[getAttribute('loai_chiet_khau').slug]"
                    >
                      <template
                        v-if="getAttribute('loai_chiet_khau')[getAttribute('loai_chiet_khau').slug].name === '%'"
                      >
                        <validation-provider
                          name="Giá trị chiết khấu"
                          :rules="{ required: true, numeric: true, max_value: 100, min_value: 0 }"
                          v-slot="validationContext"
                        >
                          <b-form-input
                            :id="'gia_tri_chiet_khau'"
                            :name="'gia_tri_chiet_khau'"
                            v-model="getAttribute('gia_tri_chiet_khau')[getAttribute('gia_tri_chiet_khau').slug]"
                            :state="getValidationState(validationContext)"
                            :aria-describedby="'gia_tri_chiet_khau' + '-group-feedback'"
                            @keyup="setDealTotalPayment()"
                          ></b-form-input>
                          <b-form-invalid-feedback
                            :id="'gia_tri_chiet_khau' + '-group-feedback'"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </validation-provider>
                      </template>
                      <template v-else>
                        <validation-provider
                          name="Giá trị chiết khấu"
                          :rules="{ required: true, numeric: true, max_value: getAttribute('tong_thanh_tien')[getAttribute('tong_thanh_tien').slug], min_value: 0 }"
                          v-slot="validationContext"
                        >
                          <b-form-input
                            :id="'gia_tri_chiet_khau'"
                            :name="'gia_tri_chiet_khau'"
                            v-model="getAttribute('gia_tri_chiet_khau')[getAttribute('gia_tri_chiet_khau').slug]"
                            :state="getValidationState(validationContext)"
                            :aria-describedby="'gia_tri_chiet_khau' + '-group-feedback'"
                            @keyup="setDealTotalPayment()"
                          ></b-form-input>
                          <b-form-invalid-feedback
                            :id="'gia_tri_chiet_khau' + '-group-feedback'"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </validation-provider>
                      </template>
                    </template>
                  </div>
                </div>
              </div>
              <div
                class="col-md-4 text-right"
              >- {{ filters.priceFormat(getAttribute('tong_chiet_khau')[getAttribute('tong_chiet_khau').slug]) }}</div>
            </div>
            <div class="nt-divider d-flex mt-3 mb-3"></div>
            <div class="row mb-2">
              <div class="col-md-12 mb-1">
                <label class="font-weight-bold">VAT:</label>
              </div>
              <div class="col-md-8">
                <validation-provider
                  name="VAT"
                  :rules="{ required: true }"
                  v-slot="validationContext"
                >
                  <multiselect
                    :closeOnSelect="true"
                    :multiple="false"
                    :options="getAttribute('loai_vat').attribute_options"
                    deselectLabel="Ấn enter để bỏ chọn"
                    label="name"
                    placeholder="--Lựa chọn--"
                    selectedLabel
                    selectLabel="Ấn enter để chọn"
                    trackBy="id"
                    :allowEmpty="false"
                    :showLabels="false"
                    v-model="getAttribute('loai_vat')[getAttribute('loai_vat').slug]"
                    id="vat"
                    name="vat"
                    :state="getValidationState(validationContext)"
                    :aria-describedby="'vat-group-feedback'"
                    :class="{ 'is-invalid': validationContext.errors[0] }"
                    @input="setDealTotalPayment"
                  ></multiselect>
                  <b-form-invalid-feedback
                    :id="'vat-group-feedback'"
                  >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                </validation-provider>
              </div>
              <div
                class="col-md-4 text-right"
              >+ {{ filters.priceFormat(getAttribute('tong_tien_vat')[getAttribute('tong_tien_vat').slug]) }}</div>
            </div>
            <div class="nt-divider d-flex mt-3 mb-3"></div>
            <div class="row">
              <div class="col-md-8">
                <label class="font-weight-bold">{{ getAttribute('tong_thanh_toan').name }}</label>:
              </div>
              <div
                class="col-md-4 text-right"
              >{{ filters.priceFormat(getAttribute('tong_thanh_toan')[getAttribute('tong_thanh_toan').slug]) }}</div>
            </div>
          </div>
        </div>
      </div>
    </b-collapse>

    <div class="nt-divider d-flex mt-4 mb-4"></div>

    <!-- Thông tin mở rộng -->
    <div class="d-flex align-items-center row">
      <h3 class="col-md-9 col-sm-9 mb-0">Thông tin mở rộng</h3>
      <div class="col-md-3 col-sm-3 text-right">
        <b-button v-b-toggle.dealInfoExtend>
          <i class="fas fa-angle-down"></i>
        </b-button>
      </div>
    </div>
    <b-collapse visible id="dealInfoExtend" class="w-100">
      <div class="row mt-3">
        <template v-for="(attribute, index) in deal.attributes">
          <div class="col-md-3" :key="index" v-if="attribute.position === 3">
            <EditAttribute :serverErrors="serverErrors" :attribute="attribute" />
          </div>
        </template>
      </div>
    </b-collapse>
  </div>
</template>