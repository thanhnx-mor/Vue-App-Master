import { mount } from '@vue/test-utils'
import { assert } from 'chai'
import { USER_STATUS_CODE_DEFAULT } from '@/types/const'

import Create from './Create'

const wrapper = mount(Create, {
    propsData: {
        user: {
            name: null,
            email: null,
            password: null,
            status_code: USER_STATUS_CODE_DEFAULT,
        },
    },
})

describe.only('Create', () => {
    const vm = (wrapper.vm as any)

    it('User name is required', () => {
        // wrapper.setData({ user: { name: 'thanhnq' } })
        assert.equal(vm.user.name, null)

        // vm.createdUser
    })




})
