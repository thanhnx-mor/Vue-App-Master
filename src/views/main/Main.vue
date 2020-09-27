<style src="./Main.scss" lang="scss" scoped></style>
<script src="./Main.ts" lang="ts"></script>

<template>
  <div>
    <div class="main" id="app" v-show="!isForbidden">
      <MainHeader class="main-header" />
      <div class="main-body">
        <router-view />
      </div>
      <MainFooter class="main-footer" />
    </div>
    <Forbidden v-show="isForbidden" />
    <button v-b-modal.forbiddenModal id="showForbiddenModal">Show ForbiddenModal</button>
    <ForbiddenModal />
  </div>
</template>
