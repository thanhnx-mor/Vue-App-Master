<style src="./ShowDeal.scss" lang="scss" scoped></style>
<script src="./ShowDeal.ts" lang="ts"></script>

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
          <div class="col-md-3 form-group" :key="index" v-if="attribute.position === 1">
            <ShowAttribute :attribute="attribute" />
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
        <template v-slot:custom-foot="data" v-if="deal.products.length <= 0">
          <b-tr>
            <b-td
              :colspan="data.fields.length"
              class="text-center text-confirm"
            >Không có sản phẩm nào.</b-td>
          </b-tr>
        </template>

        <template v-slot:head()="data">
          <template
            v-if="data.column === 'discount_type'"
          >{{ dealProductDiscountType && dealProductDiscountType.label || '' }}</template>
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

        <template v-slot:cell(quantity)="data">{{ data.item.quantity }}</template>

        <template v-slot:cell(discount_type)="data">
          <template v-if="dealProductDiscountType && dealProductDiscountType.name">
            <template v-if="dealProductDiscountType.name === '%'">{{ data.item.discount }} %</template>
            <template v-else>{{ filters.priceFormat(data.item.discount) }}</template>
          </template>
        </template>

        <template
          v-slot:cell(is_delivered)="data"
        >{{ data.item.is_delivered && data.item.is_delivered.label || '' }}</template>

        <template v-slot:cell(price)="data">{{ filters.priceFormat(data.value) }}</template>
        <template v-slot:cell(sale_price)="data">{{ filters.priceFormat(data.value) }}</template>
        <template v-slot:cell(total_price)="data">{{ filters.priceFormat(data.value) }}</template>
      </b-table>

      <div class="row mt-4">
        <div class="col-md-6">
          <label class="font-weight-bold">{{ getAttribute('ghi_chu').name }}</label>:
          <div class="nt-show-textarea">
            <template
              v-if="getAttribute('ghi_chu')[getAttribute('ghi_chu').slug]"
            >{{ getAttribute('ghi_chu')[getAttribute('ghi_chu').slug] }}</template>
            <span v-else class="not-value">Chưa cập nhật</span>
          </div>
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
              <div class="col-md-8 mb-1">
                <label class="font-weight-bold">
                  Chiết khấu thêm
                  <template
                    v-if="getAttribute('loai_chiet_khau')[getAttribute('loai_chiet_khau').slug].name === '%'"
                  >
                    ({{ getAttribute('gia_tri_chiet_khau')[getAttribute('gia_tri_chiet_khau').slug] }}
                    {{ getAttribute('loai_chiet_khau')[getAttribute('loai_chiet_khau').slug].name }})
                  </template>
                  :
                </label>
              </div>
              <div
                class="col-md-4 text-right"
              >- {{ filters.priceFormat(getAttribute('tong_chiet_khau')[getAttribute('tong_chiet_khau').slug]) }}</div>
            </div>
            <div class="row mb-2">
              <div class="col-md-8 mb-1">
                <label
                  class="font-weight-bold"
                >VAT({{ getAttribute('loai_vat')[getAttribute('loai_vat').slug].name }}):</label>
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
          <div class="col-md-3 form-group" :key="index" v-if="attribute.position === 3">
            <ShowAttribute :attribute="attribute" />
          </div>
        </template>
      </div>
    </b-collapse>
  </div>
</template>