<template>
    <div class="content" v-if="render">
        <div class="greeting">
            <Transition>
                <div class="alert alert-warning" role="alert" v-if="peringatan" >
                    You're already booked a parking spot
                </div>
            </Transition>
            <h2>Hello, {{ displayname }}</h2>
            <div class="render">
                <img :src="generateqr" alt=""/>
                <h3>{{ this.id }}</h3> 
                <br>
                <div class="plat">
                    <h3>{{ this.plat1.toUpperCase() }} {{ this.plat2 }} {{ this.plat3.toUpperCase() }}</h3> 
                </div>
                <br>
                <h3>Location : {{ this.selected }}</h3>
                <br>
                <h4 v-if="timerender">valid until : {{ countdown }}</h4>
                <Transition>
                    <div class="tengah">
                        <button type="button" class="btn btn-danger" @click="c1" v-if="!cancelx">Cancel Booking</button>
                    </div>
                </Transition>

                <Transition>
                    <div class="reallycancel" v-if="cancelx">
                        Are you really want to cancel this booking ?
                        <div class="centerbtn">
                            <button type="button" class="btn btn-danger" @click="c2">Yes</button>
                            <button type="button" class="btn btn-secondary" @click="c1">No</button>
                        </div>
                    </div>
                </Transition>

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
import QRious from 'qrious';
import { add_car, getemail, getuserid } from './func/all';
import { getDocs, query, collection, where,doc, updateDoc} from "firebase/firestore";
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
            trender:false,
            qrcode: new QRious({ size: 200 }),
            textColor:"black",
            msk:true,
            selected:null,
            countdown: null,
            peringatan : true,
            time : null,
            countdown : 0,
            timerender : false,
            cancelx:false,
            slotid : null,
            slot : 0,
            pending : 0
        }
    },

    computed: {
        generateqr() {
            this.qrcode.value = "https://reserve-parking.vercel.app/park/"+this.id
            return this.qrcode.toDataURL();
        },
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
                this.selected = doc.data().parking_detail.location
                this.time = doc.data().parking_detail.last_accessed
                this.id = doc.id
            });
            this.render = true
            this.startCountdown()
        },

        async minus_slot(){
            const userdataRef = collection(db, "location");
            const q = query(userdataRef, where("nama", "==", this.selected));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                this.slot = doc.data().slot
                this.pending = doc.data().pending
                this.slotid = doc.id
            });
            const tmp2 = doc(db, "location", this.slotid);
            await updateDoc(tmp2, {
                pending : this.pending - 1,
                slot : this.slot + 1,
            });
        },

        async cancel(){
            const tmp = doc(db, "userdata", getuserid());
            await updateDoc(tmp, {
                parking_detail:{
                    parking_status : 4
                }
            });
            await add_car(this.selected)
            window.location.reload();
        },

        c1(){
            this.cancelx = !this.cancelx
        },

        async c2(){
            await this.cancel();
        },

        show_alert(){
            setTimeout(() => {
               this.peringatan = false
            }, 5000);
        },
        async out_oftime(menit,detik){
            if(menit <= 0 && detik <= 0){
                await this.cancel();
            }
        },

        startCountdown() {
            const targetTime = new Date(this.time).getTime();
            const newTargetTime = new Date(targetTime + 30 * 60000).getTime();
            this.timerender = true
            setInterval(() => {
                const now = new Date().getTime();
                const distance = now - newTargetTime;
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60) * -1);
                const seconds = Math.floor((distance % (1000 * 60)) / 1000 * -1);
                this.out_oftime(minutes,seconds)
                this.countdown = `${minutes}m ${seconds}s`;
            }, 1000);
        }        
    },
    mounted() {
        this.detailprocedure(getemail())
        this.show_alert()
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

.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
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
    .reallycancel{
        width: 200px;
        font-family: 'Inter-Regular';
        text-align: center;
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
    .centerbtn{
        display: flex;
        justify-content:space-evenly;
        margin-top: 15px;
        margin-bottom: 15px;
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
    .render h4{
        font-family: 'Inter-Regular';
        font-size: 20px;
        text-align: center;
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
    .plat{
        background: black;
        border-radius: 10px;
        padding-top: 15px;
        padding-bottom: 11px;
    }

    .plat h3{
        font-family: 'Inter-Bold';
        color : white;
        font-size: 27px;
    }
    .tengah{
        margin-top: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Inter-Regular';
    }
    
}
</style>