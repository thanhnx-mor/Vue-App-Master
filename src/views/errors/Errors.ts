import { Component } from 'vue-property-decorator'
import Mixins from '@/mixins'
import { GET_CURRENT_USER } from '@/modules/users/type'

@Component({
})
export default class Errors extends Mixins {
    constructor() {
        super()
    }
    protected goToHome() {
        return window.location.href = '/'
    }

    private created() {
        this.getCurrentUser()
    }

    private getCurrentUser() {
        this.$store.dispatch(GET_CURRENT_USER)
    }
}
