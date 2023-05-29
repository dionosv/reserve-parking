<template>
    <div class="content" v-if="render">
        <div class="greeting">
            <h2>Hello, {{ displayname }}</h2>
            <h3>Welcome to reserve parking</h3>
        </div>
    </div>

    <div class="avoid">
        <h2>Hello, {{ displayname }}</h2>
        <h3>This feature only available on mobile devices</h3>
        <img src="@/components/icons/mobile-app.png" alt="">
    </div>
</template>

<script>
import { getemail } from './func/all';
import { getDocs, query, collection, where} from "firebase/firestore";
import {db} from'./func/firedata'
export default {
    data() {
        return {
            displayname : 'User',
            datastate : false,
            render :false
        }
    },
    methods: {
        async detailprocedure(email) {
            const userdataRef = collection(db, "userdata");
            const q = query(userdataRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                this.displayname = doc.data().nama
                this.datastate = doc.data().detaildata
            });
            this.render = true
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
        font-size : 20px
    }

    .greeting h3{
        font-family: "Inter-Regular";
        font-size: 15px;
    }
}
</style>