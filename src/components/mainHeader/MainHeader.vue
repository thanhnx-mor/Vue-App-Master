<style src="./MainHeader.scss" lang="scss" scoped></style>
<script src="./MainHeader.ts" lang="ts"></script>

<template>
  <div>
    <b-navbar toggleable="lg">
      <b-navbar-brand to="/">
        <img src="@/assets/imgs/logo.png" style="max-height: 34px" alt />
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <!-- Left -->
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <template v-for="item in menu">
            <template v-if="item.hasPermission">
              <b-nav-item
                v-if="!item.isDropdown"
                :key="item.name"
                :to="item.to"
                :class="[item.class,
                 item.listRouteNameNeedActive && $route.name &&
                 item.listRouteNameNeedActive.includes($route.name) ? 'active-class' : ''
                 ]"
              >{{ item.name }}</b-nav-item>
              <!-- Dropdown -->
              <b-nav-item-dropdown
                v-else
                :key="item.name"
                :text="item.name"
                left
                :class="[item.class,
                 item.listRouteNameNeedActive && $route.name &&
                 item.listRouteNameNeedActive.includes($route.name) ? 'active-class' : ''
                ]"
              >
                <template v-for="(subItem, index) in item.subItems">
                  <template v-if="subItem.hasPermission">
                    <b-dropdown-item :key="index" :to="subItem.to">{{ subItem.name }}</b-dropdown-item>
                  </template>
                  <template v-else>
                    <b-dropdown-item
                      :key="index"
                      class="permission-btn-disabled"
                      v-b-tooltip.hover
                      :title="messageNotPermission"
                    >{{ subItem.name }}</b-dropdown-item>
                  </template>
                </template>
              </b-nav-item-dropdown>
            </template>
            <template v-else>
              <b-nav-item
                :key="item.name"
                :class="item.class"
                class="permission-btn-disabled"
                v-b-tooltip.hover
                :title="messageNotPermission"
              >{{ item.name }}</b-nav-item>
            </template>
          </template>
        </b-navbar-nav>
        <!-- Right -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown
            right
            :class="[$route.name &&
              [PERMISSION.CUSTOMER.ATTRIBUTE.INDEX, 
              PERMISSION.CONTACT.ATTRIBUTE.INDEX,
              PERMISSION.PRODUCT.ATTRIBUTE.INDEX,
              PERMISSION.DEAL.WORKFLOW.INDEX,
              PERMISSION.DEAL.ATTRIBUTE.INDEX,
              PERMISSION.SALE_MANAGEMENT.INDEX].
              includes($route.name) ? 'active-class' : ''
            ]"
          >
            <template v-slot:button-content>
              <i class="fas fa-cog"></i>
            </template>
            <template v-for="(menu, index) in configMenu">
              <template v-if="menu.hasPermission">
                <b-dropdown-item :key="index" :to="menu.to">{{ menu.name }}</b-dropdown-item>
              </template>
              <template v-else>
                <b-dropdown-item
                  :key="index"
                  class="permission-btn-disabled"
                  v-b-tooltip.hover
                  :title="messageNotPermission"
                >{{ menu.name }}</b-dropdown-item>
              </template>
            </template>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <template v-slot:button-content>{{ currentUser.name }}</template>
            <b-dropdown-item @click="logout">Đăng xuất</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
