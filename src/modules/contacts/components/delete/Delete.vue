<style src="./Delete.scss" lang="scss" scoped></style>
<script src="./Delete.ts" lang="ts"></script>

<template>
  <b-modal
    id="contactDeleteModal"
    header-close-content="<i class='fas fa-times'></i>"
    modal-class="modal-footer-custom"
    title="Xác nhận"
    ok-title
    @ok="remove"
  >
    <div class="text-confirm text-center">
      Bạn có chắc bạn muốn xóa liên hệ
      <b>{{ name }}</b>?
    </div>
    <template v-slot:modal-footer>
      <b-button ref="button" variant="secondary" @click="onClose">Hủy bỏ</b-button>
      <b-overlay
        :show="isLoading"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
        class="d-inline-block"
      >
        <b-button ref="button" :disabled="isLoading" variant="primary" @click="remove">Đồng ý</b-button>
      </b-overlay>
    </template>
  </b-modal>
</template>