<style src="./NoResults.scss" lang="scss" scoped></style>
<script src="./NoResults.ts" lang="ts"></script>

<template>
  <div class="text-center m-5">
    <i :class="icon"></i>
    <p class="text-confirm mt-5 " v-html="title"></p>
    <p v-html="msg"></p>
  </div>
</template>