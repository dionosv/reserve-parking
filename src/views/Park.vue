<template> 
<div class="all" v-if="state">
    <div class="kotak" id="prompt" v-if="found">
        <div class="flex">
            <h4>{{ this.message}}</h4>
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
        <h3>Time : {{ this.waktuparkir }}</h3>
    </div>

    <div class="kotak2" id="prompt" v-if="!found" >
        <h3>
            User Id : {{ this.userid }}
        </h3>
        <h4>
            Not found !
        </h4>
    </div>
</div>
</template>

<script>
import { getDoc,doc, getDocs, query, collection, where, updateDoc } from "firebase/firestore";
import { getemail } from './func/all';
import {db} from'./func/firedata'
import router from '../router'

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
            slotx : 0, 
            state : false,
            status : 0,
            message : 'Check In Succesfull',
            waktuparkir : '',
        }
    },

    mounted() {
        this.userid = this.$route.params.id;
        this.start_procedure()
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
                this.status = docSnap.data().parking_detail.parking_status
                this.waktuparkir =  docSnap.data().parking_detail.last_access
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

        async get_data(){
            const userdataRef = collection(db, "location");
            const q = query(userdataRef, where("nama", "==", this.place));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                occupied = doc.data().occupied
                pending = doc.data().pending
                idx = doc.id
            });

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
                    last_access : this.currentTimestamp,
                    location : this.place,
                }
            });
        },

        validate_admin(){
            const email =  getemail()
            if(email === "dion.hananto@binus.ac.id" || email === "admin@admin.com"){
                this.state = true
                return true
            }
            else{
                router.push({name : 'home'})
            }
        },
        updateTimestamp() {
            this.currentTimestamp = new Date().toLocaleString();
        },

        async start_procedure(){
            if(this.validate_admin()){
                await this.detailprocedure(this.userid)
                if(this.status == 1){
                    this.updateTimestamp();
                    this.parking_adjustment();
                    this.profile_adjustment();
                }
            }
        }
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