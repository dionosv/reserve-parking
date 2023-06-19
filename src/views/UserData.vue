<template>
  <div class="center" v-if="state">
    <table>
        <thead>
            <th>User Id</th>
            <th>Plate</th>
            <th>Email</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>DOB</th>
            <th>Booking Status</th>
        </thead>
        <tbody>
            <tr v-for="user in userdata" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.data.dataplate.plate.plat1 }} {{ user.data.dataplate.plate.plat2 }} {{ user.data.dataplate.plate.plat3 }}</td>
                <td>{{ user.data.email }}</td>
                <td>{{ user.data.username }}</td>
                <td>{{ user.data.nama }}</td>
                <td>{{ user.data.tgl_lahir }}</td>
                <td>
                    <span v-if="user.data.parking_detail.parking_status === 1">Booked</span>
                    <span v-else-if="user.data.parking_detail.parking_status === 2">Occupied</span>
                    <span v-else-if="user.data.parking_detail.parking_status === 4">No Booking</span>
                </td>

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
            userid : [],
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
                const userDataWithId = {
                    id: doc.id,
                    data: doc.data()
                };
    this.userdata.push(userDataWithId);
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

th td{
    padding: 25px;
}

.center > table > thead > th{
    padding-left: 25px;
}

.center > table > tbody> tr> td{
    padding-left: 25px;
}


</style>