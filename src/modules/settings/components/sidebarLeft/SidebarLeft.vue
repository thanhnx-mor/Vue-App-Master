<style src="./SidebarLeft.scss" lang="scss" scoped></style>
<script src="./SidebarLeft.ts" lang="ts"></script>

<template>
  <b-list-group class="sidebar-menu">
    <template v-for="item in menu">
      <b-list-group-item :key="item.name" :class="item.class">
        <template v-if="item.hasPermission">
          <router-link v-if="!item.isSubItem" :to="item.to">{{ item.name }}</router-link>
          <a v-else v-b-toggle="item.isSubItemName">
            {{ item.name }}
            <i class="fas fa-angle-down"></i>
          </a>
          <b-collapse
            :id="item.isSubItemName"
            :visible="item.listRouteNameNeedActive && $route.name &&
                 item.listRouteNameNeedActive.includes($route.name) ? true : false"
          >
            <template v-for="(subItem, index) in item.subItems">
              <b-list-group-item :key="index">
                <router-link :to="subItem.to" :class="subItem.class">{{ subItem.name }}</router-link>
              </b-list-group-item>
            </template>
          </b-collapse>
        </template>
        <template v-else>
          <span
            :key="item.name"
            class="permission-btn-disabled"
            v-b-tooltip.hover
            :title="messageNotPermission"
          >{{ item.name }}</span>
        </template>
      </b-list-group-item>
    </template>
  </b-list-group>
</template>