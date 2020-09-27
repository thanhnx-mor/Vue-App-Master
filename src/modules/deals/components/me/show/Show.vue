<style src="./Show.scss" lang="scss" scoped></style>
<script src="./Show.ts" lang="ts"></script>

<template>
  <div>
    <b-modal
      id="showModalDealDetailsAction"
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
            <b-tabs justified active-nav-item-class active-tab-class>
              <b-tab title="Kết quả tác nghiệp" class="tab-action-info" id="tabActionInfo" active>
                <h3>Lịch sử tác nghiệp</h3>
                <b-overlay
                  v-if="isLoadingDealActionHistories"
                  :show="isLoadingDealActionHistories"
                  rounded
                  opacity="0.6"
                  spinner-small
                  spinner-variant="primary"
                ></b-overlay>
                <template v-else>
                  <ListDealActionWithoutPagination :dealActionHistories="dealActionHistories" />
                </template>
              </b-tab>
              <b-tab title="Thông tin đơn hàng" id="tabDealInfo">
                <ShowDeal :deal="deal" />
              </b-tab>
              <b-tab title="Thông tin khách hàng" id="tabCustomerInfo">
                <ShowCustomer :customer="customer" />
              </b-tab>
            </b-tabs>
          </b-form>
        </validation-observer>
      </b-overlay>
    </b-modal>
  </div>
</template>