<style src="./Edit.scss" lang="scss" scoped></style>
<script src="./Edit.ts" lang="ts"></script>

<template>
  <div>
    <b-modal
      id="dealActionResultUpdateModal"
      scrollable
      no-close-on-backdrop
      no-close-on-esc
      header-close-content="<i class='fas fa-times'></i>"
      modal-class="modal-footer-custom"
      title="Cập nhật kết quả xử lý"
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
              name="Tên"
              :rules="{ required: true, max: 250 }"
              v-slot="validationContext"
            >
              <b-form-group id="name-group" label="Tên" label-for="name" label-class="required">
                <b-form-input
                  id="name"
                  name="name"
                  v-model="dealActionResult.name"
                  :state="getValidationState(validationContext)"
                  aria-describedby="name-group-feedback"
                  :class="{'is-invalid' : serverErrors && serverErrors['name']}"
                  @keyup="resetAttributeError('name', serverErrors)"
                ></b-form-input>
                <b-form-invalid-feedback
                  v-if="serverErrors && serverErrors['name']"
                  id="name-group-feedback"
                >{{ serverErrors['name'][0] }}</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else
                  id="name-group-feedback"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
          </b-form>
        </validation-observer>
      </b-overlay>
    </b-modal>
  </div>
</template>