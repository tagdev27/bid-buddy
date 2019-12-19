import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from "firebase";
import { AdminUsers } from "./models/admin.users";
import { Merchants } from './models/merchant';

@Component({
    selector: 'app-my-app',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  private _router: Subscription;
  isLoggedIn: boolean = false;
  email: string = '';
  isLogout = true

  constructor(private router: Router) {
  }

  business_owner = ''
  current_user_role = ''
  isMerchantAccount = false

  checkLoggedInAccess() {
    this.email = localStorage.getItem('email');
    if (this.email == null) {
      this.email = '';
    }
    firebase.auth().onAuthStateChanged(userData => {
      if (userData) {
        this.isLoggedIn = true;
        localStorage.setItem('logged', 'true');
      } else {
        localStorage.setItem('logged', 'false');
        if (this.isLogout) {
          this.logUserOut(true)
        } else {
          this.logUserOut(false)
        }
      }
    });
  }

  checkblockeduser() {
    this.email = localStorage.getItem('email');
    if (this.email == null) {
      return
    }
    firebase.firestore().collection('db').doc('bidbuddy').collection('users').doc(this.email).onSnapshot(user => {
      const m = <AdminUsers>user.data()
      if (m != null) {
        const blocked: boolean = m.blocked
        if (blocked) {
          this.logUserOut(true)
          return
        }
        if (m.role == 'Merchant') {
          this.isMerchantAccount = true
      }
      this.business_owner = m.business_owner
      this.current_user_role = m.role
      }
    })
  }

  logUserOut(clearAll: boolean) {
    if (clearAll) {
      this.isLoggedIn = false;
      firebase.auth().signOut();
      localStorage.clear();
      this.router.navigate(['/pages/login'])
    } else {
      this.isLoggedIn = false;
      firebase.auth().signOut();
      this.router.navigate(['/pages/lock'])
    }
  }

  ngOnInit() {
    const firebaseConfig = {
      apiKey: "AIzaSyA-oWOPOWQ4IFw1UKg5nMcyzwn1SGPdLyg",
      authDomain: "bidbuddy-9b4de.firebaseapp.com",
      databaseURL: "https://bidbuddy-9b4de.firebaseio.com",
      projectId: "bidbuddy-9b4de",
      storageBucket: "bidbuddy-9b4de.appspot.com",
      messagingSenderId: "237034776770",
      appId: "1:237034776770:web:d17c494080d67b25"
    };
    firebase.initializeApp(firebaseConfig);

    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      const body = document.getElementsByTagName('body')[0];
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (body.classList.contains('modal-open')) {
        body.classList.remove('modal-open');
        modalBackdrop.remove();
      }
    });

    this.checkLoggedInAccess()
    this.checkblockeduser()
    if(this.isMerchantAccount){
      this.getMerchantInfomation()
    }
  }

  async getMerchantInfomation() {
    const getMer = await firebase.firestore().collection('db').doc('bidbuddy').collection('merchants').doc(this.business_owner).get()
    const mer = <Merchants>getMer.data()
    const status = mer.status
    const approved = mer.approved
    const plan_id = mer.subscription_id
    const payment_option = mer.payment_option
    if(approved){
      
    }
  }
}
