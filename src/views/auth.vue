<template>
        <Login v-if="condition"></Login>
        <Signup v-else></Signup>
<div class="middle">
    <label class="signuptxt"><a href="#" @click="changestate">{{tmp1}}</a> {{ tmp2 }}</label>
</div>
</template>

<script>
import Login from './Login.vue'
import Signup from './Signup.vue'

export default {
    components : {Login, Signup},
    data() {
        return {
            condition : true,
            tmp1 : "Sign Up",
            tmp2 : "if you don't have an account"
        }
    },
    methods: {
        changestate(){
            if(this.condition){
                this.tmp1="Sign In"
                this.tmp2="if you already have an account"
            }
            else {
                this.tmp1 = "Sign Up"
                this.tmp2 = "if you don't have an account"

            }
            this.condition = !this.condition
        },
    },

}
</script>

<style>

.middle {      
    display: flex;
    justify-content: center;
    font-family: 'Inter-SemiBold';
}

.signuptxt{
        margin-top: 1%;
        margin-bottom: 4%;
        font-size: 12px ;
    }

.signuptxt a{
        text-decoration: none;
    }

form{
    margin-top: 30px;
    width: 410px;
    padding: 15px;
    margin-bottom: 3%;
    border-radius: 25px;
    background: linear-gradient(155deg, #ffffff, #d4dee4);
    box-shadow:  23px 23px 46px #c6c6c6,
             -23px -23px 46px #ffffff;
}

@media (max-width: 777px) {
    form{
        width: 330px;
    }
}
</style>