<style src="./CreateActionHistory.scss" lang="scss" scoped></style>
<script src="./CreateActionHistory.ts" lang="ts"></script>

<template>
  <div v-if="actionInfo">
    <validation-provider name="Hành động" :rules="{ required: true }" v-slot="validationContext">
      <b-form-group
        id="deal_action_info-action_id-group"
        label="Hành động"
        label-for="deal_action_info-action_id"
        label-class="required"
      >
        <multiselect
          :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors['action_id']) }"
          :name="'deal_action_info-action_id'"
          :options="dealActions"
          deselectLabel="Ấn enter để bỏ chọn"
          label="name"
          placeholder="--Lựa chọn--"
          selectedLabel
          selectLabel="Ấn enter để chọn"
          trackBy="id"
          v-model="actionInfo.action_id"
          :showLabels="false"
          @input="setDataDealAction(actionInfo, 'action_id')"
        ></multiselect>
        <b-form-invalid-feedback
          v-if="serverErrors && serverErrors['action_id']"
          id="deal_action_info-action_id-group-feedback"
        >{{ serverErrors['action_id'][0] }}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else
          id="deal_action_info-action_id-group-feedback"
        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>

    <validation-provider
      name="Kết quả xử lý"
      :rules="{ required: true }"
      v-slot="validationContext"
    >
      <b-form-group
        id="deal_action_info-action_result_id-group"
        label="Kết quả xử lý"
        label-for="deal_action_info-action_result_id"
        label-class="required"
      >
        <multiselect
          :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors['action_result_id']) }"
          :name="'deal_action_info-action_result_id'"
          :options="dealActionResults"
          deselectLabel="Ấn enter để bỏ chọn"
          label="name"
          placeholder="--Lựa chọn--"
          selectedLabel
          selectLabel="Ấn enter để chọn"
          trackBy="id"
          v-model="actionInfo.action_result_id"
          :showLabels="false"
          @input="setDataDealAction(actionInfo, 'action_result_id')"
        ></multiselect>
        <b-form-invalid-feedback
          v-if="serverErrors && serverErrors['action_result_id']"
          id="deal_action_info-action_result_id-group-feedback"
        >{{ serverErrors['action_id'][0] }}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else
          id="deal_action_info-action_result_id-group-feedback"
        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>

    <validation-provider
      name="Hành động tiếp theo"
      :rules="{ required:  actionInfo.next_action_time || actionInfo.next_action_timetype ? true : false }"
      v-slot="validationContext"
    >
      <b-form-group
        id="deal_action_info-next_action_id-group"
        label="Hành động tiếp theo"
        label-for="deal_action_info-next_action_id"
      >
        <multiselect
          :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors['next_action_id']) }"
          :name="'deal_action_info-next_action_id'"
          :options="dealActions"
          deselectLabel="Ấn enter để bỏ chọn"
          label="name"
          placeholder="--Lựa chọn--"
          selectedLabel
          selectLabel="Ấn enter để chọn"
          trackBy="id"
          v-model="actionInfo.next_action_id"
          :showLabels="false"
          @input="resetAttributeError('next_action_id', serverErrors)"
        ></multiselect>
        <b-form-invalid-feedback
          v-if="serverErrors && serverErrors['next_action_id']"
          id="deal_action_info-next_action_id-group-feedback"
        >{{ serverErrors['next_action_id'][0] }}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else
          id="deal_action_info-next_action_id-group-feedback"
        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>

    <b-form-group
      id="deal_action_info-next_action_time-group"
      label="Thời gian diễn ra động tiếp theo"
      label-for="deal_action_info-next_action_time"
    >
      <div class="row">
        <div class="col-md-6">
          <validation-provider
            name="Giá trị"
            :rules="{ required:  actionInfo.next_action_timetype || actionInfo.next_action_id ? true : false, min_value: 1, numeric: true }"
            v-slot="validationContext"
          >
            <b-form-input
              :class="{ 'is-invalid': serverErrors && serverErrors['next_action_time'] }"
              :name="'deal_action_info-next_action_time'"
              :state="getValidationState(validationContext)"
              @keyup="resetAttributeError('next_action_time', serverErrors)"
              v-model.number="actionInfo.next_action_time"
            ></b-form-input>
            <b-form-invalid-feedback
              v-if="serverErrors && serverErrors['next_action_time']"
              id="deal_action_info-next_action_time-group-feedback"
            >{{ serverErrors['next_action_time'][0] }}</b-form-invalid-feedback>
            <b-form-invalid-feedback
              v-else
              id="deal_action_info-next_action_time-group-feedback"
            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
          </validation-provider>
        </div>
        <div class="col-md-6">
          <validation-provider
            name="Loại"
            :rules="{ required:  actionInfo.next_action_time || actionInfo.next_action_id ? true : false }"
            v-slot="validationContext"
          >
            <multiselect
              :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors['next_action_timetype']) }"
              :name="'deal_action_info-next_action_timetype'"
              :options="dealActionInfoTimeType"
              deselectLabel="Ấn enter để bỏ chọn"
              label="name"
              placeholder="--Lựa chọn--"
              selectedLabel
              selectLabel="Ấn enter để chọn"
              trackBy="id"
              v-model="actionInfo.next_action_timetype"
              :showLabels="false"
              @input="resetAttributeError('next_action_timetype', serverErrors)"
            ></multiselect>
            <b-form-invalid-feedback
              v-if="serverErrors && serverErrors['next_action_timetype']"
              id="deal_action_info-next_action_timetype-group-feedback"
            >{{ serverErrors['next_action_timetype'][0] }}</b-form-invalid-feedback>
            <b-form-invalid-feedback
              v-else
              id="deal_action_info-next_action_timetype-group-feedback"
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
        id="deal_action_info-stage_id-group"
        label="Trạng thái xử lý"
        label-for="deal_action_info-stage_id"
        label-class="required"
      >
        <multiselect
          :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors['stage_id']) }"
          :name="'deal_action_info-stage_id'"
          :options="dealStages"
          deselectLabel="Ấn enter để bỏ chọn"
          label="name"
          placeholder="--Lựa chọn--"
          selectedLabel
          selectLabel="Ấn enter để chọn"
          trackBy="id"
          v-model="actionInfo.stage_id"
          :showLabels="false"
          @input="resetAttributeError('stage_id', serverErrors)"
        ></multiselect>
        <b-form-invalid-feedback
          v-if="serverErrors && serverErrors['stage_id']"
          id="deal_action_info-stage_id-group-feedback"
        >{{ serverErrors['stage_id'][0] }}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else
          id="deal_action_info-stage_id-group-feedback"
        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>
    <validation-provider name="Loại lead" :rules="{ required: true }" v-slot="validationContext">
      <b-form-group
        id="deal_action_info-lead_type_id-group"
        label="Loại lead"
        label-for="deal_action_info-lead_type_id"
        label-class="required"
      >
        <multiselect
          :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors['lead_type_id']) }"
          :name="'deal_action_info-lead_type_id'"
          :options="dealLeadTypes"
          deselectLabel="Ấn enter để bỏ chọn"
          label="name"
          placeholder="--Lựa chọn--"
          selectedLabel
          selectLabel="Ấn enter để chọn"
          trackBy="id"
          v-model="actionInfo.lead_type_id"
          :showLabels="false"
          @input="resetAttributeError('lead_type_id', serverErrors)"
        ></multiselect>
        <b-form-invalid-feedback
          v-if="serverErrors && serverErrors['lead_type_id']"
          id="deal_action_info-lead_type_id-group-feedback"
        >{{ serverErrors['lead_type_id'][0] }}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else
          id="deal_action_info-lead_type_id-group-feedback"
        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>

    <div class="form-group">
      <validation-provider
        :rules="{ required: true, max: 1025 }"
        v-slot="validationContext"
        :key="'deal_action_info_note'"
        :name="'Ghi chú'"
      >
        <label for="note" class="form-control-label font-weight-bold">
          <span class="required">Ghi chú</span>
        </label>
        <b-form-textarea
          id="deal_action_info_note"
          name="deal_action_info_note"
          :state="getValidationState(validationContext)"
          :aria-describedby="'deal_action_info_note'"
          max-rows="6"
          rows="3"
          v-model="actionInfo.note"
        ></b-form-textarea>
        <b-form-invalid-feedback id="deal_action_info_note">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
      </validation-provider>
    </div>
  </div>
</template>