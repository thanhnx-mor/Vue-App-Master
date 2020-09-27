<style src="./List.scss" lang="scss" scoped></style>
<script src="./List.ts" lang="ts"></script>

<template>
  <div>
    <div class="body-upper">
      <b-breadcrumb :items="breadcrumbItems"></b-breadcrumb>
      <div class="actions">
        <CreateRole @onCreated="onRefresh" />
        <DeleteRole ref="deleteModal" @onDeleted="onRefresh" />
      </div>
    </div>

    <div class="body-content body-content-custom">
      <div class="body-content-left">
        <UserSidebarLeft />
      </div>
      <div class="body-content-right">
        <template>
          <b-overlay
            :show="isLoading"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
          >
            <b-table bordered hover responsive :items="roles" :fields="roleFields">
              <template v-slot:cell(actions)="role">
                <template v-if="hasPermission([PERMISSION.ROLE['*'], PERMISSION.ROLE.UPDATE])">
                  <i class="fas fa-edit cursor-pointer mr-2" @click="onEdit(role.item.id)"></i>
                </template>
                <template v-else>
                  <i
                    class="fas fa-edit cursor-pointer mr-2 permission-btn-disabled"
                    v-b-tooltip.hover
                    :title="messageNotPermission"
                  ></i>
                </template>

                <template v-if="hasPermission([PERMISSION.ROLE['*'], PERMISSION.ROLE.DESTROY])">
                  <i class="fas fa-trash cursor-pointer" @click="onDelete(role.item)"></i>
                </template>
                <template v-else>
                  <i
                    class="fas fa-trash cursor-pointer permission-btn-disabled"
                    v-b-tooltip.hover
                    :title="messageNotPermission"
                  ></i>
                </template>
              </template>
              <template v-slot:cell(permissions)="permissions">
                <template v-for="(permission, index) in permissions.value">
                  <b-badge class="mr-2" pill :key="index">{{ permission.display_name }}</b-badge>
                </template>
              </template>
            </b-table>
            <template v-if="!roles.length && !isLoading">
              <p class="text-confirm text-center mb-0">Chưa có vai trò nào.</p>
            </template>
          </b-overlay>
        </template>
      </div>
      <EditRole @onUpdated="onRefresh" />
    </div>
  </div>
</template>