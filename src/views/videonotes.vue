<template>
    <div class="pesan">
        <img src="/src/assets/whitetext.png" class="foto">
        <h1>Welcome</h1>
        <h3>Parking experience a lot easier</h3>
        <button @click="redirect" class="btn btn-primary">Reserve Parking</button>
    </div>
    
</template>

<script>
import router from "../router"
export default {
    methods: {
        redirect(){
            router.push({name : 'decide'})
    }}
}
</script>

<style scoped>
img{
    width: 35%;
    height: auto;
}

.pesan h1{
    margin-top: 2%;
    margin-bottom: 2%;
    font-size: 80px;
    font-family: 'Inter-ExtraBold';
}

.pesan h3{
    margin-top: 3%;
    margin-bottom: 3%;
    font-family: 'Inter-Medium';
}

.pesan button{
    font-family: 'Inter-SemiBold';
}

.pesan{
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
}
</style>