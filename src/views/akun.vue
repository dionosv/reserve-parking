<template>
<LoginTrue v-if="akun"></LoginTrue>
<auth v-else></auth>
</template>

<script>
import { checkstate } from './func/all'
import LoginTrue from './LoginTrue.vue'
import auth from './auth.vue'
export default {
    components : {LoginTrue, auth},

    data() {
        return {
            akun : false
        }
    },
    methods: {
        loginstate(){
            this.akun = checkstate()
        }
    },
    mounted() {
        this.loginstate()
    },
}
</script>

<style>

</style>