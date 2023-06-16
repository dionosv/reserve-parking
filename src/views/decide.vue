<template>
<bodydetail v-if="register"></bodydetail>
<viewqr v-if="booked"></viewqr>
</template>

<script>
import { checkstate, getemail } from './func/all';
import { getDocs, query, collection, where} from "firebase/firestore";
import {db} from'./func/firedata'
import router from "../router"
import bodydetail from './bodydetail.vue';
import viewqr from './viewqr.vue';

export default {
    components : {bodydetail , viewqr},
    data() {
        return {
            displayname : 'User',
            alreadyinputdata : false,
            status:null,
            booked : false,
            register : false,
        }
    },
    methods: {
        async detailprocedure(email) {
            const userdataRef = collection(db, "userdata");
            const q = query(userdataRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                this.alreadyinputdata = doc.data().detaildata
                this.status = doc.data().parking_detail.parking_status
            });
            this.cekstatus()
            console.log(this.status)
        },

        cekstatus(){
            if(this.status == 1) //kalau booked
            {
                this.booked = true
                this.register = false
            }

            if(this.status == 2){
                console.log("Already Parked !")
            }

            if(this.status != 1 && this.status != 2){
                this.register = true
                this.booked =false
            }
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