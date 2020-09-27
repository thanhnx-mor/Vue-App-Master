<style src="./FilterAttribute.scss" lang="scss" scoped></style>
<script src="./FilterAttribute.ts" lang="ts"></script>

<template>
  <tr v-if="data && data.fields" role="row">
    <th
      role="columnheader"
      scope="col"
      class="table-b-table-default"
      v-for="(item, index) in data.fields"
      :key="index"
      :class="[
        item.thClass ? item.thClass : '',
        item.stickyColumn ? 'b-table-sticky-column' : '',
      ]"
    >
      {{ item.label }} &nbsp;
      <template
        v-if="showFilter && item.key !== 'actions' && !item.isHiddenFilter"
      >
        <b-button
          @click="onShowFilterItem(item)"
          size="sm"
          :class="
            filterItemHasValuesBySlug(item.key, filtersByAttributeSlug)
              ? 'nt_btn-primary'
              : 'nt_btn-outline-primary'
          "
        >
          <i class="fas fa-filter"></i>
        </b-button>
        <a
          v-if="getLabelCurrentFilterItem(item)"
          class="text-error ml-2"
          href="#"
          @click.prevent="removeFilterItem(item)"
          v-b-tooltip.hover
          title="Bỏ lọc thuộc tính"
        >
          <i class="fas fa-times"></i>
        </a>
      </template>
      <div v-if="getLabelCurrentFilterItem(item)">
        <small v-html="getLabelCurrentFilterItem(item)"></small>
      </div>
    </th>
    <b-modal
      v-if="filterItem && filterItem.label"
      id="filterByItem"
      no-close-on-backdrop
      no-close-on-esc
      header-close-content="<i class='fas fa-times'></i>"
      modal-class="modal-footer-custom"
      ok-title="Lọc"
      cancel-title="Hủy bỏ"
      @ok="onFilterItem"
      @cancel="onCancelFilterItem"
      @close="onCancelFilterItem"
      :ok-disabled="isDisabled()"
    >
      <template v-slot:modal-title>
        Lọc với thuộc tính&nbsp;
        <strong>{{ filterItem.label }}</strong>
      </template>
      <template v-if="filterItem.key === 'created_by'">
        <multiselect
          :closeOnSelect="true"
          :multiple="true"
          :name="filterItem.key"
          :options="userOptions()"
          deselectLabel="Ấn enter để bỏ chọn"
          label="name"
          placeholder="Chọn nhiều"
          selectedLabel
          selectLabel="Ấn enter để chọn"
          :showLabels="false"
          trackBy="id"
          v-model="filtersByAttributeSlug[filterItem.key]['value']"
          @input="changeFiltersByAttributeSlug"
        ></multiselect>
      </template>

      <template
        v-else-if="
          filterItem.key === 'created_at' || filterItem.key === 'updated_at'
        "
      >
        <multiselect
          :closeOnSelect="true"
          :multiple="false"
          :name="filterItem.key"
          :options="filterConditionsDateTimeByCreatedAtAndUpdatedAt"
          deselectLabel="Ấn enter để bỏ chọn"
          label="label"
          placeholder="Chọn điều kiện"
          selectedLabel
          selectLabel="Ấn enter để chọn"
          trackBy="id"
          v-model="filtersByAttributeSlug[filterItem.key]['condition']"
          @input="changeConditionInputTypeDateTime(filterItem.key)"
          :showLabels="false"
        ></multiselect>
        <template
          v-if="
            filtersByAttributeSlug[filterItem.key]['condition'] &&
              filtersByAttributeSlug[filterItem.key]['condition'].id === 6
          "
        >
          <date-picker
            :editable="false"
            class="w-100 mt-2"
            format="DD/MM/YYYY"
            placeholder="Chọn ngày"
            type="date"
            v-model="filtersByAttributeSlug[filterItem.key]['value']"
            value-type="YYYY-MM-DD"
            range
            @change="changeFiltersByAttributeSlug"
          ></date-picker>
        </template>
        <template
          v-if="
            filtersByAttributeSlug[filterItem.key]['condition'] &&
              filtersByAttributeSlug[filterItem.key]['condition'].id === 7
          "
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
                  v-model="
                    filtersByAttributeSlug[filterItem.key]['date']['day']
                  "
                  :class="{
                    'is-invalid':
                      filterErrors &&
                      filterErrors[filterItem.key] &&
                      filterErrors[filterItem.key]['day'],
                  }"
                  @keyup="validationInputTypeDateTime(filterItem.key)"
                  aria-describedby="attribute-date-time-day-group-feedback"
                  placeholder="Ngày"
                ></b-form-input>
                <b-form-invalid-feedback
                  v-if="
                    filterErrors &&
                      filterErrors[filterItem.key] &&
                      filterErrors[filterItem.key]['day']
                  "
                  id="attribute-date-time-day-group-feedback"
                >
                  {{
                  filterErrors[filterItem.key]["day"]
                  }}
                </b-form-invalid-feedback>
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
                  v-model="
                    filtersByAttributeSlug[filterItem.key]['date']['month']
                  "
                  :class="{
                    'is-invalid':
                      filterErrors &&
                      filterErrors[filterItem.key] &&
                      filterErrors[filterItem.key]['month'],
                  }"
                  @keyup="validationInputTypeDateTime(filterItem.key)"
                  aria-describedby="attribute-date-time-month-group-feedback"
                  placeholder="Tháng"
                ></b-form-input>
                <b-form-invalid-feedback
                  v-if="
                    filterErrors &&
                      filterErrors[filterItem.key] &&
                      filterErrors[filterItem.key]['month']
                  "
                  id="attribute-date-time-month-group-feedback"
                >
                  {{
                  filterErrors[filterItem.key]["month"]
                  }}
                </b-form-invalid-feedback>
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
                  v-model="
                    filtersByAttributeSlug[filterItem.key]['date']['year']
                  "
                  :class="{
                    'is-invalid':
                      filterErrors &&
                      filterErrors[filterItem.key] &&
                      filterErrors[filterItem.key]['year'],
                  }"
                  @keyup="validationInputTypeDateTime(filterItem.key)"
                  aria-describedby="attribute-date-time-year-group-feedback"
                  placeholder="Năm"
                ></b-form-input>
                <b-form-invalid-feedback
                  v-if="
                    filterErrors &&
                      filterErrors[filterItem.key] &&
                      filterErrors[filterItem.key]['year']
                  "
                  id="attribute-date-time-year-group-feedback"
                >
                  {{
                  filterErrors[filterItem.key]["year"]
                  }}
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
        </template>
      </template>

      <template
        v-else-if="
          isDateTime(
            getAttributeInputTypeIdByAttributeId(filterItem.attributeId)
          )
        "
      >
        <multiselect
          :closeOnSelect="true"
          :multiple="false"
          :name="filterItem.key"
          :options="filterConditionsDateTime"
          deselectLabel="Ấn enter để bỏ chọn"
          label="label"
          placeholder="Chọn điều kiện"
          selectedLabel
          selectLabel="Ấn enter để chọn"
          trackBy="id"
          v-model="filtersByAttributeSlug[filterItem.key]['condition']"
          @input="changeConditionInputTypeDateTime(filterItem.key)"
          :showLabels="false"
        ></multiselect>
        <template
          v-if="
            filtersByAttributeSlug[filterItem.key]['condition'] &&
              filtersByAttributeSlug[filterItem.key]['condition'].id === 6
          "
        >
          <date-picker
            :editable="false"
            class="w-100 mt-2"
            format="DD/MM/YYYY"
            placeholder="Chọn ngày"
            type="date"
            v-model="filtersByAttributeSlug[filterItem.key]['attribute_values']"
            value-type="YYYY-MM-DD"
            range
            @change="changeFiltersByAttributeSlug"
          ></date-picker>
        </template>
        <template
          v-if="
            filtersByAttributeSlug[filterItem.key]['condition'] &&
              filtersByAttributeSlug[filterItem.key]['condition'].id === 7
          "
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
                  v-model="
                    filtersByAttributeSlug[filterItem.key]['date']['day']
                  "
                  :class="{
                    'is-invalid':
                      filterErrors &&
                      filterErrors[filterItem.key] &&
                      filterErrors[filterItem.key]['day'],
                  }"
                  @keyup="validationInputTypeDateTime(filterItem.key)"
                  aria-describedby="attribute-date-time-day-group-feedback"
                  placeholder="Ngày"
                ></b-form-input>
                <b-form-invalid-feedback
                  v-if="
                    filterErrors &&
                      filterErrors[filterItem.key] &&
                      filterErrors[filterItem.key]['day']
                  "
                  id="attribute-date-time-day-group-feedback"
                >
                  {{
                  filterErrors[filterItem.key]["day"]
                  }}
                </b-form-invalid-feedback>
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
                  v-model="
                    filtersByAttributeSlug[filterItem.key]['date']['month']
                  "
                  :class="{
                    'is-invalid':
                      filterErrors &&
                      filterErrors[filterItem.key] &&
                      filterErrors[filterItem.key]['month'],
                  }"
                  @keyup="validationInputTypeDateTime(filterItem.key)"
                  aria-describedby="attribute-date-time-month-group-feedback"
                  placeholder="Tháng"
                ></b-form-input>
                <b-form-invalid-feedback
                  v-if="
                    filterErrors &&
                      filterErrors[filterItem.key] &&
                      filterErrors[filterItem.key]['month']
                  "
                  id="attribute-date-time-month-group-feedback"
                >
                  {{
                  filterErrors[filterItem.key]["month"]
                  }}
                </b-form-invalid-feedback>
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
                  v-model="
                    filtersByAttributeSlug[filterItem.key]['date']['year']
                  "
                  :class="{
                    'is-invalid':
                      filterErrors &&
                      filterErrors[filterItem.key] &&
                      filterErrors[filterItem.key]['year'],
                  }"
                  @keyup="validationInputTypeDateTime(filterItem.key)"
                  aria-describedby="attribute-date-time-year-group-feedback"
                  placeholder="Năm"
                ></b-form-input>
                <b-form-invalid-feedback
                  v-if="
                    filterErrors &&
                      filterErrors[filterItem.key] &&
                      filterErrors[filterItem.key]['year']
                  "
                  id="attribute-date-time-year-group-feedback"
                >
                  {{
                  filterErrors[filterItem.key]["year"]
                  }}
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
        </template>
      </template>

      <template
        v-else-if="
          isAttributeHasAttributeOptions(
            getAttributeInputTypeIdByAttributeId(filterItem.attributeId)
          )
        "
      >
        <multiselect
          :closeOnSelect="true"
          :multiple="true"
          :name="filterItem.key"
          :options="getOptions(filterItem.attributeId)"
          deselectLabel="Ấn enter để bỏ chọn"
          label="name"
          placeholder="Chọn nhiều"
          selectedLabel
          selectLabel="Ấn enter để chọn"
          trackBy="id"
          v-model="filtersByAttributeSlug[filterItem.key]['attribute_values']"
          @input="changeFiltersByAttributeSlug"
          :showLabels="false"
        ></multiselect>
      </template>

      <template
        v-else-if="
          inputType['Number/ Số'] ===
            getAttributeInputTypeIdByAttributeId(filterItem.attributeId) ||
            inputType['Price/ Tiền tệ'] ===
              getAttributeInputTypeIdByAttributeId(filterItem.attributeId)
        "
      >
        <multiselect
          :closeOnSelect="true"
          :multiple="false"
          :name="filterItem.key"
          :options="filterConditionsNumber"
          deselectLabel="Ấn enter để bỏ chọn"
          label="label"
          placeholder="Chọn điều kiện"
          selectedLabel
          selectLabel="Ấn enter để chọn"
          trackBy="id"
          v-model="filtersByAttributeSlug[filterItem.key]['condition']"
          @input="changeConditionInputTypeNumberAndPrice(filterItem.key)"
          :showLabels="false"
        ></multiselect>

        <template
          v-if="
            filtersByAttributeSlug[filterItem.key]['condition'] &&
              filtersByAttributeSlug[filterItem.key]['condition'].id !== 1
          "
        >
          <template v-if="filtersByAttributeSlug[filterItem.key]['condition'].id === 8">
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
                    v-model="
                      filtersByAttributeSlug[filterItem.key]['range']['from']
                    "
                    :class="{
                      'is-invalid':
                        filterErrors &&
                        filterErrors[filterItem.key] &&
                        filterErrors[filterItem.key]['from'],
                    }"
                    @keyup="validationInputTypeNumberAndPrice(filterItem.key)"
                    aria-describedby="attribute-number-from-group-feedback"
                  ></b-form-input>
                  <b-form-invalid-feedback
                    v-if="
                      filterErrors &&
                        filterErrors[filterItem.key] &&
                        filterErrors[filterItem.key]['from']
                    "
                    id="attribute-number-from-group-feedback"
                  >
                    {{
                    filterErrors[filterItem.key]["from"]
                    }}
                  </b-form-invalid-feedback>
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
                    v-model="
                      filtersByAttributeSlug[filterItem.key]['range']['to']
                    "
                    :class="{
                      'is-invalid':
                        filterErrors &&
                        filterErrors[filterItem.key] &&
                        filterErrors[filterItem.key]['to'],
                    }"
                    @keyup="validationInputTypeNumberAndPrice(filterItem.key)"
                    aria-describedby="attribute-number-to-group-feedback"
                  ></b-form-input>
                  <b-form-invalid-feedback
                    v-if="
                      filterErrors &&
                        filterErrors[filterItem.key] &&
                        filterErrors[filterItem.key]['to']
                    "
                    id="attribute-number-to-group-feedback"
                  >
                    {{
                    filterErrors[filterItem.key]["to"]
                    }}
                  </b-form-invalid-feedback>
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
                v-model="
                  filtersByAttributeSlug[filterItem.key]['attribute_values']
                "
                :class="{
                  'is-invalid':
                    filterErrors &&
                    filterErrors[filterItem.key] &&
                    filterErrors[filterItem.key]['value'],
                }"
                @keyup="validationInputTypeNumberAndPrice(filterItem.key)"
                aria-describedby="attribute-number-group-feedback"
              ></b-form-input>
              <b-form-invalid-feedback
                v-if="
                  filterErrors &&
                    filterErrors[filterItem.key] &&
                    filterErrors[filterItem.key]['value']
                "
                id="attribute-number-group-feedback"
              >
                {{
                filterErrors[filterItem.key]["value"]
                }}
              </b-form-invalid-feedback>
            </b-form-group>
          </template>
        </template>
      </template>

      <template v-else>
        <multiselect
          :closeOnSelect="true"
          :multiple="false"
          :name="filterItem.key"
          :options="filterConditionsText"
          deselectLabel="Ấn enter để bỏ chọn"
          label="label"
          placeholder="Chọn điều kiện"
          selectedLabel
          selectLabel="Ấn enter để chọn"
          trackBy="id"
          v-model="filtersByAttributeSlug[filterItem.key]['condition']"
          @input="changeConditionInputTypeText(filterItem.key)"
          :showLabels="false"
        ></multiselect>
        <template
          v-if="
            filtersByAttributeSlug[filterItem.key]['condition'] &&
              filtersByAttributeSlug[filterItem.key]['condition'].id !== 1
          "
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
              v-model="
                filtersByAttributeSlug[filterItem.key]['attribute_values']
              "
              :class="{
                'is-invalid':
                  filterErrors &&
                  filterErrors[filterItem.key] &&
                  filterErrors[filterItem.key]['value'],
              }"
              @keyup="validationInputTypeText(filterItem.key)"
              aria-describedby="attribute-text-group-feedback"
            ></b-form-input>
            <b-form-invalid-feedback
              v-if="
                filterErrors &&
                  filterErrors[filterItem.key] &&
                  filterErrors[filterItem.key]['value']
              "
              id="attribute-text-group-feedback"
            >
              {{
              filterErrors[filterItem.key]["value"]
              }}
            </b-form-invalid-feedback>
          </b-form-group>
        </template>
      </template>
    </b-modal>
  </tr>
</template>
