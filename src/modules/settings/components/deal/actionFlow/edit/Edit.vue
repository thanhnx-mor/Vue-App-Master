<style src="./Edit.scss" lang="scss" scoped></style>
<script src="./Edit.ts" lang="ts"></script>

<template>
  <div>
    <b-modal
      id="dealActionFlowUpdateModal"
      no-close-on-backdrop
      no-close-on-esc
      header-close-content="<i class='fas fa-times'></i>"
      modal-class="modal-footer-custom"
      title="Chỉnh sửa luồng tác nghiệp"
      ok-title="Cập nhật"
      cancel-title="Hủy bỏ"
      @ok="onSubmit"
      @cancel="onCancel"
      @close="onCancel"
      :ok-disabled="isDisabled"
    >
      <b-overlay :show="isLoading" rounded opacity="0.6" spinner-small spinner-variant="primary">
        <validation-observer ref="validationObserver" v-slot="{ passes }" class="w-100">
          <b-form @submit.stop.prevent="passes(onSubmit)" autocomplete="true">
            <validation-provider
              name="Hành động"
              :rules="{ required: true }"
              v-slot="validationContext"
            >
              <b-form-group
                id="deal_action_flow-action_id-group"
                label="Hành động"
                label-for="deal_action_flow-action_id"
                label-class="required"
              >
                <multiselect
                  :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors['action_id']) }"
                  :name="'deal_action_flow-action_id'"
                  :options="dealActions"
                  deselectLabel="Ấn enter để bỏ chọn"
                  label="name"
                  placeholder="--Lựa chọn--"
                  selectedLabel
                  selectLabel="Ấn enter để chọn"
                  trackBy="id"
                  v-model="dealActionFlow.action_id"
                  :showLabels="false"
                  @input="resetAttributeError('action_id', serverErrors)"
                ></multiselect>
                <b-form-invalid-feedback
                  v-if="serverErrors && serverErrors['action_id']"
                  id="deal_action_flow-action_id-group-feedback"
                >{{ serverErrors['action_id'][0] }}</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else
                  id="deal_action_flow-action_id-group-feedback"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <validation-provider
              name="Kết quả xử lý"
              :rules="{ required: true }"
              v-slot="validationContext"
            >
              <b-form-group
                id="deal_action_flow-action_result_id-group"
                label="Kết quả xử lý"
                label-for="deal_action_flow-action_result_id"
                label-class="required"
              >
                <multiselect
                  :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors['action_result_id']) }"
                  :name="'deal_action_flow-action_result_id'"
                  :options="dealActionResults"
                  deselectLabel="Ấn enter để bỏ chọn"
                  label="name"
                  placeholder="--Lựa chọn--"
                  selectedLabel
                  selectLabel="Ấn enter để chọn"
                  trackBy="id"
                  v-model="dealActionFlow.action_result_id"
                  :showLabels="false"
                  @input="resetAttributeError('action_result_id', serverErrors)"
                ></multiselect>
                <b-form-invalid-feedback
                  v-if="serverErrors && serverErrors['action_result_id']"
                  id="deal_action_flow-action_result_id-group-feedback"
                >{{ serverErrors['action_id'][0] }}</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else
                  id="deal_action_flow-action_result_id-group-feedback"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <validation-provider
              name="Hành động tiếp theo"
              :rules="{ required:  dealActionFlow.next_action_time || dealActionFlow.next_action_timetype ? true : false }"
              v-slot="validationContext"
            >
              <b-form-group
                id="deal_action_flow-next_action_id-group"
                label="Hành động tiếp theo"
                label-for="deal_action_flow-next_action_id"
              >
                <multiselect
                  :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors['next_action_id']) }"
                  :name="'deal_action_flow-next_action_id'"
                  :options="dealActions"
                  deselectLabel="Ấn enter để bỏ chọn"
                  label="name"
                  placeholder="--Lựa chọn--"
                  selectedLabel
                  selectLabel="Ấn enter để chọn"
                  trackBy="id"
                  v-model="dealActionFlow.next_action_id"
                  :showLabels="false"
                  @input="resetAttributeError('next_action_id', serverErrors)"
                ></multiselect>
                <b-form-invalid-feedback
                  v-if="serverErrors && serverErrors['next_action_id']"
                  id="deal_action_flow-next_action_id-group-feedback"
                >{{ serverErrors['next_action_id'][0] }}</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else
                  id="deal_action_flow-next_action_id-group-feedback"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <b-form-group
              id="deal_action_flow-next_action_time-group"
              label="Thời gian diễn ra động tiếp theo"
              label-for="deal_action_flow-next_action_time"
            >
              <div class="row">
                <div class="col-md-6">
                  <validation-provider
                    name="Giá trị"
                    :rules="{ required:  dealActionFlow.next_action_timetype || dealActionFlow.next_action_id ? true : false, min_value: 1, numeric: true }"
                    v-slot="validationContext"
                  >
                    <b-form-input
                      :class="{ 'is-invalid': serverErrors && serverErrors['next_action_time'] }"
                      :name="'deal_action_flow-next_action_time'"
                      :state="getValidationState(validationContext)"
                      @keyup="resetAttributeError('next_action_time', serverErrors)"
                      v-model.number="dealActionFlow.next_action_time"
                    ></b-form-input>
                    <b-form-invalid-feedback
                      v-if="serverErrors && serverErrors['next_action_time']"
                      id="deal_action_flow-next_action_time-group-feedback"
                    >{{ serverErrors['next_action_time'][0] }}</b-form-invalid-feedback>
                    <b-form-invalid-feedback
                      v-else
                      id="deal_action_flow-next_action_time-group-feedback"
                    >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                  </validation-provider>
                </div>
                <div class="col-md-6">
                  <validation-provider
                    name="Loại"
                    :rules="{ required:  dealActionFlow.next_action_time || dealActionFlow.next_action_id ? true : false }"
                    v-slot="validationContext"
                  >
                    <multiselect
                      :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors['next_action_timetype']) }"
                      :name="'deal_action_flow-next_action_timetype'"
                      :options="dealActionFlowTimeType"
                      deselectLabel="Ấn enter để bỏ chọn"
                      label="name"
                      placeholder="--Lựa chọn--"
                      selectedLabel
                      selectLabel="Ấn enter để chọn"
                      trackBy="id"
                      v-model="dealActionFlow.next_action_timetype"
                      :showLabels="false"
                      @input="resetAttributeError('next_action_timetype', serverErrors)"
                    ></multiselect>
                    <b-form-invalid-feedback
                      v-if="serverErrors && serverErrors['next_action_timetype']"
                      id="deal_action_flow-next_action_timetype-group-feedback"
                    >{{ serverErrors['next_action_timetype'][0] }}</b-form-invalid-feedback>
                    <b-form-invalid-feedback
                      v-else
                      id="deal_action_flow-next_action_timetype-group-feedback"
                    >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                  </validation-provider>
                </div>
              </div>
            </b-form-group>

            <validation-provider
              name="Trạng thái xử lý"
              :rules="{ required: true }"
              v-slot="validationContext"
            >
              <b-form-group
                id="deal_action_flow-stage_id-group"
                label="Trạng thái xử lý"
                label-for="deal_action_flow-stage_id"
                label-class="required"
              >
                <multiselect
                  :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors['stage_id']) }"
                  :name="'deal_action_flow-stage_id'"
                  :options="dealStages"
                  deselectLabel="Ấn enter để bỏ chọn"
                  label="name"
                  placeholder="--Lựa chọn--"
                  selectedLabel
                  selectLabel="Ấn enter để chọn"
                  trackBy="id"
                  v-model="dealActionFlow.stage_id"
                  :showLabels="false"
                  @input="resetAttributeError('stage_id', serverErrors)"
                ></multiselect>
                <b-form-invalid-feedback
                  v-if="serverErrors && serverErrors['stage_id']"
                  id="deal_action_flow-stage_id-group-feedback"
                >{{ serverErrors['stage_id'][0] }}</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else
                  id="deal_action_flow-stage_id-group-feedback"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
            <validation-provider
              name="Loại lead"
              :rules="{ required: true }"
              v-slot="validationContext"
            >
              <b-form-group
                id="deal_action_flow-lead_type_id-group"
                label="Loại lead"
                label-for="deal_action_flow-lead_type_id"
                label-class="required"
              >
                <multiselect
                  :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors['lead_type_id']) }"
                  :name="'deal_action_flow-lead_type_id'"
                  :options="dealLeadTypes"
                  deselectLabel="Ấn enter để bỏ chọn"
                  label="name"
                  placeholder="--Lựa chọn--"
                  selectedLabel
                  selectLabel="Ấn enter để chọn"
                  trackBy="id"
                  v-model="dealActionFlow.lead_type_id"
                  :showLabels="false"
                  @input="resetAttributeError('lead_type_id', serverErrors)"
                ></multiselect>
                <b-form-invalid-feedback
                  v-if="serverErrors && serverErrors['lead_type_id']"
                  id="deal_action_flow-lead_type_id-group-feedback"
                >{{ serverErrors['lead_type_id'][0] }}</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else
                  id="deal_action_flow-lead_type_id-group-feedback"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
            <validation-provider name="Trạng thái đơn hàng" v-slot="validationContext">
              <b-form-group
                id="deal_action_flow-status_code-group"
                label="Trạng thái đơn hàng"
                label-for="deal_action_flow-status_code"
              >
                <multiselect
                  :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors['status_code']) }"
                  :name="'deal_action_flow-status_code'"
                  :options="dealStatus"
                  deselectLabel="Ấn enter để bỏ chọn"
                  label="name"
                  placeholder="--Lựa chọn--"
                  selectedLabel
                  selectLabel="Ấn enter để chọn"
                  trackBy="id"
                  v-model="dealActionFlow.status_code"
                  :showLabels="false"
                  @input="resetAttributeError('status_code', serverErrors)"
                ></multiselect>
                <b-form-invalid-feedback
                  v-if="serverErrors && serverErrors['status_code']"
                  id="deal_action_flow-status_code-group-feedback"
                >{{ serverErrors['status_code'][0] }}</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else
                  id="deal_action_flow-status_code-group-feedback"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
          </b-form>
        </validation-observer>
      </b-overlay>
    </b-modal>
  </div>
</template>