<style src="./Create.scss" lang="scss" scoped></style>
<script src="./Create.ts" lang="ts"></script>

<template>
  <div>
    <template v-if="hasPermission([PERMISSION.CONTACT['*'], PERMISSION.CONTACT.STORE])">
      <b-button v-b-modal.contactCreateModal class="nt_btn nt_btn-warning nt-button-top">
        <i class="fas fa-plus"></i>
        Thêm liên hệ
      </b-button>
    </template>
    <template v-else>
      <b-button
        variant="warning"
        class="permission-btn-disabled nt_btn nt_btn-warning nt-button-top"
        v-b-tooltip.hover
        :title="messageNotPermission"
      >
        <i class="fas fa-plus"></i>
        Thêm liên hệ
      </b-button>
    </template>

    <b-modal
      id="contactCreateModal"
      scrollable
      no-close-on-backdrop
      no-close-on-esc
      header-close-content="<i class='fas fa-times'></i>"
      modal-class="modal-footer-custom"
      title="Thêm liên hệ"
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
            <template v-for="(attribute, index) in attributes">
              <validation-provider
                :key="index"
                :name="attribute.name"
                :rules="getRules(attribute)"
                v-slot="validationContext"
              >
                <b-form-group
                  :id="attribute.slug + 'group'"
                  :label="attribute.name"
                  :label-for="attribute.slug"
                  :label-class="{ 'required': attribute.is_required }"
                >
                  <template v-if="isSimpleType(attribute.attribute_input_type_id)">
                    <b-form-input
                      :id="attribute.slug"
                      :name="attribute.slug"
                      v-model="attribute[attribute.slug]"
                      :state="getValidationState(validationContext)"
                      :aria-describedby="attribute.slug + 'group'"
                      :class="{ 'is-invalid' : serverErrors && serverErrors[attribute.slug] }"
                      @keyup="resetAttributeError(attribute.slug, serverErrors)"
                      :autofocus="index == 0 ? true : false"
                    ></b-form-input>
                  </template>
                  <template
                    v-else-if="inputType['Date/ Ngày tháng năm'] === attribute.attribute_input_type_id"
                  >
                    <date-picker
                      :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors[attribute.slug]) }"
                      :editable="false"
                      class="w-100"
                      format="DD/MM/YYYY"
                      placeholder="Chọn ngày"
                      type="date"
                      v-model="attribute[attribute.slug]"
                      value-type="YYYY-MM-DD"
                    ></date-picker>
                  </template>
                  <template
                    v-else-if="inputType['Datetime/ Ngày giờ'] === attribute.attribute_input_type_id"
                  >
                    <date-picker
                      :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors[attribute.slug]) }"
                      :editable="false"
                      class="w-100"
                      format="DD/MM/YYYY HH:mm:ss"
                      placeholder="Chọn ngày"
                      type="datetime"
                      v-model="attribute[attribute.slug]"
                      value-type="YYYY-MM-DD HH:mm:ss"
                    ></date-picker>
                  </template>
                  <template
                    v-else-if="inputType['Select/ 1 lựa chọn'] === attribute.attribute_input_type_id"
                  >
                    <multiselect
                      :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors[attribute.slug]) }"
                      :name="attribute.name"
                      :options="getOptions(attribute)"
                      deselectLabel="Ấn enter để bỏ chọn"
                      label="name"
                      placeholder="--Lựa chọn--"
                      selectedLabel
                      selectLabel="Ấn enter để chọn"
                      trackBy="id"
                      v-model="attribute[attribute.slug]"
                      :showLabels="false"
                    ></multiselect>
                  </template>
                  <template
                    v-else-if="inputType['Select/ Nhiều lựa chọn'] === attribute.attribute_input_type_id"
                  >
                    <multiselect
                      :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors[attribute.slug]) }"
                      :closeOnSelect="true"
                      :multiple="true"
                      :name="attribute.name"
                      :options="getOptions(attribute)"
                      deselectLabel="Ấn enter để bỏ chọn"
                      label="name"
                      placeholder="--Lựa chọn--"
                      selectedLabel
                      selectLabel="Ấn enter để chọn"
                      trackBy="id"
                      v-model="attribute[attribute.slug]"
                      :showLabels="false"
                    ></multiselect>
                  </template>
                  <template
                    v-else-if="inputType['Textarea/ Đoạn văn bản'] === attribute.attribute_input_type_id"
                  >
                    <b-form-textarea
                      :class="{ 'is-invalid': serverErrors && serverErrors[attribute.slug] }"
                      :name="attribute.name"
                      :state="getValidationState(validationContext)"
                      @keyup="resetAttributeError(attribute.slug, serverErrors)"
                      max-rows="6"
                      rows="3"
                      v-model="attribute[attribute.slug]"
                    ></b-form-textarea>
                  </template>
                  <template
                    v-else-if="inputType['Checkbox/ Nhiều lựa chọn'] === attribute.attribute_input_type_id"
                  >
                    <b-form-checkbox-group
                      :class="{ 'is-invalid': serverErrors && serverErrors[attribute.slug] }"
                      :name="attribute.name"
                      :options="getOptions(attribute)"
                      :state="getValidationState(validationContext)"
                      @keyup="resetAttributeError(attribute.slug, serverErrors)"
                      class="mb-3"
                      text-field="name"
                      v-model="attribute[attribute.slug]"
                      value-field="id"
                      stacked
                    >
                      <b-form-invalid-feedback
                        :state="getValidationState(validationContext)"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-checkbox-group>
                  </template>
                  <template
                    v-else-if="inputType['Radio/ 1 lựa chọn'] === attribute.attribute_input_type_id"
                  >
                    <b-form-radio-group
                      :class="{ 'is-invalid': serverErrors && serverErrors[attribute.slug] }"
                      :name="attribute.name"
                      :options="getOptions(attribute)"
                      :state="getValidationState(validationContext)"
                      @keyup="resetAttributeError(attribute.slug, serverErrors)"
                      class="mb-3"
                      text-field="name"
                      v-model="attribute[attribute.slug]"
                      value-field="id"
                      stacked
                    >
                      <b-form-invalid-feedback
                        :state="getValidationState(validationContext)"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-radio-group>
                  </template>
                  <template
                    v-else-if="inputType['User/ 1 người dùng'] === attribute.attribute_input_type_id"
                  >
                    <multiselect
                      :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors[attribute.slug]) }"
                      :name="attribute.name"
                      :options="getOptions(attribute)"
                      deselectLabel="Ấn enter để bỏ chọn"
                      label="name"
                      placeholder="--Lựa chọn--"
                      selectedLabel
                      selectLabel="Ấn enter để chọn"
                      trackBy="id"
                      v-model="attribute[attribute.slug]"
                      :showLabels="false"
                    ></multiselect>
                  </template>
                  <template
                    v-else-if="inputType['Users/ Nhiều người dùng'] === attribute.attribute_input_type_id"
                  >
                    <multiselect
                      :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors[attribute.slug]) }"
                      :closeOnSelect="true"
                      :multiple="true"
                      :name="attribute.name"
                      :options="getOptions(attribute)"
                      deselectLabel="Ấn enter để bỏ chọn"
                      label="name"
                      placeholder="--Lựa chọn--"
                      selectedLabel
                      selectLabel="Ấn enter để chọn"
                      trackBy="id"
                      v-model="attribute[attribute.slug]"
                      :showLabels="false"
                    ></multiselect>
                  </template>

                  <b-form-invalid-feedback
                    v-if="serverErrors && serverErrors[attribute.slug]"
                    :id="attribute.slug + 'group'"
                  >{{ serverErrors[attribute.slug][0] }}</b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else
                    :id="attribute.slug + 'group'"
                  >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </template>
          </b-form>
        </validation-observer>
      </b-overlay>
    </b-modal>
  </div>
</template>
