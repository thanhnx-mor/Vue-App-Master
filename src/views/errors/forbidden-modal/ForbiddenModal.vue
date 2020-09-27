<script src="./Script.ts" lang="ts"></script>

<template>
  <b-modal
    id="forbiddenModal"
    scrollable
    no-close-on-backdrop
    no-close-on-esc
    header-close-content="<i class='fas fa-times'></i>"
    modal-class="modal-footer-custom"
    footer-class="justify-content-center"
    title="Thông báo"
    ok-title="Đóng"
    :hide-header="true"
    :ok-only="true"
    @ok="reloadPage"
  >
    <div class="text-confirm text-center">{{ messageNotPermission }}</div>
  </b-modal>
</template>
