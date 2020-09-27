<style src="./ShowAttribute.scss" lang="scss" scoped></style>
<script src="./ShowAttribute.ts" lang="ts"></script>

<template>
  <div>
    <label :for="attribute.slug + 'group'" class="form-control-label font-weight-bold">
      <span :class="{ 'required': attribute.is_required }">{{ attribute.name }}</span>
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
            <div class="nt-badge-dropdown mr-2 mb-2">{{ getValueByType(attribute, item.value) }}</div>
          </template>
          <template v-else>{{ getValueByType(attribute, item.value) }}</template>
        </template>
        <span class="not-value" v-else>Chưa cập nhật</span>
      </span>
    </div>
  </div>
</template>