<style src="./Login.scss" lang="scss" scoped></style>
<script src="./Login.ts" lang="ts"></script>

<template>
  <div class="page-login">
    <div class="info">
      <h1 class="title">Đăng nhập</h1>
      <div class="desc">Nhập email tài khoản để sử dụng phần mềm</div>
    </div>
    <b-alert :show="isError" class="w-100" variant="danger" v-html="msgError"></b-alert>
    <validation-observer ref="observer" v-slot="{ passes }" class="w-100">
      <b-form @submit.stop.prevent="passes(onSubmit)">
        <validation-provider
          name="Email"
          :rules="{ required: true, email: true, max: 250}"
          v-slot="validationContext"
        >
          <b-form-group id="email-group" label="Email" label-for="email">
            <b-form-input
              id="email"
              name="email"
              v-model="form.email"
              :state="getValidationState(validationContext)"
              aria-describedby="email-group-feedback"
            ></b-form-input>
            <b-form-invalid-feedback id="email-group-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>
        <validation-provider
          name="Mật khẩu"
          :rules="{ required: true, max: 32, min: 6 }"
          v-slot="validationContext"
        >
          <b-form-group id="password-group" label="Mật khẩu" label-for="password">
            <b-form-input
              id="password"
              name="password"
              v-model="form.password"
              :state="getValidationState(validationContext)"
              aria-describedby="password-group-feedback"
              type="password"
            ></b-form-input>
            <b-form-invalid-feedback id="password-group-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>
        <b-button @click="reset()">Làm mới</b-button>
        <vue-ladda button-class="btn btn-primary ml-2" :loading="isLoading" type="submit">Đăng nhập</vue-ladda>
      </b-form>
    </validation-observer>
  </div>
</template>