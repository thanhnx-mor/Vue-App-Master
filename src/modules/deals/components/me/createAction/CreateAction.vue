<style src="./CreateAction.scss" lang="scss" scoped></style>
<script src="./CreateAction.ts" lang="ts"></script>

<template>
  <div>
    <b-modal
      id="showModalDealAction"
      scrollable
      no-close-on-backdrop
      no-close-on-esc
      header-close-content="<i class='fas fa-times'></i>"
      modal-class="modal-footer-custom modal-deal modal-action"
      title="Ghi nhận tác nghiệp"
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
              <b-tab title="Kết quả tác nghiệp" class="tab-action-info" id="tabActionInfo">
                <template v-slot:title>
                  <span
                    :class="tabErrors && tabErrors.actionInfo ? 'text-error' : ''"
                  >Kết quả tác nghiệp</span>
                  <template v-if="tabErrors && tabErrors.actionInfo">
                    <i
                      class="fas fa-exclamation-circle text-error ml-2"
                      v-b-tooltip.hover
                      title="Có lỗi xảy ra, vui lòng kiểm tra lại."
                    ></i>
                  </template>
                </template>
                <div class="row">
                  <div class="col-md-6">
                    <CreateActionHistory
                      :dealActionInfo="dealActionInfo"
                      :serverErrors="serverErrors"
                      :latestActionHistory="dealActionHistories.length ? dealActionHistories[0] : {}"
                      @updateDataDealActionInfo="updateDataDealActionInfo"
                    />
                  </div>
                  <div class="col-md-6">
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
                  </div>
                </div>
              </b-tab>
              <b-tab title="Thông tin đơn hàng" id="tabDealInfo">
                <template v-slot:title>
                  <span
                    :class="tabErrors && tabErrors.dealInfo ? 'text-error' : ''"
                  >Thông tin đơn hàng</span>
                  <template v-if="tabErrors && tabErrors.dealInfo">
                    <i
                      class="fas fa-exclamation-circle text-error ml-2"
                      v-b-tooltip.hover
                      title="Có lỗi xảy ra, vui lòng kiểm tra lại."
                    ></i>
                  </template>
                </template>
                <EditDeal :deal="deal" :serverErrors="serverErrors" />
              </b-tab>
              <b-tab title="Thông tin khách hàng" id="tabCustomerInfo">
                <template v-slot:title>
                  <span
                    :class="tabErrors && tabErrors.customerInfo ? 'text-error' : ''"
                  >Thông tin khách hàng</span>
                  <template v-if="tabErrors && tabErrors.customerInfo">
                    <i
                      class="fas fa-exclamation-circle text-error ml-2"
                      v-b-tooltip.hover
                      title="Có lỗi xảy ra, vui lòng kiểm tra lại."
                    ></i>
                  </template>
                </template>
                <EditCustomer :customer="customer" :serverErrors="serverErrors" />
              </b-tab>
            </b-tabs>
          </b-form>
        </validation-observer>
      </b-overlay>
    </b-modal>
  </div>
</template>