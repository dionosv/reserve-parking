import {getAuth, signOut ,signInWithEmailAndPassword} from "firebase/auth"
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