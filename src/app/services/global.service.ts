import swal from "sweetalert2";
import * as firebase from "firebase";

export class AppConfig {
    constructor(){}

    displayMessage(msg:string, success:boolean) {
        swal({
            title: msg,
            buttonsStyling: false,
            confirmButtonClass: (!success) ? "btn btn-danger" : "btn btn-success"
        }).catch(swal.noop)
    }

    logActivity(message:string) {
        const key = firebase.database().ref().push().key
        firebase.firestore().collection('db').doc('bidbuddy').collection('logs').doc(key).set({
            'id':key,
            'log':message,
            'created_date': `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
        })
    }
}