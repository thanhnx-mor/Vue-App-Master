<style src="./ListDealActionWithoutPagination.scss" lang="scss" scoped></style>
<script src="./ListDealActionWithoutPagination.ts" lang="ts"></script>

<template>
  <div>
    <template v-if="dealActionHistories.length">
      <div class="deal-action-histories">
        <div
          class="deal-action-histories-item"
          v-for="(dealActionHistory, index) in dealActionHistories"
          :key="index"
        >
          <h4>#{{ dealActionHistories.length - index}}</h4>
          <div class="form-group mb-2">
            <label class="form-control-label font-weight-bold mb-0">Hành động:</label>
            {{ getDealActionName(dealActionHistory.action_id) }}
          </div>
          <div class="form-group mb-2">
            <label class="form-control-label font-weight-bold mb-0">Kết quả xử lý:</label>
            {{ getDealActionResultName(dealActionHistory.action_result_id) }}
          </div>
          <div class="form-group mb-2">
            <label class="form-control-label font-weight-bold mb-0">Hành động tiếp theo:</label>
            <template
              v-if="dealActionHistory.next_action_id"
            >{{ getDealActionName(dealActionHistory.next_action_id) }}</template>
            <span class="not-value" v-else>Chưa cập nhật</span>
          </div>
          <div class="form-group mb-2">
            <label
              class="form-control-label font-weight-bold mb-0"
            >Thời gian diễn ra hành động tiếp theo:</label>
            <template
              v-if="dealActionHistory.next_action_id"
            >{{ getNextActionTime(dealActionHistory.next_action_time, dealActionHistory.next_action_timetype) }}</template>
            <span class="not-value" v-else>Chưa cập nhật</span>
          </div>
          <div class="form-group mb-2">
            <label class="form-control-label font-weight-bold mb-0">Trạng thái xử lý:</label>
            {{ getDealStageName(dealActionHistory.stage_id) }}
          </div>
          <div class="form-group mb-2">
            <label class="form-control-label font-weight-bold mb-0">Phân loại lead:</label>
            {{ getDealLeadTypeName(dealActionHistory.lead_type_id) }}
          </div>
          <div class="form-group mb-2">
            <label class="form-control-label font-weight-bold mb-0">Ghi chú:</label>
            <div class="nt-show-textarea">{{ dealActionHistory.note }}</div>
          </div>
          <div class="form-group mb-2">
            <label class="form-control-label font-weight-bold mb-0">Xử lý bởi:</label>
            {{ getUserName(dealActionHistory.user_id) }}
          </div>
          <div class="form-group mb-4">
            <label class="form-control-label font-weight-bold mb-0 mr-1">Thời điểm xử lý:</label>
            <span
              v-b-tooltip.hover
              :title="dealActionHistory.processing_time"
            >{{ dealActionHistory.processing_time_from_now }}</span>
          </div>
        </div>
      </div>
    </template>
    <div v-else>
      <p class="mb-0">Chưa có lịch sử tác nghiệp nào.</p>
    </div>
  </div>
</template>