import Vue from 'vue'
// @ts-ignore
import VueLadda from 'vue-ladda'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate'
import vi from './types/error.json'
import * as rules from 'vee-validate/dist/rules'
import Snotify, { SnotifyPosition } from 'vue-snotify'
import 'vue-snotify/styles/material.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import 'vue2-datepicker/index.css'

// Install VeeValidate rules and localization
Object.keys(rules).forEach((rule) => {
  extend(rule, (rules as any)[rule])
})
localize('vi', vi)
// Install VeeValidate components globally
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

extend('customRequired', {
  validate: (value) => !!value && value > 0,
  message: '{_field_} là bắt buộc',
})

Vue.use(BootstrapVue)
Vue.use(Snotify, {
  toast: {
    style: 'material',
    position: SnotifyPosition.leftBottom,
    timeout: 5000,
    progressBar: false,
    closeClick: true,
    newTop: true,
    backdrop: -1,
    dockMax: 8,
    blockMax: 6,
    pauseHover: false,
    titleMaxLength: 30,
    bodyMaxLength: 120,
    oneAtTime: false,
    preventDuplicates: false,
  },
})
Vue.component('vue-ladda', VueLadda)
