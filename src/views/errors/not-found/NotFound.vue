<style src="./../Style.scss" lang="scss" scoped></style>
<script src="./Script.ts" lang="ts"></script>

<template>
  <div class="page-error">
    <MainHeader class="main-header" />
    <div class="page-error-body">
      <h1 class="title">404</h1>
      <h2 class="sub-title">Không tìm thấy máy chủ</h2>
      <!-- <a href="#" @click="$router.go(-1)">Quay trở lại</a> -->
      <a href="#" @click.prevent="goToHome()">Trở về trang chủ</a>
    </div>
    <MainFooter class="main-footer" />
  </div>
</template>
