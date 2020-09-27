<style src="./Create.scss" lang="scss" scoped></style>
<script src="./Create.ts" lang="ts"></script>

<template>
  <div>
    <template v-if="hasPermission([PERMISSION.SALE_MANAGEMENT['*'], PERMISSION.SALE_MANAGEMENT.STORE])">
      <b-button
        v-b-modal.saleCreateModal
        variant="primary"
        class="nt_btn nt_btn-warning nt-button-top"
      >
        <i class="fas fa-plus"></i> Thêm nhân viên bán hàng
      </b-button>
    </template>
    <template v-else>
      <b-button
        variant="primary"
        class="nt_btn nt_btn-warning nt-button-top permission-btn-disabled"
        v-b-tooltip.hover
        :title="messageNotPermission"
      >
        <i class="fas fa-plus"></i> Thêm nhân viên bán hàng
      </b-button>
    </template>

    <b-modal
      id="saleCreateModal"
      no-close-on-backdrop
      no-close-on-esc
      header-close-content="<i class='fas fa-times'></i>"
      modal-class="modal-footer-custom"
      title="Thêm nhân viên bán hàng"
      ok-title="Lưu lại"
      cancel-title="Hủy bỏ"
      @ok="onSubmit"
      @cancel="onCancel"
      @close="onCancel"
      :ok-disabled="isLoading"
    >
      <b-overlay :show="isLoading" rounded opacity="0.6" spinner-small spinner-variant="primary">
        <validation-observer ref="validationObserver" v-slot="{ passes }" class="w-100">
          <b-form @submit.stop.prevent="passes(onSubmit)" autocomplete="true">
            <validation-provider
              name="Nhân viên bán hàng"
              :rules="{ required: true }"
              v-slot="validationContext"
            >
              <b-form-group
                id="user_id-group"
                label="Nhân viên bán hàng"
                label-for="user_id"
                label-class="required"
              >
                <multiselect
                  :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors['user_id']) }"
                  :name="'user_id'"
                  :options="users"
                  deselectLabel="Ấn enter để bỏ chọn"
                  label="name"
                  placeholder="--Lựa chọn--"
                  selectedLabel
                  selectLabel="Ấn enter để chọn"
                  trackBy="id"
                  v-model="sale.user_id"
                  :showLabels="false"
                ></multiselect>
                <b-form-invalid-feedback
                  v-if="serverErrors && serverErrors['user_id']"
                  id="user_id-group-feedback"
                >{{ serverErrors['user_id'][0] }}</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else
                  id="user_id-group-feedback"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
            <b-form-checkbox
              id="allowed_assign_lead"
              v-model="sale.allowed_assign_lead"
              name="allowed_assign_lead"
            >Cho phép nhận lead</b-form-checkbox>
          </b-form>
        </validation-observer>
      </b-overlay>
    </b-modal>
  </div>
</template>