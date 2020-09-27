<style src="./CreatePaymentHistory.scss" lang="scss" scoped></style>
<script src="./CreatePaymentHistory.ts" lang="ts"></script>

<template>
  <div v-if="dealPaymentInfo">
    <h4>Tổng tiền đã thanh toán: {{ filters.priceFormat(dealTotalAmountPaid) }}</h4>
    <h4
      class="mb-3"
    >Số tiền còn phải thanh toán: {{ filters.priceFormat(dealTotalPayment - dealTotalAmountPaid) }}</h4>
    <validation-provider
      name="Ngày thanh toán"
      :rules="{ required: true }"
      v-slot="validationContext"
    >
      <b-form-group
        id="deal_payment-datetime-group"
        label="Ngày thanh toán"
        label-for="deal_payment-datetime"
        label-class="required"
      >
        <date-picker
          :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors['payment_datetime']) }"
          :editable="false"
          class="w-100"
          format="DD/MM/YYYY HH:mm:ss"
          placeholder="Chọn ngày"
          type="datetime"
          v-model="dealPaymentInfo.payment_datetime"
          value-type="YYYY-MM-DD HH:mm:ss"
        ></date-picker>
        <b-form-invalid-feedback
          v-if="serverErrors && serverErrors['payment_datetime']"
          id="deal_payment-datetime-group-feedback"
        >{{ serverErrors['payment_datetime'][0] }}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else
          id="deal_payment-datetime-group-feedback"
        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>

    <validation-provider
      name="Số tiền thanh toán"
      :rules="{ required: true, regex: regexPayment(), max_value: (dealTotalPayment - dealTotalAmountPaid) }"
      v-slot="validationContext"
    >
      <b-form-group
        id="deal_payment-amount-group"
        label="Số tiền thanh toán"
        label-for="deal_payment-amount"
        label-class="required"
      >
        <b-form-input
          :class="{ 'is-invalid': serverErrors && serverErrors['payment_amount'] }"
          :name="'deal_payment-amount'"
          :state="getValidationState(validationContext)"
          @keyup="resetAttributeError('payment_amount', serverErrors)"
          v-model="dealPaymentInfo.payment_amount"
        ></b-form-input>
        <b-form-invalid-feedback
          v-if="serverErrors && serverErrors['payment_amount']"
          id="deal_payment-amount-group-feedback"
        >{{ serverErrors['payment_amount'][0] }}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else
          id="deal_payment-amount-group-feedback"
        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>

    <validation-provider name="Phương thức thanh toán" :rules="{  }" v-slot="validationContext">
      <b-form-group
        id="deal_payment-method-group"
        label="Phương thức thanh toán"
        label-for="deal_payment-method"
      >
        <multiselect
          :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors['payment_method']) }"
          :name="'deal_payment-method'"
          :options="dealPaymentMethod"
          deselectLabel="Ấn enter để bỏ chọn"
          label="name"
          placeholder="--Lựa chọn--"
          selectedLabel
          selectLabel="Ấn enter để chọn"
          trackBy="id"
          v-model="dealPaymentInfo.payment_method"
          :showLabels="false"
          @input="resetAttributeError('payment_method', serverErrors)"
        ></multiselect>
        <b-form-invalid-feedback
          v-if="serverErrors && serverErrors['payment_method']"
          id="deal_payment-method-group-feedback"
        >{{ serverErrors['payment_method'][0] }}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else
          id="deal_payment-method-group-feedback"
        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>

    <validation-provider name="Mã chứng từ" :rules="{ max:250 }" v-slot="validationContext">
      <b-form-group
        id="deal_payment-voucher-group"
        label="Mã chứng từ"
        label-for="deal_payment-voucher"
      >
        <b-form-input
          :class="{ 'is-invalid': serverErrors && serverErrors['voucher'] }"
          :name="'deal_payment-voucher'"
          :state="getValidationState(validationContext)"
          @keyup="resetAttributeError('voucher', serverErrors)"
          v-model="dealPaymentInfo.voucher"
        ></b-form-input>
        <b-form-invalid-feedback
          v-if="serverErrors && serverErrors['voucher']"
          id="deal_payment-voucher-group-feedback"
        >{{ serverErrors['voucher'][0] }}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else
          id="deal_payment-voucher-group-feedback"
        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>

    <validation-provider name="Ghi chú" :rules="{ max:1025 }" v-slot="validationContext">
      <b-form-group id="deal_payment-note-group" label="Ghi chú" label-for="deal_payment-note">
        <b-form-textarea
          :class="{ 'is-invalid': serverErrors && serverErrors['note'] }"
          :name="'deal_payment-note'"
          :state="getValidationState(validationContext)"
          @keyup="resetAttributeError('note', serverErrors)"
          max-rows="6"
          rows="3"
          v-model="dealPaymentInfo.note"
        ></b-form-textarea>
        <b-form-invalid-feedback
          v-if="serverErrors && serverErrors['note']"
          id="deal_payment-note-group-feedback"
        >{{ serverErrors['note'][0] }}</b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else
          id="deal_payment-note-group-feedback"
        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>
  </div>
</template>