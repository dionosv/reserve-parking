<template>
  <div class="center" v-if="state">
    <table>
        <thead>
            <th>Email</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>DOB</th>
        </thead>
        <tbody>
            <tr v-for="user in userdata" :key="user.id">
                <td>{{ user.email }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.nama }}</td>
                <td>{{ user.tgl_lahir }}</td>
            </tr>
            
        </tbody>
    </table>
</div>
</template>

<script>
import {db} from './func/firedata'
import { getDocs, query, collection} from "firebase/firestore";
import { getemail } from './func/all';
import router from '../router'


export default {
    data() {
        return {
            userdata : [],
            state :false
        }
    },

    mounted() {
        this.validate_admin()
    },
    methods: {
        async getdata() {
            const q = query(collection(db, "userdata"))
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                this.userdata.push(doc.data())
            });
        },

        validate_admin(){
            const email =  getemail()
            if(email === "dion.hananto@binus.ac.id" || email === "admin@admin.com"){
                this.state = true
                this.getdata();
            }

            else{
                router.push({name : 'home'})
            }
        }
    },

}
</script>

<style>
.tengah table{
    display: flex;
    justify-content: center;
    align-self: center
}

</style>