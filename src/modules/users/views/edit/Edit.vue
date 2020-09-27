<style src="./Edit.scss" lang="scss" scoped></style>
<script src="./Edit.ts" lang="ts"></script>

<template>
  <div>
    <b-modal
      id="userUpdateModal"
      scrollable
      no-close-on-backdrop
      no-close-on-esc
      header-close-content="<i class='fas fa-times'></i>"
      modal-class="modal-footer-custom"
      title="Cập nhật thành viên"
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
              name="Tên thành viên"
              :rules="{ required: true, max: 250 }"
              v-slot="validationContext"
            >
              <b-form-group
                id="name-group"
                label="Tên thành viên"
                label-for="name"
                label-class="required"
              >
                <b-form-input
                  id="name"
                  name="name"
                  v-model="user.name"
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

            <validation-provider
              name="Email"
              :rules="{ required: true, email: true, max: 250}"
              v-slot="validationContext"
            >
              <b-form-group id="email-group" label="Email" label-for="email" label-class="required">
                <b-form-input
                  id="email"
                  name="email"
                  v-model="user.email"
                  :state="getValidationState(validationContext)"
                  aria-describedby="email-group-feedback"
                  :class="{'is-invalid' : serverErrors && serverErrors['email']}"
                  @keyup="resetAttributeError('email', serverErrors)"
                ></b-form-input>
                <b-form-invalid-feedback
                  v-if="serverErrors && serverErrors['email']"
                  id="email-group-feedback"
                >{{ serverErrors['email'][0] }}</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else
                  id="email-group-feedback"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <validation-provider
              name="Mật khẩu"
              :rules="{ max: 32, min: 6 }"
              v-slot="validationContext"
            >
              <b-form-group id="password-group" label="Mật khẩu" label-for="password">
                <b-form-input
                  id="password"
                  name="password"
                  v-model="user.password"
                  :state="getValidationState(validationContext)"
                  aria-describedby="password-group-feedback"
                  type="password"
                  :class="{'is-invalid' : serverErrors && serverErrors['password']}"
                  @keyup="resetAttributeError('password', serverErrors)"
                ></b-form-input>

                <b-form-invalid-feedback
                  v-if="serverErrors && serverErrors['password']"
                  id="password-group-feedback"
                >{{ serverErrors['password'][0] }}</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else
                  id="password-group-feedback"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <validation-provider
              name="Trạng thái"
              :rules="{ required: true }"
              v-slot="validationContext"
              v-if="!isSuperAdmin(user.id)"
            >
              <b-form-group
                id="status_code-group"
                label="Trạng thái"
                label-for="status_code"
                label-class="required"
              >
                <b-form-select
                  id="status_code"
                  name="status_code"
                  :state="getValidationState(validationContext)"
                  aria-describedby="status_code-group-feedback"
                  v-model="user.status_code"
                  :options="customStatusCodes"
                  @change="resetAttributeError('status_code', serverErrors)"
                >
                  <template v-slot:first>
                    <b-form-select-option :value="null" disabled>-- Lựa chọn --</b-form-select-option>
                  </template>
                </b-form-select>

                <b-form-invalid-feedback
                  v-if="serverErrors && serverErrors['status_code']"
                  id="status_code-group-feedback"
                >{{ serverErrors['status_code'][0] }}</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else
                  id="status_code-group-feedback"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
            <b-form-group id="roles-group" label="Danh sách vai trò" label-for="roles">
              <b-form-checkbox-group stacked id="roles" name="roles" v-model="user.roles">
                <template v-if="allRoles.length > 0">
                  <template v-for="(role, index) in allRoles">
                    <b-form-checkbox
                      :key="index"
                      :value="role.id"
                      class="mb-2 mt-2"
                    >{{ role.display_name }}</b-form-checkbox>
                  </template>
                </template>
              </b-form-checkbox-group>
            </b-form-group>
          </b-form>
        </validation-observer>
      </b-overlay>
    </b-modal>
  </div>
</template>