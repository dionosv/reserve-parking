<template>
<bodydetail v-if="!alreadyinputdata"></bodydetail>
</template>

<script>
import { checkstate, getemail } from './func/all';
import { getDocs, query, collection, where} from "firebase/firestore";
import {db} from'./func/firedata'
import router from "../router"
import bodydetail from './bodydetail.vue';
export default {
    components : {bodydetail},
    data() {
        return {
            displayname : 'User',
            alreadyinputdata : false
        }
    },
    methods: {
        async detailprocedure(email) {
            const userdataRef = collection(db, "userdata");
            const q = query(userdataRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                this.alreadyinputdata = doc.data().detaildata
            });
        },

        procedure1(){
            if(checkstate()){
                this.detailprocedure(getemail())
            }
            else{
                router.push({name : 'Account'})
            }
        }


    },
    mounted() {
        this.procedure1()
    },
}
</script>

<style>

</style>