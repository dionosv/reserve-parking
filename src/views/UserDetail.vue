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
// import { getemail, getuserid } from './func/all';
import { getDoc,doc} from "firebase/firestore";
import {db} from'./func/firedata'

export default {
    
    data() {
        return {
            userid:null,
            displayname : null,
            found : false,
            currentTimestamp: null,
            place : 'A1'
        }
    },

    mounted() {
        this.userid = this.$route.params.id;
        this.detailprocedure(this.userid)
        this.updateTimestamp();
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
                console.log("Data found !")
                this.found = true
            } else {
                this.displayname = "No data"
                this.found = false
            }
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
    padding: 20px;
    font-family: 'Inter-Bold';
    font-size: 24px;
    text-align: center;
    margin-bottom: 25px;
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