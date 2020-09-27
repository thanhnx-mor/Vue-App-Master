<style src="./UserSidebarLeft.scss" lang="scss" scoped></style>
<script src="./UserSidebarLeft.ts" lang="ts"></script>

<template>
  <b-list-group>
    <template v-for="item in menu">
      <b-list-group-item :key="item.name">
        <template v-if="item.hasPermission">
          <router-link v-if="!item.isDropdown" :to="item.to" :class="item.class">{{ item.name }}</router-link>
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