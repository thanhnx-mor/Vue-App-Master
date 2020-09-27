<style src="./FilterAttributeOld.scss" lang="scss" scoped></style>
<script src="./FilterAttributeOld.ts" lang="ts"></script>

<template>
  <b-tr v-if="data">
    <!-- <FilterAttribute
                      v-if="data.field"
                      :data="data.field"
                      @onFilter="onFilter"
                      @onCancelFilter="onCancelFilter"
                      @getFilterErrors="getFilterErrors"
    />-->
    <template v-for="(item, index) in data.fields">
      <b-th :key="index" class="filter" :class="{'actions': item.key === 'actions'}">
        <span :class="{'sr-only': item.key === 'actions'}" v-if="item.key !== 'actions'">
          <template v-if="item.key === 'created_by'">
            <multiselect
              :closeOnSelect="true"
              :multiple="true"
              :name="item.key"
              :options="userOptions()"
              deselectLabel="Ấn enter để bỏ chọn"
              label="name"
              placeholder="Chọn nhiều"
              selectedLabel
              selectLabel="Ấn enter để chọn"
              trackBy="id"
              v-model="filtersByAttributeSlug[item.key]['value']"
              @input="changeFiltersByAttributeSlug"
              :showLabels="false"
            ></multiselect>
          </template>

          <template v-else-if="item.key === 'created_at' || item.key === 'updated_at'">
            <multiselect
              :closeOnSelect="true"
              :multiple="false"
              :name="item.key"
              :options="filterConditionsDateTimeByCreatedAtAndUpdatedAt"
              deselectLabel="Ấn enter để bỏ chọn"
              label="label"
              placeholder="Chọn 1"
              selectedLabel
              selectLabel="Ấn enter để chọn"
              trackBy="id"
              v-model="filtersByAttributeSlug[item.key]['condition']"
              @input="changeConditionInputTypeDateTime(item.key)"
              :showLabels="false"
            ></multiselect>
            <template
              v-if="filtersByAttributeSlug[item.key]['condition'] && 
              filtersByAttributeSlug[item.key]['condition'].id === 6"
            >
              <date-picker
                :editable="false"
                class="w-100 mt-2"
                format="DD/MM/YYYY"
                placeholder="Chọn ngày"
                type="date"
                v-model="filtersByAttributeSlug[item.key]['value']"
                value-type="YYYY-MM-DD"
                range
                @change="changeFiltersByAttributeSlug"
              ></date-picker>
            </template>
            <template
              v-if="filtersByAttributeSlug[item.key]['condition'] &&
               filtersByAttributeSlug[item.key]['condition'].id === 7"
            >
              <div class="row mt-2">
                <div class="col-md-4">
                  <b-form-group
                    id="attribute-date-time-day-group"
                    label-for="attribute_date_time_day_group"
                    label-class="required"
                  >
                    <b-form-input
                      type="text"
                      class="form-control"
                      id="attribute_date_time_day_group"
                      v-model="filtersByAttributeSlug[item.key]['date']['day']"
                      :class="{'is-invalid' : filterErrors && filterErrors[item.key] && filterErrors[item.key]['day']}"
                      @keyup="checkValueFilterByAttributeSlugInputTypeDateTime(item.key)"
                      aria-describedby="attribute-date-time-day-group-feedback"
                      placeholder="Ngày"
                    ></b-form-input>
                    <b-form-invalid-feedback
                      v-if="filterErrors && filterErrors[item.key] && filterErrors[item.key]['day']"
                      id="attribute-date-time-day-group-feedback"
                    >{{ filterErrors[item.key]['day'] }}</b-form-invalid-feedback>
                  </b-form-group>
                </div>
                <div class="col-md-4">
                  <b-form-group
                    id="attribute-date-time-month-group"
                    label-for="attribute_date_time_month_group"
                    label-class="required"
                  >
                    <b-form-input
                      type="text"
                      class="form-control"
                      id="attribute_date_time_month_group"
                      v-model="filtersByAttributeSlug[item.key]['date']['month']"
                      :class="{'is-invalid' : filterErrors && filterErrors[item.key] && filterErrors[item.key]['month']}"
                      @keyup="checkValueFilterByAttributeSlugInputTypeDateTime(item.key)"
                      aria-describedby="attribute-date-time-month-group-feedback"
                      placeholder="Tháng"
                    ></b-form-input>
                    <b-form-invalid-feedback
                      v-if="filterErrors && filterErrors[item.key] && filterErrors[item.key]['month']"
                      id="attribute-date-time-month-group-feedback"
                    >{{ filterErrors[item.key]['month'] }}</b-form-invalid-feedback>
                  </b-form-group>
                </div>
                <div class="col-md-4">
                  <b-form-group
                    id="attribute-date-time-year-group"
                    label-for="attribute_date_time_year_group"
                    label-class="required"
                  >
                    <b-form-input
                      type="text"
                      class="form-control"
                      id="attribute_date_time_year_group"
                      v-model="filtersByAttributeSlug[item.key]['date']['year']"
                      :class="{'is-invalid' : filterErrors && filterErrors[item.key] && filterErrors[item.key]['year']}"
                      @keyup="checkValueFilterByAttributeSlugInputTypeDateTime(item.key)"
                      aria-describedby="attribute-date-time-year-group-feedback"
                      placeholder="Năm"
                    ></b-form-input>
                    <b-form-invalid-feedback
                      v-if="filterErrors && filterErrors[item.key] && filterErrors[item.key]['year']"
                      id="attribute-date-time-year-group-feedback"
                    >{{ filterErrors[item.key]['year'] }}</b-form-invalid-feedback>
                  </b-form-group>
                </div>
              </div>
            </template>
          </template>

          <template v-else-if="isDateTime(getAttributeInputTypeIdByAttributeId(item.attributeId))">
            <multiselect
              :closeOnSelect="true"
              :multiple="false"
              :name="item.key"
              :options="filterConditionsDateTime"
              deselectLabel="Ấn enter để bỏ chọn"
              label="label"
              placeholder="Chọn 1"
              selectedLabel
              selectLabel="Ấn enter để chọn"
              trackBy="id"
              v-model="filtersByAttributeSlug[item.key]['condition']"
              @input="changeConditionInputTypeDateTime(item.key)"
              :showLabels="false"
            ></multiselect>
            <template
              v-if="filtersByAttributeSlug[item.key]['condition'] &&
               filtersByAttributeSlug[item.key]['condition'].id === 6"
            >
              <date-picker
                :editable="false"
                class="w-100 mt-2"
                format="DD/MM/YYYY"
                placeholder="Chọn ngày"
                type="date"
                v-model="filtersByAttributeSlug[item.key]['attribute_values']"
                value-type="YYYY-MM-DD"
                range
                @change="changeFiltersByAttributeSlug"
              ></date-picker>
            </template>
            <template
              v-if="filtersByAttributeSlug[item.key]['condition'] && 
              filtersByAttributeSlug[item.key]['condition'].id === 7"
            >
              <div class="row mt-2">
                <div class="col-md-4">
                  <b-form-group
                    id="attribute-date-time-day-group"
                    label-for="attribute_date_time_day_group"
                    label-class="required"
                  >
                    <b-form-input
                      type="text"
                      class="form-control"
                      id="attribute_date_time_day_group"
                      v-model="filtersByAttributeSlug[item.key]['date']['day']"
                      :class="{'is-invalid' : filterErrors && filterErrors[item.key] && filterErrors[item.key]['day']}"
                      @keyup="checkValueFilterByAttributeSlugInputTypeDateTime(item.key)"
                      aria-describedby="attribute-date-time-day-group-feedback"
                      placeholder="Ngày"
                    ></b-form-input>
                    <b-form-invalid-feedback
                      v-if="filterErrors && filterErrors[item.key] && filterErrors[item.key]['day']"
                      id="attribute-date-time-day-group-feedback"
                    >{{ filterErrors[item.key]['day'] }}</b-form-invalid-feedback>
                  </b-form-group>
                </div>
                <div class="col-md-4">
                  <b-form-group
                    id="attribute-date-time-month-group"
                    label-for="attribute_date_time_month_group"
                    label-class="required"
                  >
                    <b-form-input
                      type="text"
                      class="form-control"
                      id="attribute_date_time_month_group"
                      v-model="filtersByAttributeSlug[item.key]['date']['month']"
                      :class="{'is-invalid' : filterErrors && filterErrors[item.key] && filterErrors[item.key]['month']}"
                      @keyup="checkValueFilterByAttributeSlugInputTypeDateTime(item.key)"
                      aria-describedby="attribute-date-time-month-group-feedback"
                      placeholder="Tháng"
                    ></b-form-input>
                    <b-form-invalid-feedback
                      v-if="filterErrors && filterErrors[item.key] && filterErrors[item.key]['month']"
                      id="attribute-date-time-month-group-feedback"
                    >{{ filterErrors[item.key]['month'] }}</b-form-invalid-feedback>
                  </b-form-group>
                </div>
                <div class="col-md-4">
                  <b-form-group
                    id="attribute-date-time-year-group"
                    label-for="attribute_date_time_year_group"
                    label-class="required"
                  >
                    <b-form-input
                      type="text"
                      class="form-control"
                      id="attribute_date_time_year_group"
                      v-model="filtersByAttributeSlug[item.key]['date']['year']"
                      :class="{'is-invalid' : filterErrors && filterErrors[item.key] && filterErrors[item.key]['year']}"
                      @keyup="checkValueFilterByAttributeSlugInputTypeDateTime(item.key)"
                      aria-describedby="attribute-date-time-year-group-feedback"
                      placeholder="Năm"
                    ></b-form-input>
                    <b-form-invalid-feedback
                      v-if="filterErrors && filterErrors[item.key] && filterErrors[item.key]['year']"
                      id="attribute-date-time-year-group-feedback"
                    >{{ filterErrors[item.key]['year'] }}</b-form-invalid-feedback>
                  </b-form-group>
                </div>
              </div>
            </template>
          </template>

          <template
            v-else-if="isAttributeHasAttributeOptions(getAttributeInputTypeIdByAttributeId(item.attributeId))"
          >
            <multiselect
              :closeOnSelect="true"
              :multiple="true"
              :name="item.key"
              :options="getOptions(item.attributeId)"
              deselectLabel="Ấn enter để bỏ chọn"
              label="name"
              placeholder="Chọn nhiều"
              selectedLabel
              selectLabel="Ấn enter để chọn"
              trackBy="id"
              v-model="filtersByAttributeSlug[item.key]['attribute_values']"
              @input="changeFiltersByAttributeSlug"
              :showLabels="false"
            ></multiselect>
          </template>

          <template
            v-else-if="inputType['Number/ Số'] === getAttributeInputTypeIdByAttributeId(item.attributeId) ||
             inputType['Price/ Tiền tệ'] === getAttributeInputTypeIdByAttributeId(item.attributeId)"
          >
            <multiselect
              :closeOnSelect="true"
              :multiple="false"
              :name="item.key"
              :options="filterConditionsNumber"
              deselectLabel="Ấn enter để bỏ chọn"
              label="label"
              placeholder="Chọn 1"
              selectedLabel
              selectLabel="Ấn enter để chọn"
              trackBy="id"
              v-model="filtersByAttributeSlug[item.key]['condition']"
              @input="changeConditionInputTypeNumberAndPrice(item.key)"
              :showLabels="false"
            ></multiselect>

            <template
              v-if="filtersByAttributeSlug[item.key]['condition'] && 
              filtersByAttributeSlug[item.key]['condition'].id !== 1"
            >
              <template v-if="filtersByAttributeSlug[item.key]['condition'].id === 8">
                <div class="row mt-2">
                  <div class="col-md-6">
                    <b-form-group
                      id="attribute-number-from-group"
                      label-for="attribute_number_from_group"
                      label-class="required"
                    >
                      <b-form-input
                        type="text"
                        class="form-control"
                        id="attribute_number_from_group"
                        v-model="filtersByAttributeSlug[item.key]['range']['from']"
                        :class="{'is-invalid' : filterErrors && filterErrors[item.key] && filterErrors[item.key]['from']}"
                        @keyup="checkValueFilterByAttributeSlugInputTypeNumberAndPrice(item.key)"
                        aria-describedby="attribute-number-from-group-feedback"
                      ></b-form-input>
                      <b-form-invalid-feedback
                        v-if="filterErrors && filterErrors[item.key] && filterErrors[item.key]['from']"
                        id="attribute-number-from-group-feedback"
                      >{{ filterErrors[item.key]['from'] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </div>
                  <div class="col-md-6">
                    <b-form-group
                      id="attribute-number-to-group"
                      label-for="attribute_number_to_group"
                      label-class="required"
                    >
                      <b-form-input
                        type="text"
                        class="form-control"
                        id="attribute_number_to_group"
                        v-model="filtersByAttributeSlug[item.key]['range']['to']"
                        :class="{'is-invalid' : filterErrors && filterErrors[item.key] && filterErrors[item.key]['to']}"
                        @keyup="checkValueFilterByAttributeSlugInputTypeNumberAndPrice(item.key)"
                        aria-describedby="attribute-number-to-group-feedback"
                      ></b-form-input>
                      <b-form-invalid-feedback
                        v-if="filterErrors && filterErrors[item.key] && filterErrors[item.key]['to']"
                        id="attribute-number-to-group-feedback"
                      >{{ filterErrors[item.key]['to'] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </div>
                </div>
              </template>
              <template v-else>
                <b-form-group
                  id="attribute-number-group"
                  label-for="attribute_number_group"
                  label-class="required"
                  class="mt-2"
                >
                  <b-form-input
                    type="text"
                    class="form-control"
                    id="attribute_number_group"
                    v-model="filtersByAttributeSlug[item.key]['attribute_values']"
                    :class="{'is-invalid' : filterErrors && filterErrors[item.key] && filterErrors[item.key]['value']}"
                    @keyup="checkValueFilterByAttributeSlugInputTypeNumberAndPrice(item.key)"
                    aria-describedby="attribute-number-group-feedback"
                  ></b-form-input>
                  <b-form-invalid-feedback
                    v-if="filterErrors && filterErrors[item.key] && filterErrors[item.key]['value']"
                    id="attribute-number-group-feedback"
                  >{{ filterErrors[item.key]['value'] }}</b-form-invalid-feedback>
                </b-form-group>
              </template>
            </template>
          </template>

          <template v-else>
            <multiselect
              :closeOnSelect="true"
              :multiple="false"
              :name="item.key"
              :options="filterConditionsText"
              deselectLabel="Ấn enter để bỏ chọn"
              label="label"
              placeholder="Chọn 1"
              selectedLabel
              selectLabel="Ấn enter để chọn"
              trackBy="id"
              v-model="filtersByAttributeSlug[item.key]['condition']"
              @input="changeConditionInputTypeText(item.key)"
              :showLabels="false"
            ></multiselect>
            <template
              v-if="filtersByAttributeSlug[item.key]['condition'] && 
              filtersByAttributeSlug[item.key]['condition'].id !== 1"
            >
              <b-form-group
                id="attribute-text-group"
                label-for="attribute_text_group"
                label-class="required"
                class="mt-2"
              >
                <b-form-input
                  type="text"
                  class="form-control"
                  id="attribute_text_group"
                  v-model="filtersByAttributeSlug[item.key]['attribute_values']"
                  :class="{'is-invalid' : filterErrors && filterErrors[item.key] && filterErrors[item.key]['value']}"
                  @keyup="checkValueFilterByAttributeSlugInputTypeText(item.key)"
                  aria-describedby="attribute-text-group-feedback"
                ></b-form-input>
                <b-form-invalid-feedback
                  v-if="filterErrors && filterErrors[item.key] && filterErrors[item.key]['value']"
                  id="attribute-text-group-feedback"
                >{{ filterErrors[item.key]['value'] }}</b-form-invalid-feedback>
              </b-form-group>
            </template>
          </template>
        </span>
      </b-th>
    </template>
  </b-tr>
</template>
