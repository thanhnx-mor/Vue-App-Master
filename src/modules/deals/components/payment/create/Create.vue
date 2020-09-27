<style src="./Create.scss" lang="scss" scoped></style>
<script src="./Create.ts" lang="ts"></script>

<template>
  <div>
    <b-modal
      id="showModalDealPayment"
      scrollable
      no-close-on-backdrop
      no-close-on-esc
      header-close-content="<i class='fas fa-times'></i>"
      modal-class="modal-footer-custom modal-deal modal-action"
      title="Thêm thanh toán"
      ok-title="Lưu lại"
      cancel-title="Hủy bỏ"
      @ok="onSubmit"
      @cancel="onCancel"
      @close="onCancel"
      :ok-disabled="isLoading"
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
              <b-tab title="Thêm thanh toán" class="tab-deal-payment" id="tabDealPayment">
                <template v-slot:title>
                  <span
                    :class="tabErrors && tabErrors.tabDealPayment ? 'text-error' : ''"
                  >Thêm thanh toán</span>
                  <template v-if="tabErrors && tabErrors.tabDealPayment">
                    <i
                      class="fas fa-exclamation-circle text-error ml-2"
                      v-b-tooltip.hover
                      title="Có lỗi xảy ra, vui lòng kiểm tra lại."
                    ></i>
                  </template>
                </template>
                <div class="row">
                  <div class="col-md-6">
                    <CreateDealPayment
                      :dealPayment="dealPayment"
                      :deal="deal"
                      :serverErrors="serverErrors"
                      @updateDataDealPayment="updateDataDealPayment"
                    />
                  </div>
                  <div class="col-md-6">
                    <h3>Lịch sử thanh toán</h3>
                    <ListDealPaymentWithoutPagination :dealId="dealId" />
                  </div>
                </div>
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