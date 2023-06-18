<template>
<div class="center" v-if="state">
    <div class="media">
        <div class="kotak">
            <h2>Mall A</h2>
            <h3>Available : {{ this.slot_a }}</h3>
            <h3>Pending : {{ this.pending_a }}</h3>
            <h3>Occupied :{{ this.occ_a }}</h3>
            <h3>Profit : {{ this.money_a }}</h3>
        </div>

        <div class="kotak">
            <h2>Mall B</h2>
            <h3>Available : {{ this.slot_b }}</h3>
            <h3>Pending : {{ this.pending_b }}</h3>
            <h3>Occupied :{{ this.occ_b }}</h3>
            <h3>Profit : {{ this.money_b }}</h3>

        </div>
    </div>
    
</div>
</template>

<script>
import {db} from './func/firedata'
import { getDocs, query, collection, where} from "firebase/firestore";

import { getemail } from './func/all';
import router from '../router'
import viewqr from './viewqr.vue';


export default {
components : {viewqr},

    data() {
        return {
            slot_a : 0,
            pending_a : 0,
            occ_a : 0,
            money_a : 0,
            slot_b : 0,
            pending_b : 0,
            occ_b : 0,
            money_b : 0,
            state :false
        }
    },

    mounted() {
        this.validate_admin()
        this.starter()
    },
    methods: {


        validate_admin(){
            const email =  getemail()
            if(email === "dion.hananto@binus.ac.id" || email === "admin@admin.com"){
                this.state = true
            }
            else{
                router.push({name : 'home'})
            }
        },
        async start_data1(){
            const userdataRef = collection(db, "location");
            const q = query(userdataRef, where("nama", "==", 'Mall A'));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                this.slot_a = doc.data().slot
                this.pending_a = doc.data().pending
                this.occ_a = doc.data().occupied
                this.money_a = doc.data().money
            });
        },

        async start_data2(){
            const userdataRef = collection(db, "location");
            const q = query(userdataRef, where("nama", "==", 'Mall B'));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                this.slot_b = doc.data().slot
                this.pending_b = doc.data().pending
                this.occ_b = doc.data().occupied
                this.money_b = doc.data().money
            });
        },

        async starter(){
            await this.start_data1()
            await this.start_data2()
        }
    },

}
</script>

<style>
.media{
    display: flex;
  justify-content: center;
  align-items: center;
}

.kotak{
    margin: 25px;
}

.kotak h2{
    font-family: 'Inter-Bold';
}

.kotak h3{
    font-family: 'Inter-Regular';
}

</style>