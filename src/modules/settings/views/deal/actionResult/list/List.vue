<style src="./List.scss" lang="scss" scoped></style>
<script src="./List.ts" lang="ts"></script>

<template>
  <div>
    <div class="body-upper">
      <b-breadcrumb :items="breadcrumbItems"></b-breadcrumb>
      <div class="actions">
        <template v-if="hasPermission([PERMISSION.DEAL['*'], PERMISSION.DEAL.WORKFLOW['*']])">
          <b-button
            v-b-modal.dealActionResultCreateModal
            variant="primary"
            class="float-right nt_btn nt_btn nt_btn-warning nt-button-top"
          >
            <i class="fas fa-plus"></i> Thêm kết quả xử lý
          </b-button>
        </template>
        <template v-else>
          <b-button
            variant="primary"
            class="float-right nt_btn nt_btn nt_btn-warning nt-button-top permission-btn-disabled"
            v-b-tooltip.hover
            :title="messageNotPermission"
          >
            <i class="fas fa-plus"></i> Thêm kết quả xử lý
          </b-button>
        </template>
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
                >Không có kết quả xử lý nào.</b-td>
              </b-tr>
            </template>
            <template v-slot:cell(actions)="data">
              <template v-if="hasPermission([PERMISSION.DEAL['*'], PERMISSION.DEAL.WORKFLOW['*']])">
                <i class="fas fa-edit cursor-pointer mr-2" @click.prevent="onEdit(data.item.id)"></i>
              </template>
              <template v-else>
                <i
                  class="fas fa-edit cursor-pointer mr-2 permission-btn-disabled"
                  v-b-tooltip.hover
                  :title="messageNotPermission"
                ></i>
              </template>
              <!-- <i class="fas fa-trash cursor-pointer" @click.prevent="onDelete(data.item)"></i> -->
            </template>
          </b-table>
        </b-overlay>
      </div>
    </div>
    <Create @onCreated="onRefresh" />
    <Edit @onUpdated="onRefresh" />
  </div>
</template>