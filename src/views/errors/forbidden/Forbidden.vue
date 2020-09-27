<style src="./../Style.scss" lang="scss" scoped></style>
<script src="./Script.ts" lang="ts"></script>

<template>
  <div class="page-error" id="pageFobidden">
    <MainHeader class="main-header" />
    <div class="page-error-body">
      <h1 class="title">403</h1>
      <h2 class="sub-title">{{ messageNotPermission }}</h2>
      <a href="#" @click.prevent="goToHome()">Trở về trang chủ</a>
      <!-- <a href="#" @click="$router.go(-1)">Quay trở lại</a> -->
    </div>
    <MainFooter class="main-footer" />
  </div>
</template>
