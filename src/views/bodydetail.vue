<template>
    <div class="content" v-if="render">
        <div class="greeting">
            <h2>Hello, {{ displayname }}</h2>
            <h4>Welcome to reserve parking</h4>
            <div class="masukan" v-if="msk">
                <h3 :style="{ color: textColor }">Input vehicle number</h3>

                <div class="flexbox">
                    <input type="text" name="" id="aa" placeholder="D" v-model="plat1" :maxlength=2>
                    <input type="text" name="" id="aa" placeholder="10" v-model="plat2" :maxlength=4>
                    <input type="text" name="" id="aa" placeholder="N" v-model="plat3" :maxlength=3>
                </div>

                <button type="button" class="btn btn-dark" @click="okay">Show barcode</button>
        </div>
            <div class="render" v-if="trender">
                <h2>Qr code</h2>
                <img :src="generateqr" alt="" v-if="trender"/>
                <h3>{{ this.id }}</h3> 
                <br>
                <h3>{{ this.plat1.toUpperCase() }} {{ this.plat2 }} {{ this.plat3.toUpperCase() }}</h3> 
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
import { getemail, getuserid } from './func/all';
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
            btnx :true,
            textColor:"black",
            msk:true
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
                this.id = doc.id
            });
            this.render = true
        },

        okay(){
            if(this.plat1 != null || this.plat2 != null || this.plat3 != null){
                this.trender = !this.trender
                this.btnx = !this.btnx
                this.msk = !this.msk
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
                    last_accessed :  new Date().toLocaleString()
                }
            });
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

.avoid h2{
    font-family:"Inter-Bold";
}
.avoid h3{
    font-family: "Inter-Regular";
    font-size: 20px;
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