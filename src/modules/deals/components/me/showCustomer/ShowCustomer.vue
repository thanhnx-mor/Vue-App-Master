<style src="./ShowCustomer.scss" lang="scss" scoped></style>
<script src="./ShowCustomer.ts" lang="ts"></script>

<template>
  <div>
    <b-row>
      <template v-for="(attribute, index) in customer.attributes">
        <div class="col-sm-6 pt-2 pb-2" :key="index" v-if="attribute.is_enabled">
          <div class="form-group m-form__group nt-attribute-item" style="margin: 0px;">
            <label for="customer_group" class="form-control-label font-weight-bold">
              <span :class="{ 'required': attribute.is_required }">
                {{ attribute.name }}
                <i v-if="attribute.slug === 'ma_kh'" class="fas fa-lock ml-1"></i>
              </span>
            </label>
            <div
              :class="[
                inputType['Textarea/ Đoạn văn bản'] === attribute.attribute_input_type_id ? 'nt-show-textarea' : ''
              ]"
            >
              <span class="not-value" v-if="!attribute.attribute_values.length">Chưa cập nhật</span>
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
            </div>
          </div>
        </div>
      </template>
    </b-row>
  </div>
</template>