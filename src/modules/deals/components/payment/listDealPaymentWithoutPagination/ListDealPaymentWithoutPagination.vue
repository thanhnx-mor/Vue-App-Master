<style src="./ListDealPaymentWithoutPagination.scss" lang="scss" scoped></style>
<script src="./ListDealPaymentWithoutPagination.ts" lang="ts"></script>

<template>
  <div>
    <b-overlay
      v-if="isLoadingDealPaymentHistories"
      :show="isLoadingDealPaymentHistories"
      rounded
      opacity="0.6"
      spinner-small
      spinner-variant="primary"
    ></b-overlay>
    <template v-else>
      <template v-if="dealPaymentHistories.length">
        <div class="deal-action-histories">
          <div
            class="deal-action-histories-item"
            v-for="(dealActionHistory, index) in dealPaymentHistories"
            :key="index"
          >
            <h4>#{{ dealPaymentHistories.length - index}}</h4>
            <div class="form-group mb-2">
              <label class="form-control-label font-weight-bold mb-0">Ngày thanh toán:</label>
              {{ dealActionHistory.payment_datetime }}
            </div>
            <div class="form-group mb-2">
              <label class="form-control-label font-weight-bold mb-0">Số tiền thanh toán:</label>
              {{ dealActionHistory.payment_amount }}
            </div>
            <div class="form-group mb-2">
              <label class="form-control-label font-weight-bold mb-0">Phương thức thanh toán:</label>
              <template
                v-if="getDealPaymentMethodName(dealActionHistory.payment_method)"
              >{{ getDealPaymentMethodName(dealActionHistory.payment_method) }}</template>
              <span class="not-value" v-else>Chưa cập nhật</span>
            </div>
            <div class="form-group mb-2">
              <label class="form-control-label font-weight-bold mb-0">Mã chứng từ:</label>
              <template v-if="dealActionHistory.voucher">{{ dealActionHistory.voucher }}</template>
              <span class="not-value" v-else>Chưa cập nhật</span>
            </div>
            <div class="form-group mb-2">
              <label class="form-control-label font-weight-bold mb-0">Ghi chú:</label>
              <template v-if="dealActionHistory.note">{{ dealActionHistory.note }}</template>
              <span class="not-value" v-else>Chưa cập nhật</span>
            </div>
            <div class="form-group mb-2">
              <label class="form-control-label font-weight-bold mb-0">Tạo bởi:</label>
              {{ getUserName(dealActionHistory.user_id) }}
            </div>
            <div class="form-group mb-4">
              <label class="form-control-label font-weight-bold mb-0 mr-1">Tạo lúc:</label>
              {{ dealActionHistory.created_at }}
            </div>
          </div>
        </div>
      </template>
      <div v-else>
        <p class="mb-0">Chưa có lịch sử thanh toán nào.</p>
      </div>
    </template>
  </div>
</template>