<template>
<div class="center" v-if="state">
    
</div>
</template>

<script>
import {db} from './func/firedata'
import { getDocs, query, collection} from "firebase/firestore";
import { getemail } from './func/all';
import router from '../router'
import viewqr from './viewqr.vue';


export default {
components : {viewqr, checkin},

    data() {
        return {

            state :false
        }
    },

    mounted() {
        this.validate_admin()
    },
    methods: {


        validate_admin(){
            const email =  getemail()
            if(email === "dion.hananto@binus.ac.id" || email === "admin@admin.com"){
                this.state = true
                this.getdata();
            }
            else{
                router.push({name : 'home'})
            }
        }
    },

}
</script>

<style>
.tengah table{
    display: flex;
    justify-content: center;
    align-self: center
}

</style>