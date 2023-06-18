<template>

    <div class="login">
        <form @submit.prevent="publish">
            <div class="main">
                <div class="main1">
                    <img src="@/assets/bluetext.png" class="mainlogo">
                </div>
                <div class="main2">
                    <h4>{{prompt}}</h4>
                </div>
            </div>
    
               
            <div class="alert alert-danger" id="alert" role="alert" v-if="masuk.length > 0">{{masuk}}</div>
            <div class="alert alert-success" id="alert" role="alert" v-if="green.length > 0">{{green}}</div>

    
            <div class="email" id="fr">
                <label for="Email">Email</label>
                <br>
                <input type="email" name="" id="" placeholder="dion.hananto@binus.ac.id" v-model="email"> 
            </div>
    

            <div class="nama" id="fr">
                <label for="nama">Full Name</label>
                <br>
                <input type="text" name="" id="" placeholder="Dion Osvaldo Hananto" v-model="nama"> 
            </div>

            <div class="username" id="fr">
                <label for="nama">Username</label>
                <br>
                <input type="text" name="" id="" placeholder="dionosv" v-model="uname"> 
            </div>

            <div class="dob" id="fr">
                <label for="nama">Birth Date</label>
                <br>
                <input type="date" name="" id="" v-model="tgl"> 
            </div>

            <div class="pass" id="fr">
                <label for="pass">Password</label>
                <br>
                <input type="password" id="fieldpass" placeholder="banana123" v-model="pw">
            </div>

            <div class="confirmpass" id="fr">
                <label for="pass">Confirm Password</label>
                <br>
                <input type="password" id="fieldpass2" placeholder="banana123" v-model="cpw">
            </div>


            <div class="showpass" @click="showpw" oncontextmenu="return false;">
                <img src="@/assets/toogle/eye-open.svg" v-if="toogle">
                <img src="@/assets/toogle/eye-close.svg" v-else>
    
                <label>Click to {{fpass}} password </label>
            </div>
    
            <div class="tmb">
                <button type="submit" class="btn btn-primary" id="fr2">Sign Up</button>
            </div>
    
        </form>
    </div>
    </template>
    
    <script>
    import { getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
    import {db} from './func/firedata'
    import { login } from './func/all';
    import { collection, addDoc } from "firebase/firestore";
    export default {
        data() {
            return {
                prompt : "Sign Up",
                masuk : "",
                email: null,
                nama: null,
                tgl : null,
                pw : null,
                cpw : null,
                uname : null,
                toogle : true,
                fpass : "show",
                green : "",
            }
        },
        methods: {
            showpw(){
                if(this.toogle){
                    document.getElementById('fieldpass').type  = 'text'
                    document.getElementById("fieldpass2").type = 'text'

                    this.toogle = !this.toogle
                    this.fpass = 'hide'
                }
    
                else{
                    document.getElementById("fieldpass").type = 'password'
                    document.getElementById("fieldpass2").type = 'password'

                    this.toogle = !this.toogle
                    this.fpass = 'show'
                }
            },

            async db_signUp() {
                try{
                    await createUserWithEmailAndPassword(getAuth(), this.email, this.pw)
                    return {
                        status : true,
                        msg : null
                    }
                }
                catch(e){
                    return {
                        status : false,
                        msg : e.message.slice(9,)
                    }
                }
            },

            async publish(){
                const tf = this.ceksemua()
                if(tf){
                    (async () => {
                    const{status, msg} = await this.db_signUp()

                    if (status === true) {
                        const docRef = await addDoc(collection(db, "userdata"), {
                        email: this.email,
                        nama : this.nama,
                        username : this.uname,
                        tgl_lahir : this.tgl,
                        dataplate:{
                        plate : {
                            plat1 : "D",
                            plat2 : "10",
                            plat3 : "N"
                        },
                    },
                        parking_detail:{
                            parking_status : 4
                        }
                    });
                    this.green_alert("Sign Up Success, please wait redirecting to account")
                    this.signin1()
                    setTimeout(() => {
                        window.location.reload();
                    }, 6000);

                    } else {
                        this.red_alert(msg)
                    }

                    })();
                }
            },
            signin1(){
                (async () => {
                const {status, msg} = await login(this.email, this.pw);
                if (status === true) {
                    window.location.reload();
                } else {
                    this.red_alert(msg)
                }
                })();
            },

            red_alert(peringatan){
                this.masuk = peringatan
                setTimeout(() => {this.masuk = ''}, 4500);
            },

            green_alert(peringatan){
                this.green = peringatan
                setTimeout(() => {this.green = ''}, 5000);
            },

            ceksemua(){
                if(!this.email || !this.nama || !this.uname || !this.tgl || !this.pw || !this.cpw ){
                    this.red_alert('All field must be filled')
                    return false
                }

                else{
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.email)) {
                        this.red_alert('Invalid email format')
                        return false
                    }

                    if (this.nama.length < 3) {
                        this.red_alert('Full name must be at least 3 characters')
                        return false
                    }

                    if (this.uname.length < 6) {
                        this.red_alert('Username must be at least 6 characters')
                        return false
                    }


                    const today = new Date();
                    const enteredDate = new Date(this.tgl);
                    if (enteredDate > today) {
                        this.red_alert('Birth Date should not be greater than today')
                        return false
                    }

                    if (enteredDate.getFullYear() < 1900) {
                        this.red_alert('Birth Date Year cannot be lower than 1900')
                        return false
                    }

                    if (this.pw.length < 7) {
                        this.red_alert('Password must be at least 8 characters')
                        return false
                    }
                    if (this.pw !== this.cpw) {
                        this.red_alert('Password and Confirm Password do not match')
                        return false
                    }  
                    return true
                }
            },

        },
    
    }
    </script>
    
    <style>
    
    .main{
        display: flex;
        justify-content: center;
        align-self: center
    }
    
    .main2 h4{
        font-family: 'Inter-ExtraBold';
    }
    .mainlogo{
        width: auto;
        height: 30px;
        margin-right: 15px;
    
    }
    .login{
        display: flex;
        justify-content: center;
    }
        
    .showpass{
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
        font-size: 13px;
        margin-top: 5%;
        margin-bottom: 3%;
        font-family: 'Inter-Medium';
    }
    
    .showpass img{
        margin-right: 5px;
        width: 25px;
        height: auto;
    }
    
    #alert {
        margin-top: 6%;
        margin-bottom: 6%;
    }
    
    #fr{
        text-align: left;
        margin-top:3%;
        font-family: 'Inter-Bold';
    }
    
    #fr input{
        font-family: 'Inter-Medium';
        width: 100%;
        height: 40px;
        border: none;
        background-color : #ffffff; 
        border-radius: 6px;
        padding: 2%;
        margin-top: 2%;
    }
    
    #fr2{
        margin-top: 3%;
    }
    .tmb{    
        margin-top: 3%;
        display: flex;
        flex-direction: column;
        align-content: space-between;
        font-family: 'Inter-SemiBold';
    }
    </style>