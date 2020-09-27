<style src="./Show.scss" lang="scss" scoped></style>
<script src="./Show.ts" lang="ts"></script>

<template>
  <div>
    <b-modal
      id="showModalDealDetailsPayment"
      scrollable
      no-close-on-backdrop
      no-close-on-esc
      header-close-content="<i class='fas fa-times'></i>"
      modal-class="modal-footer-custom modal-deal modal-action"
      title="Chi tiết đơn hàng"
      ok-title="Đóng"
      cancel-title="Hủy bỏ"
      :ok-only="true"
    >
      <b-overlay
        v-if="isLoadingGetData"
        :show="isLoadingGetData"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
        class="mt-3"
      ></b-overlay>
      <b-overlay
        v-else
        :show="isLoading"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
      >
        <validation-observer ref="validationObserver" v-slot="{ passes }" class="w-100">
          <b-form @submit.stop.prevent="passes(onSubmit)" autocomplete="true">
            <b-tabs v-model="tabIndex" justified active-nav-item-class active-tab-class>
              <b-tab
                title="Danh sách thanh toán"
                class="tab-deal-payment tab-deal-payment-show"
                id="tabDealPayment"
              >
                <div class="row">
                  <div class="col-md-6">
                    <h4>Tổng tiền đã thanh toán: {{ filters.priceFormat(dealTotalAmountPaid) }}</h4>
                  </div>
                  <div class="col-md-6">
                    <h4
                      class="mb-3"
                    >Số tiền còn phải thanh toán: {{ filters.priceFormat(dealTotalPayment - dealTotalAmountPaid) }}</h4>
                  </div>
                </div>

                <h3>Lịch sử thanh toán</h3>
                <ListDealPaymentWithoutPagination :dealId="dealId" />
              </b-tab>
              <b-tab title="Thông tin đơn hàng" id="tabDealInfo">
                <ShowDeal :deal="deal" />
              </b-tab>
            </b-tabs>
          </b-form>
        </validation-observer>
      </b-overlay>
    </b-modal>
  </div>
</template>