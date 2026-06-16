import { mount } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import LoginPage from '../../app/pages/login/index.vue'

const mocks = vi.hoisted(() => {
    return {
        signInWithPasswordMock: vi.fn(),
        signUpMock: vi.fn(),
        signUpMock: vi.fn(),
        signOutMock: vi.fn(),
        navigateToMock: vi.fn()
    }
})

mockNuxtImport('useSupabaseClient', () => {
    return () => ({
        auth: {
            signInWithPassword: mocks.signInWithPasswordMock,
            signUp: mocks.signUpMock,
            signOut: mocks.signOutMock
        }
    })
})

mockNuxtImport('useSupabaseUser', () => {
    return () => ref(null)
})

mockNuxtImport('navigateTo', () => {
    return mocks.navigateToMock
})

describe('login-page', () => {
    it('shows login form on page load', () => {
        const wrapper = mount(LoginPage, {
            global: {
                stubs: {
                    IconPlantjar: true,
                    ElementButtonSecondary: {
                        template: '<button type="button" @click="$emit(\'click\')">{{ buttonText }}</button>',
                        props: ['buttonText', 'state']
                    },
                    ElementButtonPrimary: {
                        template: '<button :type="type">{{ buttonText }}</button>',
                        props: ['buttonText', 'type']
                    },
                    FormInput: {
                        template: '<input :type="type" :id="id" :name="name" :placeholder="placeholder" />',
                        props: ['type', 'id', 'name', 'placeholder']
                    }
                }
            }
        })

        expect(wrapper.find('#login-form').exists()).toBe(true)
        expect(wrapper.find('#login-email').exists()).toBe(true)
        expect(wrapper.find('#login-password').exists()).toBe(true)
    })

    it('switches to register form on clicking the register-button', async () => {
        const wrapper = mount(LoginPage, {
            global: {
                stubs: {
                    IconPlantjar: true,
                    ElementButtonSecondary: {
                        template: '<button type="button" @click="$emit(\'click\')">{{ buttonText }}</button>',
                        props: ['buttonText', 'state']
                    },
                    ElementButtonPrimary: {
                        template: '<button :type="type">{{ buttonText }}</button>',
                        props: ['buttonText', 'type']
                    },
                    FormInput: {
                        template: '<input :type="type" :id="id" :name="name" :placeholder="placeholder" />',
                        props: ['type', 'id', 'name', 'placeholder']
                    }
                }
            }
        })

        await wrapper.find('[datatestid="register-button"]').trigger('click')

        expect(wrapper.find('#register-form').exists()).toBe(true)
        expect(wrapper.find('#login-form').exists()).toBe(false)
    })

    it('sends mail and password from login-form to supabase', async () => {
        mocks.signInWithPasswordMock.mockResolvedValueOnce({
            data: {
                user: {
                    email: 'test@example.com'
                }
            },
            error: null
        })

        const wrapper = mount(LoginPage, {
            global: {
                stubs: {
                    IconPlantjar: true,
                    ElementButtonSecondary: {
                        template: '<button type="button" @click="$emit(\'click\')">{{ buttonText }}</button>',
                        props: ['buttonText', 'state']
                    },
                    ElementButtonPrimary: {
                        template: '<button :type="type">{{ buttonText }}</button>',
                        props: ['buttonText', 'type']
                    },
                    FormInput: {
                        template: '<input :type="type" :id="id" :name="name" :placeholder="placeholder" />',
                        props: ['type', 'id', 'name', 'placeholder']
                    }
                }
            }
        })

        await wrapper.find('#login-email').setValue('test@example.com')
        await wrapper.find('#login-password').setValue('secret123')
        await wrapper.find('#login-form').trigger('submit')

        expect(mocks.signInWithPasswordMock).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'secret123'
        })
    })

    it('sends mail, password and name from register-form to supabase', async () => {
        mocks.signInWithPasswordMock.mockResolvedValueOnce({
            data: {
                user: {
                    email: 'test@example.com'
                }
            },
            error: null
        })

        const wrapper = mount(LoginPage, {
            global: {
                stubs: {
                    IconPlantjar: true,
                    ElementButtonSecondary: {
                        template: '<button type="button" @click="$emit(\'click\')">{{ buttonText }}</button>',
                        props: ['buttonText', 'state']
                    },
                    ElementButtonPrimary: {
                        template: '<button :type="type">{{ buttonText }}</button>',
                        props: ['buttonText', 'type']
                    },
                    FormInput: {
                        template: '<input :type="type" :id="id" :name="name" :placeholder="placeholder" />',
                        props: ['type', 'id', 'name', 'placeholder']
                    }
                }
            }
        })

        await wrapper.find('[datatestid="register-button"]').trigger('click')

        expect(wrapper.find('#register-form').exists()).toBe(true)
        expect(wrapper.find('#login-form').exists()).toBe(false)

        await wrapper.find('#register-email').setValue('test@example.com')
        await wrapper.find('#register-password').setValue('secret123')
        await wrapper.find('#register-display-name').setValue('Test User')
        await wrapper.find('#register-form').trigger('submit')

        expect(mocks.signInWithPasswordMock).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'secret123'
        })
    })
})