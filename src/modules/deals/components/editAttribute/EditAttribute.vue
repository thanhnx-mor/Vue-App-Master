<style src="./EditAttribute.scss" lang="scss" scoped></style>
<script src="./EditAttribute.ts" lang="ts"></script>

<template>
  <div>
    <validation-provider
      :key="attribute.id"
      :name="attribute.name"
      :rules="getRules(attribute)"
      v-slot="validationContext"
    >
      <label :for="attribute.slug + 'group'" class="form-control-label font-weight-bold">
        <span :class="{ 'required': attribute.is_required }">{{ attribute.name }}</span>
      </label>
      <b-form-group :id="attribute.slug + 'group'">
        <template v-if="isSimpleType">
          <b-form-input
            :class="[serverErrors && serverErrors[attribute.slug] ? 'is-invalid': '', attribute.is_disabled ? 'nt-disabled-input' : ''  ]"
            :name="attribute.name"
            :state="getValidationState(validationContext)"
            @keyup="resetAttributeError(attribute.slug, serverErrors)"
            v-model="attribute[attribute.slug]"
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
        <template v-else-if="inputType['Datetime/ Ngày giờ'] === attribute.attribute_input_type_id">
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
        <template v-else-if="inputType['Select/ 1 lựa chọn'] === attribute.attribute_input_type_id">
          <multiselect
            :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors[attribute.slug]) }"
            :name="attribute.name"
            :options="options"
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
            :options="options"
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
            :options="options"
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
        <template v-else-if="inputType['Radio/ 1 lựa chọn'] === attribute.attribute_input_type_id">
          <b-form-radio-group
            :class="{ 'is-invalid': serverErrors && serverErrors[attribute.slug] }"
            :name="attribute.name"
            :options="options"
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
        <template v-else-if="inputType['User/ 1 người dùng'] === attribute.attribute_input_type_id">
          <multiselect
            :class="{ 'is-invalid': validationContext.errors[0] || (serverErrors && serverErrors[attribute.slug]) }"
            :name="attribute.name"
            :options="options"
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
            :options="options"
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
  </div>
</template>