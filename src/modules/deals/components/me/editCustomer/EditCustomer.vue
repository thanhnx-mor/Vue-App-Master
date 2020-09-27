<style src="./EditCustomer.scss" lang="scss" scoped></style>
<script src="./EditCustomer.ts" lang="ts"></script>

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
            <Edit :serverErrors="serverErrors" :attribute="attribute" />
          </div>
        </div>
      </template>
    </b-row>
  </div>
</template>