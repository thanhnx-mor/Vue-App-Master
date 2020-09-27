<style src="./Delete.scss" lang="scss" scoped></style>
<script src="./Delete.ts" lang="ts"></script>

<template>
  <div>
    <b-modal
      id="attributeDeleteModalMessage"
      scrollable
      header-close-content="<i class='fas fa-times'></i>"
      modal-class="modal-footer-custom"
      title="Xóa trường dữ liệu"
      ok-title="Đóng"
      :hide-header="true"
      :ok-only="true"
      footer-class="justify-content-center"
    >
      <div
        class="text-confirm text-center"
      >Trường dữ liệu đã gắn giá trị với khách hàng nên không thể xóa.</div>
    </b-modal>

    <b-modal
      id="attributeDeleteModal"
      header-close-content="<i class='fas fa-times'></i>"
      modal-class="modal-footer-custom"
      title="Xác nhận"
      ok-title
      @ok="onSubmit"
    >
      <div class="text-confirm text-center">
        Bạn có chắc chắn muốn xóa
        <strong>{{ attribute.name }}</strong> này không ?
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
          <b-button ref="button" :disabled="isLoading" variant="primary" @click="onSubmit">Đồng ý</b-button>
        </b-overlay>
      </template>
    </b-modal>
  </div>
</template>