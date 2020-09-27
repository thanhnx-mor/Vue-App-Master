<style src="./Create.scss" lang="scss" scoped></style>
<script src="./Create.ts" lang="ts"></script>

<template>
  <div>
    <template v-if="hasPermission([PERMISSION.ROLE['*'], PERMISSION.ROLE.STORE])">
      <b-button
        v-b-modal.roleCreateModal
        variant="primary"
        class="nt_btn nt_btn-warning nt-button-top"
      >
        <i class="fas fa-plus"></i> Thêm vai trò
      </b-button>
    </template>
    <template v-else>
      <b-button
        variant="primary"
        class="permission-btn-disabled nt_btn nt_btn-warning nt-button-top"
        v-b-tooltip.hover
        :title="messageNotPermission"
      >
        <i class="fas fa-plus"></i> Thêm vai trò
      </b-button>
    </template>

    <b-modal
      id="roleCreateModal"
      scrollable
      no-close-on-backdrop
      no-close-on-esc
      header-close-content="<i class='fas fa-times'></i>"
      modal-class="modal-footer-custom"
      title="Thêm vai trò"
      ok-title="Lưu lại"
      cancel-title="Hủy bỏ"
      @ok="onSubmit"
      @cancel="onCancel"
      @close="onCancel"
      :ok-disabled="isLoading"
    >
      <b-overlay :show="isLoading" rounded opacity="0.6" spinner-small spinner-variant="primary">
        <validation-observer ref="validationObserver" v-slot="{ passes }" class="w-100">
          <b-form @submit.stop.prevent="passes(onSubmit)" autocomplete="true" scrollable>
            <validation-provider
              name="Tên vai trò"
              :rules="{ required: true, max: 250 }"
              v-slot="validationContext"
            >
              <b-form-group
                id="display_name-group"
                label="Tên vai trò"
                label-for="display_name"
                label-class="required"
              >
                <b-form-input
                  id="display_name"
                  name="display_name"
                  v-model="role.display_name"
                  :state="getValidationState(validationContext)"
                  aria-describedby="display_name-group-feedback"
                  :class="{'is-invalid' : serverErrors && serverErrors['display_name']}"
                  @keyup="resetAttributeError('display_name', serverErrors)"
                  autofocus
                ></b-form-input>
                <b-form-invalid-feedback
                  v-if="serverErrors && serverErrors['display_name']"
                  id="display_name-group-feedback"
                >{{ serverErrors['display_name'][0] }}</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else
                  id="display_name-group-feedback"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <validation-provider
              name="Mô tả vai trò"
              :rules="{ max: 250 }"
              v-slot="validationContext"
            >
              <b-form-group id="description-group" label="Mô tả vai trò" label-for="description">
                <b-form-input
                  id="description"
                  name="description"
                  v-model="role.description"
                  :state="getValidationState(validationContext)"
                  aria-describedby="description-group-feedback"
                  :class="{'is-invalid' : serverErrors && serverErrors['description']}"
                  @keyup="resetAttributeError('description', serverErrors)"
                ></b-form-input>
                <b-form-invalid-feedback
                  v-if="serverErrors && serverErrors['description']"
                  id="description-group-feedback"
                >{{ serverErrors['description'][0] }}</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else
                  id="description-group-feedback"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <b-form-group id="permissions-group" label="Danh sách quyền" label-for="permissions">
              <b-form-checkbox-group
                stacked
                id="permissions"
                name="permissions"
                v-model="role.permissions"
              >
                <template v-if="allPermissions.length > 0">
                  <template v-for="(permission, index) in allPermissions">
                    <template v-if="!permission.name.includes('.')">
                      <b-form-checkbox :key="index" :value="permission.id" class="mb-3 mt-4">
                        <b class="mb-2 mt-2">{{ permission.display_name }}</b>
                      </b-form-checkbox>
                    </template>
                    <template v-if="permission.name.includes('.')">
                      <b-form-checkbox
                        :key="index"
                        :value="permission.id"
                        class="mb-2"
                      >{{ permission.display_name }}</b-form-checkbox>
                    </template>
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