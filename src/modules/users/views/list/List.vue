<style src="./List.scss" lang="scss" scoped></style>
<script src="./List.ts" lang="ts"></script>

<template>
  <div>
    <div class="body-upper">
      <b-breadcrumb :items="breadcrumbItems"></b-breadcrumb>
      <div class="actions">
        <CreateUser @onCreated="onRefresh" />
      </div>
    </div>
    <div class="body-content body-content-custom">
      <div class="body-content-left">
        <UserSidebarLeft />
      </div>
      <div class="body-content-right">
        <b-overlay :show="isLoading" rounded opacity="0.6" spinner-small spinner-variant="primary">
          <b-table bordered hover responsive :items="users" :fields="userFields">
            <template v-slot:cell(status_code)="data">
              <b-badge pill :variant="getStatusCodeBagde(data.value)">{{ codes[data.value] }}</b-badge>
            </template>
            <template v-slot:cell(roles)="roles">
              <template v-for="(role, index) in roles.value">
                <b-badge class="mr-2" pill :key="index">{{ role.display_name }}</b-badge>
              </template>
            </template>
            <template v-slot:cell(actions)="data">
              <template
                v-if="
              isSuperAdmin(currentUser.id) || 
              !isSuperAdmin(currentUser.id) && data.item.id !== 1 &&
               hasPermission([PERMISSION.USER['*'], PERMISSION.USER.UPDATE])"
              >
                <i class="fas fa-edit cursor-pointer" @click="onEdit(data.item.id)"></i>
              </template>
              <template v-else>
                <i
                  v-b-tooltip.hover
                  :title="messageNotPermission"
                  class="fas fa-edit cursor-pointer permission-btn-disabled"
                ></i>
              </template>
            </template>
          </b-table>
        </b-overlay>
        <b-pagination
          v-if="users.length"
          pills
          :value="currentPage"
          :total-rows="total"
          :per-page="perPage"
          align="right"
          @change="onChange"
          class="mb-0"
        ></b-pagination>
      </div>
      <EditUser @onUpdated="onRefresh" />
    </div>
  </div>
</template>