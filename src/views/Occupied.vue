<template>
  <div class="tengah">
    <h2>Hello, {{ this.displayname }}</h2>
    <h4>You already check in Reserve Parking</h4>
    <div class="detailsparkir">
        <h3>{{ this.id }}</h3>
        <h3>Plate : {{ this.plat1 }} {{ this.plat2 }} {{ this.plat3 }}</h3>
        <h3>Location : {{ this.selected }}</h3>
        <h3>{{ this.countdown }}</h3>
        <h3>Rp {{ this.harga }}</h3>
    </div>
    
    <div class="payment">
        <h3 :style="{ color: textColor }" >Select payment methods</h3>
        <select name="" id="" v-model="pilihan">
            <option>Go Pay</option>
            <option>Bank </option>
        </select>
    </div>
    <button type="button" class="btn btn-danger" v-if="btn" @click="trigger_notif">Check Out</button>
    <Transition>
        <div class="alert alert-success" role="alert" v-if="pay" >
            Payment Rp {{ this.harga }} using {{ this.pilihan }} successfull !
        </div>
    </Transition>


  </div>

  <div class="avoid">
        <h2>Hello, {{ displayname }}</h2>
        <h3>This feature only available on mobile devices</h3>
        <img src="@/components/icons/mobile-app.png" alt="">
    </div>

</template>

<script>
import { add_car, getemail, getuserid } from './func/all';
import { getDocs, query, collection, where,doc, updateDoc} from "firebase/firestore";
import {db} from'./func/firedata'

export default {
    data() {
        return {
            displayname : null,
            id : null,
            plat1 : null,
            plat2 : null,
            plat3 : null,
            selected : null,
            time : null,
            countdown : 0,
            harga : null,
            btn : true,
            slotx : 0,
            occupiedx : 0,
            pendingx : 0,
            moneyx : 0,
            pilihan : null,
            pay : false,
            slotid : null,
            textColor : '',
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
                this.selected = doc.data().parking_detail.location
                this.time = doc.data().parking_detail.last_accessed
                this.id = doc.id
            });
            this.render = true
            this.getslot()
            this.startCountdown()

        },

        startCountdown() {
            const targetTime = new Date(this.time).getTime();
            const newTargetTime = new Date(targetTime).getTime();
            this.timerender = true
            setInterval(() => {
                const now = new Date().getTime();
                const distance = now-newTargetTime
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                this.countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                this.harga = this.hitung(days , hours);
            }, 1000);
        },

        hitung(hari, jam){
            var base = 5000 + 1000
            var rp_hari = hari * 24 * base
            var rp_jam = (jam + 1) * base
            var total = rp_hari + rp_jam
            return total
        },

        async getslot() {
            const userdataRef = collection(db, "location");
            const q = query(userdataRef, where("nama", "==", this.selected));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                this.slotx = doc.data().slot
                this.pendingx = doc.data().pending
                this.occupiedx = doc.data().occupied
                this.moneyx = doc.data().money
                this.slotid = doc.id
            });
        },

        async upload(){
            const tmp = doc(db, "userdata", getuserid());
            await updateDoc(tmp, {
                parking_detail:{
                    parking_status : 4 //1 : booked, 2 : sudah pakai , 3.cancelled
                }
            });
        },

        async upload2(){
            const tmp2 = doc(db, "location", this.slotid);
            await updateDoc(tmp2, {
                occupied : this.occupiedx - 1,
                money : this.moneyx + this.harga,
                slot : this.slotx + 1,
            });

        },

        async trigger_notif(){
            if(this.pilihan == null){
                this.textColor='red'
            }
            else{
                this.textColor='black'
                this.pay = true
                this.btn = false
                setTimeout(() => {
                this.pay = false
                    window.location.reload();
                }, 4000);

                await this.upload()
                await this.upload2()
            }
            
        }

    },

    mounted() {
        this.detailprocedure(getemail())
    },

}
</script>

<style>

.tengah {display: none;}

.avoid{
    margin-top: 5%;
    display: flex;
    align-items: center;
    flex-direction: column; 
}

.avoid img{
    width:150px;
    margin-top :20px;
    height: auto;
}

.avoid h2{
    font-family:"Inter-Bold";
}
.avoid h3{
    font-family: "Inter-Regular";
    font-size: 20px;
}

@media (max-width: 777px) {
.tengah{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 35px;
    margin-bottom: 35px;
}
.avoid{display : none;}

.detailsparkir{
    margin-top: 25px;
    margin-bottom: 15px;
    background: black;
    width: 250px;
    padding: 10px;
    border-radius: 15px;
}

.detailsparkir h3{
    color: white;
    font-size: 5px;
}

.tengah h2{
    font-family: 'Inter-Bold';
    width: 250px;
}

.tengah h4{
    font-family: 'Inter-Regular';
    font-size: 15px;
    width: 250px;
    margin-top: 5px;
}

.tengah h3{
    font-family: 'Inter-Regular';
    font-size: 16px;
}

.payment{
    margin-top: 25px;
    margin-bottom: 25px;
}

.payment h3{
    font-family: 'Inter-Regular';
    font-size: 15px;
    width: 250px;
}

.payment > select:nth-child(2){
    width: 100%;
	border: none;
	color: black;
	margin-bottom: 10px;
	margin-top: 10px;
	font-family: 'Inter-Bold';
	padding: 5px;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.alert{
    margin-top: 25px;
}

}


</style>