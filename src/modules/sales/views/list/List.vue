<style src="./List.scss" lang="scss" scoped></style>
<script src="./List.ts" lang="ts"></script>

<template>
  <div>
    <div class="body-upper">
      <b-breadcrumb :items="breadcrumbItems"></b-breadcrumb>
      <div class="actions">
        <CreateSale @onCreated="onRefresh" />
      </div>
    </div>
    <div class="body-content body-content-custom">
      <div class="body-content-left">
        <SidebarLeft />
      </div>
      <div class="body-content-right">
        <b-overlay :show="isLoading" rounded opacity="0.6" spinner-small spinner-variant="primary">
          <b-table bordered hover responsive :items="items" :fields="fields">
            <template v-slot:custom-foot="data" v-if="items.length <= 0">
              <b-tr>
                <b-td
                  :colspan="data.fields.length"
                  class="text-center text-confirm"
                >Không có nhân viên bán hàng nào.</b-td>
              </b-tr>
            </template>

            <template v-slot:cell(actions)="data">
              <template v-if="hasPermission([PERMISSION.SALE_MANAGEMENT['*'], PERMISSION.SALE_MANAGEMENT.DESTROY])">
                <i class="fas fa-trash cursor-pointer mr-2" @click.prevent="onDelete(data.item)"></i>
              </template>
              <template v-else>
                <i
                  class="fas fa-trash cursor-pointer mr-2 permission-btn-disabled"
                  v-b-tooltip.hover
                  :title="messageNotPermission"
                ></i>
              </template>
            </template>

            <template v-slot:cell(allowed_assign_lead)="data">
              <template v-if="hasPermission([PERMISSION.SALE_MANAGEMENT['*'], PERMISSION.SALE_MANAGEMENT.UPDATE])">
                <b-form-checkbox
                  class="cursor-pointer"
                  switch
                  size="lg"
                  v-model="data.value"
                  @change="onEdit(data.item)"
                  :disabled="isLoadingEdit"
                ></b-form-checkbox>
              </template>
              <template v-else>
                <b-form-checkbox
                  switch
                  size="lg"
                  disabled
                  v-model="data.value"
                  v-b-tooltip.hover
                  :title="messageNotPermission"
                ></b-form-checkbox>
              </template>
            </template>
          </b-table>
        </b-overlay>
      </div>
    </div>
    <DeleteSale @onDeleted="onRefresh" />
  </div>
</template>