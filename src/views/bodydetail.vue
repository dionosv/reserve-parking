<template>
    <div class="content" v-if="render">
        <div class="greeting">
            <h2>Hello, {{ displayname }}</h2>
            <h4>Welcome to reserve parking</h4>
            <div class="masukan" v-if="msk">
                <h3 :style="{ color: textColor }">Vehicle number</h3>
                <div class="flexbox">
                    <input type="text" name="" id="aa" placeholder="D" v-model="plat1" :maxlength=2>
                    <input type="text" name="" id="aa" placeholder="10" v-model="plat2" :maxlength=4>
                    <input type="text" name="" id="aa" placeholder="N" v-model="plat3" :maxlength=3>
                </div>
                <h3 :style="{ color: textColor }">Parking Location</h3>
                <select v-model="selected" @change="getslot">
                    <option disabled value="">Please select one</option>
                    <option>Mall A</option>
                    <option>Mall B</option>
                </select>
                <div id="slotparkir" v-if="slotrender">
                    <h2>{{ this.slot }}</h2>
                    <h3>Available</h3>
                </div>
                <button type="button" class="btn btn-dark" v-if="!full" @click="okay">Submit</button>
        </div>           
        </div>
    </div>

    <div class="avoid">
        <h2>Hello, {{ displayname }}</h2>
        <h3>This feature only available on mobile devices</h3>
        <img src="@/components/icons/mobile-app.png" alt="">
    </div>
</template>

<script>
import { getemail, getuserid } from './func/all';
import { getDocs, query, collection, where,doc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from'./func/firedata'
export default {
    data() {
        return {
            displayname : 'User',
            render :false,
            id:null,
            plat1:null,
            plat2:null,
            plat3:null,
            btnx :true,
            textColor:"black",
            msk:true,
            selected:null,
            slot : 0,
            pending : 0,
            slotid : null,
            slotrender : false,
            full : false
        }
    },

    methods: {
        async detailprocedure(email) {
            const userdataRef = collection(db, "userdata");
            const q = query(userdataRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                this.displayname = doc.data().nama
                this.plat1 = doc.data().dataplate.plate.plat1
                this.plat2 = doc.data().dataplate.plate.plat2
                this.plat3 = doc.data().dataplate.plate.plat3
                this.id = doc.id
            });
            this.render = true
        },

        async getslot() {
            const userdataRef = collection(db, "location");
            const q = query(userdataRef, where("nama", "==", this.selected));
            
            onSnapshot(q, (snapshot) => {
                snapshot.forEach((doc) => {
                this.slot = doc.data().slot;
                this.pending = doc.data().pending;
                this.slotid = doc.id;
                });

                this.slotrender = true;

                if (this.slot <= 0) {
                this.full = true;
                } else {
                this.full = false;
                }
            });
        },
        okay(){
            if(this.plat1 != null && this.plat2 != null && this.plat3 != null && this.selected != null){
                    this.upload()
            }
            else{
                this.textColor='red'
            }
        },
        async upload(){
            const tmp = doc(db, "userdata", getuserid());
            await updateDoc(tmp, {
                dataplate:{
                    plate : {
                        plat1 : this.plat1.toUpperCase(),
                        plat2 : this.plat2.toUpperCase(),
                        plat3 : this.plat3.toUpperCase()
                    },
                },
                parking_detail:{
                    last_accessed :  new Date().toLocaleString(),
                    location : this.selected,
                    parking_status : 1 //1 : booked, 2 : sudah pakai , 3.cancelled
                }
            });

            const tmp2 = doc(db, "location", this.slotid);
            await updateDoc(tmp2, {
                pending : this.pending + 1,
                slot : this.slot - 1,
            });

            window.location.reload();
        },        
    },
    mounted() {
        this.detailprocedure(getemail())
    },
}
</script>

<style scoped>
.content {display: none;}
.avoid{
    margin-top: 5%;
    display: flex;
    align-items: center;
    flex-direction: column; 
}

.masukan{
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    flex-direction: column;
}
.avoid img{
    width:150px;
    margin-top :20px;
    height: auto;
}

.masukan select{
    border: none;
    color: black;
    margin-left: 5px;
    margin-right: 5px;
    margin-bottom: 10px;
    margin-top: 10px;
    font-family: 'Inter-Bold';
    padding: 5px;
    /* appearance: none; */
    /* white-space: nowrap; */
}

.masukan option{
    font-family: 'Inter-Bold';
}

.avoid h2{
    font-family:"Inter-Bold";
}
.avoid h3{
    font-family: "Inter-Regular";
    font-size: 20px;
}

#slotparkir{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 15px;
    margin-block: 15px;
}

#slotparkir > h2:nth-child(1){
    font-family: "Inter-SemiBold";
    font-size: 20px;
    background: black;
    color: white;
    padding: 5px;
    border-radius: 10px;
}

#slotparkir h3{
    font-family: "Inter-Regular";
    font-size: 15px;
}


@media (max-width: 777px) {

    .flexbox{
        display: flex;
        justify-content: center;  /* Align items horizontally */
        align-items: center;      /* Align items vertically */
        margin-top: 10px;
        margin-bottom: 20px;
    }

    #aa{
        margin-left: 7px;
        margin-right: 7px;
        width: 50px;
    }
    .content{display: block;}
    .avoid{display : none;}
    .square{
        width: 80px;
        height: 40px;
        border-radius: 15px;
        border-style: solid;
        border-width: 4px;
        border-color: #13386b;
        display: grid;
        place-items: center;
        color: #13386b;
    }
    .greeting img{
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .masukan btn{
        display: flex;
        justify-content: center;
    }

    .render h2{
        text-align: center;
        font-size: 10px;
        margin-top : 25px;
    }
    .allblock{
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row; 
        margin-left:  15% ;
        margin-right: 15%;
    }

    .allblock a{
        text-decoration: none;
        font-family: "Inter-Bold";
        font-size: 13px;
    }


    .render img{
        display: flex;
        justify-content: center;
        align-content: center;
    }
    .greeting{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-top: 50px;
        margin-bottom: 7%;
    }

    .greeting h2{
        font-family: "Inter-Bold";
        font-size : 25px
    }

    .greeting h3{
        font-family: "Inter-Regular";
        font-size: 15px;
        text-align: center;
    }
}
</style>