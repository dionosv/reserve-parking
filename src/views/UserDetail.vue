<template> 
    <div class="kotak" id="prompt" v-if="found">
        <div class="flex">
            <h4>Check in success</h4>
            <img src="@/assets/checked.png" alt="success">
        </div>
        <h2>
            {{ this.plat1 }} {{ this.plat2 }} {{ this.plat3 }}
        </h2>
        <h3>
            Name : {{ this.displayname }}
        </h3>
        <h3>Id : {{ this.userid }}</h3>
        <h3>Place : {{this.place}}</h3>
        <h3>Time : {{ currentTimestamp }}</h3>
    </div>

    <div class="kotak2" id="prompt" v-if="!found" >
        <h3>
            User Id : {{ this.userid }}
        </h3>
        <h4>
            Not found !
        </h4>
    </div>
</template>

<script>
import { getDoc,doc, getDocs, query, collection, where, updateDoc } from "firebase/firestore";

import {db} from'./func/firedata'

export default {
    
    data() {
        return {
            userid:null,
            displayname : null,
            found : false,
            currentTimestamp: null,
            place : 'Mall A',
            pendingx : 0,
            occupiedx : 0,
            slotid : null,
            slotx : 0
        }
    },

    mounted() {
        this.userid = this.$route.params.id;
        this.detailprocedure(this.userid)
        this.updateTimestamp();
        this.parking_adjustment()
        this.profile_adjustment();
    },
    methods: {
        async detailprocedure(docId) {
            const docRef = doc(db, "userdata", docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                this.displayname = docSnap.data().nama
                this.plat1 = docSnap.data().dataplate.plate.plat1
                this.plat2 = docSnap.data().dataplate.plate.plat2
                this.plat3 = docSnap.data().dataplate.plate.plat3
                this.place = docSnap.data().parking_detail.location
                this.found = true
            } else {
                this.displayname = "No data"
                this.found = false
            }
        },

        async parking_adjustment() {
            var occupied
            var pending
            var idx
            const userdataRef = collection(db, "location");
            const q = query(userdataRef, where("nama", "==", this.place));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                occupied = doc.data().occupied
                pending = doc.data().pending
                idx = doc.id
            });
            await this.update_slot(occupied,pending,idx)
        },

        async update_slot(occupiedx,pendingx,idx){
            const tmp2 = doc(db, "location", idx);
            await updateDoc(tmp2, {
                occupied : occupiedx + 1,
                pending : pendingx - 1
            });
        },

        async profile_adjustment(){
            const tmp = doc(db, "userdata", this.userid);
            await updateDoc(tmp, {
                parking_detail:{
                    parking_status : 2,
                    check_in : this.currentTimestamp
                }
            });
        },

        updateTimestamp() {
            this.currentTimestamp = new Date().toLocaleString();
        },
    },
}
</script>

<style>

#prompt{
  display: grid;
  margin: 50px;
  place-content: center;
}

#prompt h3{
    font-family: 'Inter-SemiBold';
    font-size: 18px;
}

#prompt h2{
    background: black;
    color:white;
    padding-top: 15px;
    padding-bottom: 15px;
    font-family: 'Inter-Bold';
    font-size: 27px;
    text-align: center;
    margin-bottom: 25px;
    border-radius: 10px;
}

.flex{
    display: flex;
    align-items: center;
    margin:30px;
    padding: 23px;
}



.flex img{
    height: 49px;
    width: auto;
}

.flex h4{
    font-family: 'Inter-Bold';
    font-size: 22px;
    text-align: center;
    margin-right: 20px;
}
</style>