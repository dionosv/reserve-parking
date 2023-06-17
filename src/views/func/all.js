import {getAuth, signOut ,signInWithEmailAndPassword} from "firebase/auth"
import { getDocs, query, collection, where,doc, updateDoc} from "firebase/firestore";
import {db} from'./firedata';
import router from '@/router'

export function logout(){
    signOut(getAuth()).then(()=>{
        localStorage.clear()
        location.reload()
    }).catch((error) => {
        alert(error)
    })
}

export function getemail() {
    if(checkstate() == true){
        const{email, userID, logintime} = JSON.parse(localStorage.getItem('SessionDetail'))
        return email
    }
    else return "Not logged in"
}

export function getuserid() {
    if(checkstate() == true){
        const{email, userID, logintime} = JSON.parse(localStorage.getItem('SessionDetail'))
        return userID
    }
    else return "Not logged in"
}

export function checkstate() {
    const loginstate = localStorage.getItem('SessionDetail')
    if(loginstate != null){
        const{ email, userID, logintime } = JSON.parse(loginstate)

        if(email){
            const currentDate = new Date()
            const dateObject = new Date(logintime)
            const diff = currentDate.getTime() - dateObject.getTime()
            const hours = diff / 3600000

            if(hours > 3){
                logout()
                return false
            }
            // kalau kurang dari 3 jam masih bisa / true
            else if(hours <3){
                return true
            }
        }
        // kalau email tidak terdeteksi itu false
        else return false 
    }

    // jika loginstate adalah null 
    else{
        return false
    }
       
}



export async function login(email, pw){
    try{
        await signInWithEmailAndPassword(getAuth(), email, pw)        
        return {
            status : true,
            msg : null
        }
    }
    catch(e){
        return{
            status : false,
            msg : e.message.slice(9,)
        }

    }
}

export function savestate(email,xid){
    const detail = { email : email, userID : xid, logintime : new Date().toISOString()}
    localStorage.setItem('SessionDetail', JSON.stringify(detail))
}
export async function getdata(){
    const querySnapshot = await getDocs(collection(db, "userdata"));
    querySnapshot.forEach((doc) => {
    console.log(doc.username, " => ", doc.data());
    });
}

export async function add_car(location){
        var slotx
        var pendingx 
        var slotid

        const userdataRef = collection(db, "location");
        const q = query(userdataRef, where("nama", "==", location));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            slotx = doc.data().slot
            pendingx = doc.data().pending
            slotid = doc.id
        });
        const tmp2 = doc(db, "location", slotid);
        await updateDoc(tmp2, {
            pending : pendingx - 1,
            slot : slotx + 1,
        });
}