<style src="./Create.scss" lang="scss" scoped></style>
<script src="./Create.ts" lang="ts"></script>

<template>
  <div>
    <b-modal
      id="attributeCreateModal"
      scrollable
      no-close-on-backdrop
      no-close-on-esc
      header-close-content="<i class='fas fa-times'></i>"
      modal-class="modal-footer-custom"
      title="Thêm trường dữ liệu"
      ok-title="Lưu lại"
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
              name="Tên trường dữ liệu"
              :rules="{ required: true, max: 250 }"
              v-slot="validationContext"
            >
              <b-form-group
                id="name-group"
                label="Tên trường dữ liệu"
                label-for="name"
                label-class="required"
              >
                <b-form-input
                  id="name"
                  name="name"
                  v-model="attribute.name"
                  :state="getValidationState(validationContext)"
                  aria-describedby="name-group-feedback"
                  :class="{'is-invalid' : serverErrors && serverErrors['name']}"
                  @keyup="resetAttributeError('name', serverErrors), resetAttributeError('slug', serverErrors), setAttributeSlug()"
                  @blur="setAttributeSlug()"
                  autofocus
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
            <b-form-group id="slug-group" label="Tên trường khi gán biến" label-for="slug">
              <b-form-input
                id="slug"
                name="slug"
                disabled
                v-model="attribute.slug"
                aria-describedby="slug-group-feedback"
                :class="{'is-invalid' : serverErrors && serverErrors['slug']}"
                @keyup="resetAttributeError('slug', serverErrors)"
              ></b-form-input>
              <b-form-invalid-feedback
                v-if="serverErrors && serverErrors['slug']"
                id="slug-group-feedback"
              >{{ serverErrors['slug'][0] }}</b-form-invalid-feedback>
            </b-form-group>
            <validation-provider
              name="Kiểu điền dữ liệu"
              :rules="{ customRequired: true }"
              v-slot="validationContext"
            >
              <b-form-group
                id="attribute_input_type_id-group"
                label="Kiểu điền dữ liệu"
                label-for="attribute_input_type_id"
                label-class="required"
              >
                <b-form-select
                  id="attribute_input_type_id"
                  name="attribute_input_type_id"
                  :state="getValidationState(validationContext)"
                  aria-describedby="attribute_input_type_id-group-feedback"
                  v-model.number="attribute.attribute_input_type_id"
                  :options="customAttributeInputTypes"
                  @change="changeAttributeInputType(); resetAttributeError('attribute_input_type_id', serverErrors)"
                >
                  <template v-slot:first>
                    <b-form-select-option :value="0" disabled>-- Lựa chọn --</b-form-select-option>
                  </template>
                </b-form-select>

                <b-form-invalid-feedback
                  v-if="serverErrors && serverErrors['attribute_input_type_id']"
                  id="attribute_input_type_id-group-feedback"
                >{{ serverErrors['attribute_input_type_id'][0] }}</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else
                  id="attribute_input_type_id-group-feedback"
                >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <b-form-group
              v-if="isEnabledAttributeOptions"
              id="attribute_options-group"
              label="Thêm giá trị cho lựa chọn"
              label-for="attribute_options-group"
            >
              <b-input-group class="mb-3" label="Thêm giá trị">
                <b-form-input
                  :class="{ 'is-invalid' : attributeOptionMessageError }"
                  aria-describedby="attribute_option-group-feedback"
                  name="option"
                  id="option"
                  v-model.trim="attributeOptionName"
                  @keyup="onAddAttributeOptionEnter($event)"
                ></b-form-input>
                <b-input-group-append>
                  <b-button
                    size="sm"
                    text="Button"
                    variant="primary"
                    @click.prevent="onAddAttributeOption()"
                  >Thêm</b-button>
                </b-input-group-append>
                <b-form-invalid-feedback
                  id="attribute_option-group-feedback"
                >{{ attributeOptionMessageError }}</b-form-invalid-feedback>
              </b-input-group>
              <template v-for="(option, index) in attribute.attribute_options">
                <b-badge :key="index" class="mr-2 option-item" href="#" variant="secondary">
                  {{ option.name }}
                  <a
                    class="option-item-close"
                    href="#"
                    @click.prevent="onDeleteAttributeOption(index)"
                  >x</a>
                </b-badge>
              </template>
            </b-form-group>

            <b-form-group
              id="is_required-group"
              label="Thuộc tính khác:"
              label-for="is_required-group"
            >
              <b-form-checkbox v-model="attribute.is_required">Bắt buộc</b-form-checkbox>
            </b-form-group>

            <b-form-group id="is_unique-group" label-for="is_unique-group">
              <b-form-checkbox
                v-model="attribute.is_unique"
                :disabled="isHideUnique"
              >Không cho trùng</b-form-checkbox>
            </b-form-group>

            <b-form-group id="is_enabled-group" label-for="is_enabled-group">
              <b-form-checkbox v-model="attribute.is_enabled">Hiển thị</b-form-checkbox>
            </b-form-group>
          </b-form>
        </validation-observer>
      </b-overlay>
    </b-modal>
  </div>
</template>