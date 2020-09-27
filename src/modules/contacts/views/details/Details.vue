<style src="./Details.scss" lang="scss" scoped></style>
<script src="./Details.ts" lang="ts"></script>

<template>
  <div>
    <div class="body-upper">
      <b-breadcrumb :items="breadcrumbItems"></b-breadcrumb>
      <div class="actions">
        <template v-if="hasPermission([PERMISSION.CONTACT['*'], PERMISSION.CONTACT.DESTROY])">
          <b-button
            class="nt_btn nt_btn-danger nt-button-top"
            :disabled="isLoading"
            @click="onDelete"
          >
            <i class="far fa-trash-alt mr-2"></i>
            Xóa liên hệ
          </b-button>
        </template>
        <template v-else>
          <b-button
            class="nt_btn nt_btn-danger nt-button-top permission-btn-disabled"
            v-b-tooltip.hover
            :title="messageNotPermission"
          >
            <i class="far fa-trash-alt mr-2"></i>
            Xóa liên hệ
          </b-button>
        </template>
        <Delete ref="deleteModal" @onDeleted="onDeleted" />
      </div>
    </div>
    <div class="body-content">
      <b-overlay :show="isLoading" rounded opacity="0.6" spinner-small spinner-variant="primary">
        <!-- v-slot="{ passes }" -->
        <validation-observer ref="validationObserver" class="w-100">
          <b-form @submit.stop.prevent="onSubmit" autocomplete="true">
            <b-row>
              <template v-for="(attribute, index) in contact.attributes">
                <div class="col-sm-6 pt-2 pb-2" :key="index" v-if="attribute.is_enabled">
                  <div
                    class="form-group m-form__group nt-attribute-item"
                    style="margin: 0px;"
                    :class="[
                    attribute.slug === 'ma_lh' ? 'nt-attribute-item-disabled' : '',
                    !hasPermission([PERMISSION.CONTACT['*'], PERMISSION.CONTACT.UPDATE])? 'nt-attribute-item-disabled' : ''
                    ]"
                  >
                    <label for="contact_group" class="form-control-label font-weight-bold">
                      <span :class="{ 'required': attribute.is_required }">
                        {{ attribute.name }}
                        <i
                          v-if="attribute.slug === 'ma_lh'"
                          class="fas fa-lock ml-1"
                        ></i>
                      </span>
                    </label>

                    <div
                      class="form-control nt-form-control-sm pl-0 pr-0 nt-border-none"
                      @click="isEdit = true"
                      v-if="!isEdit"
                    >
                      <div
                        class="item"
                        :class="[
                          inputType['Textarea/ Đoạn văn bản'] === attribute.attribute_input_type_id ? 'nt-show-textarea' : ''
                        ]"
                      >
                        <span
                          class="not-value"
                          v-if="!attribute.attribute_values.length"
                        >Chưa cập nhật</span>
                        <span v-for="(item, indexA) in attribute.attribute_values" :key="indexA">
                          <template v-if="item.value">
                            <template v-if="isMultiple(attribute.attribute_input_type_id)">
                              <div
                                class="nt-badge-dropdown mr-2 mb-2"
                              >{{ getValueByType(attribute, item.value) }}</div>
                            </template>
                            <template v-else>{{ getValueByType(attribute, item.value) }}</template>
                          </template>
                          <span class="not-value" v-else>Chưa cập nhật</span>
                        </span>
                        <span class="input-icon">
                          <i class="fas fa-pencil-alt cursor-pointer" @click="isEdit = true"></i>
                        </span>
                      </div>
                    </div>
                    <Edit :serverErrors="serverErrors" :attribute="attribute" v-else />
                  </div>
                </div>
              </template>
            </b-row>
            <div class="portlet__foot float-footer py-3" v-if="isEdit">
              <b-button
                type="button"
                class="mr-2 nt_btn nt_btn-outline-primary"
                @click="onCancel"
              >Hủy bỏ</b-button>
              <vue-ladda
                class="nt_btn nt_btn-warning"
                :loading="isLoadingUpdate"
                type="submit"
              >Cập nhật</vue-ladda>
            </div>
          </b-form>
        </validation-observer>
      </b-overlay>
    </div>
  </div>
</template>