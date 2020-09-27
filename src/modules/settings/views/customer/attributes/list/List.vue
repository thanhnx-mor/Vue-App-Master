<style src="./List.scss" lang="scss" scoped></style>
<script src="./List.ts" lang="ts"></script>

<template>
  <div>
    <div class="body-upper">
      <b-breadcrumb :items="breadcrumbItems"></b-breadcrumb>
      <div class="actions">
        <template
          v-if="hasPermission([PERMISSION.CUSTOMER['*'], 
        PERMISSION.CUSTOMER.ATTRIBUTE['*'], PERMISSION.CUSTOMER.ATTRIBUTE.STORE])"
        >
          <b-button
            v-b-modal.attributeCreateModal
            variant="primary"
            class="float-right nt_btn nt_btn nt_btn-warning nt-button-top"
          >
            <i class="fas fa-plus"></i> Thêm trường dữ liệu
          </b-button>
        </template>
        <template v-else>
          <b-button
            variant="primary"
            class="float-right nt_btn nt_btn nt_btn-warning nt-button-top permission-btn-disabled"
            v-b-tooltip.hover
            :title="messageNotPermission"
          >
            <i class="fas fa-plus"></i> Thêm trường dữ liệu
          </b-button>
        </template>
      </div>
    </div>
    <div class="body-content body-content-custom">
      <div class="body-content-left">
        <SidebarLeft />
      </div>
      <div class="body-content-right">
        <b-table
          bordered
          hover
          responsive
          :items="attributes"
          :fields="fields"
          :tbody-tr-class="rowClass"
        >
          <template v-slot:cell(actions)="data">
            <template v-if="!data.item.is_default">
              <template
                v-if="hasPermission([PERMISSION.CUSTOMER['*'], 
                PERMISSION.CUSTOMER.ATTRIBUTE['*'], PERMISSION.CUSTOMER.ATTRIBUTE.UPDATE])"
              >
                <i class="fas fa-edit cursor-pointer mr-2" @click.prevent="onEdit(data.item.id)"></i>
              </template>
              <template v-else>
                <i
                  class="fas fa-edit cursor-pointer mr-2 permission-btn-disabled"
                  v-b-tooltip.hover
                  :title="messageNotPermission"
                ></i>
              </template>

              <template
                v-if="hasPermission([PERMISSION.CUSTOMER['*'], 
                PERMISSION.CUSTOMER.ATTRIBUTE['*'], PERMISSION.CUSTOMER.ATTRIBUTE.DESTROY])"
              >
                <i class="fas fa-trash cursor-pointer" @click.prevent="onDelete(data.item)"></i>
              </template>
              <template v-else>
                <i
                  class="fas fa-trash cursor-pointer permission-btn-disabled"
                  v-b-tooltip.hover
                  :title="messageNotPermission"
                ></i>
              </template>
            </template>

            <!-- <b-dropdown id="dropdown-1" text="Tác vụ" size="sm" v-if="!data.item.is_default">
              <b-dropdown-item @click.prevent="onEdit(data.item.id)">Chỉnh sửa</b-dropdown-item>
              <b-dropdown-item @click.prevent="onDelete(data.item)">Xóa</b-dropdown-item>
            </b-dropdown>-->
          </template>
          <template v-slot:cell(name)="data">
            <span v-html="data.value"></span>
          </template>
          <template v-slot:cell(is_required)="data">
            <b-form-checkbox switch size="lg" disabled v-model="data.value"></b-form-checkbox>
          </template>
          <template v-slot:cell(is_unique)="data">
            <b-form-checkbox switch size="lg" disabled v-model="data.value"></b-form-checkbox>
          </template>
          <template v-slot:cell(is_enabled)="data">
            <b-form-checkbox switch size="lg" disabled v-model="data.value"></b-form-checkbox>
          </template>
        </b-table>
      </div>
    </div>

    <Create @onCreated="onRefresh" :createAction="GET_CUSTOMER_ATTRIBUTE_CREATE" :prefix="prefix" />
    <Edit
      @onUpdated="onRefresh"
      :detailsAction="GET_CUSTOMER_ATTRIBUTE_SHOW"
      :updateAction="GET_CUSTOMER_ATTRIBUTE_UPDATE"
      :prefix="prefix"
    />
    <Delete
      @onDeleted="onRefresh"
      :deleteAction="GET_CUSTOMER_ATTRIBUTE_DELETE"
      :checkBeforeDeleteAction="GET_CUSTOMER_CHECK_BEFORE_ATTRIBUTE_DELETE"
      :prefix="prefix"
    />
  </div>
</template>