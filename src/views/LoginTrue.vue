<template>
    <div class="tengah" >
        <div class="kotak" v-if="render">
            <div class="main">

                <div class="main1">
                    <img src="@/assets/bluetext.png" class="mainlogo">
                </div>

                <div class="main2">
                    <h4>Account</h4>
                </div>
                
            </div>

            <div class="whiteborder">
                <div id="details">
                    <label>Welcome, {{ displayname }}</label>
                </div>

                <div id="details">
                    <button type="button" class="btn btn-danger" @click="user_logout" v-if="state">Logout</button>
                </div>
            </div>
           
        </div>
    </div>
</template>

<script>
import { logout, getemail, checkstate } from './func/all';
import { getDocs, query, collection, where} from "firebase/firestore";
import {db} from'./func/firedata'
export default {

    data() {
        return {
            displayname : "",
            user_email : "",
            state : false,
            render : false
        }
    },

    methods: {
        user_logout(){
            logout()
        },

        loginstate(){
            this.state = checkstate()
        },
        async getName(email) {
            const userdataRef = collection(db, "userdata");
            const q = query(userdataRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                this.displayname = doc.data().nama
            });
            this.render = true
        },


    },

    mounted() {
        this.loginstate()
        this.getName(getemail())
    },
}
</script>

<style scoped>
.main{
    margin-bottom: 3%;
}

.tengah {
    display: flex;
    justify-content: center;
}

.main2 h4{
    font-family: 'Inter-ExtraBold';
}
.whiteborder{
    background: white;
    border-radius: 3%;
    padding: 2%;
}

.kotak{
    margin-top: 30px;
    width: 410px;
    background-color: #F1F6F9;
    padding: 20px;
    border-radius: 8px;
}

.main1 {
    display: flex;
    justify-content: center;
    align-self: center
}

#details {
    display: flex;
    justify-content: center;
    align-self: center;
    margin-top: 5%;
    margin-bottom: 5%
}

#details label{
    font-size: 20px;
    font-family: 'Inter-Medium';
}

#details button{
    font-family: 'Inter-SemiBold';
}
</style>