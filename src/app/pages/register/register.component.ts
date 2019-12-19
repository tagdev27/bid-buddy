import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from "firebase";
import { AppConfig } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/models/plans';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { AdminUsers } from '../../models/admin.users';
import { OverlayService } from '../../overlay/overlay.module';
import { ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.module';
import { Merchants } from 'src/app/models/merchant';
import { } from 'googlemaps';
import { HttpClient } from '@angular/common/http';
import { MailChirmp } from 'src/app/services/newsletter';

@Component({
  selector: 'app-register-cmp',
  templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  config = new AppConfig()
  plans: Subscriptions[] = []

  business_name = ''
  business_location = ''
  phone = ''
  email = ''
  cac_number = ''
  industry = ''
  password = ''
  total_users = 1

  access_levels = ''

  industry_data = [
    { value: 'product', viewValue: 'Product' },
    { value: 'services', viewValue: 'Services' },
  ]

  selected_payment_option = 'monthly'
  isActiveSelectedPlan = ''

  clearField() {
    this.business_name = ''
    this.business_location = ''
    this.phone = ''
    this.email = ''
    this.cac_number = ''
    this.industry = ''
    this.password = ''
    this.total_users = 1
    this.isActiveSelectedPlan = ''
  }

  constructor(private previewProgressSpinner: OverlayService, private mHttp: HttpClient) { }

  initAutoComplete() {
    //console.log('i dey here')
    const locationInput = (<HTMLInputElement>document.getElementById("bisLoc"));
    //var input = document.getElementById('bisLoc')
    var autocomplete = new google.maps.places.Autocomplete(locationInput);
    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

    autocomplete.addListener('place_changed', function () {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        //return;
      }
      console.log(place.geometry.location.toJSON())
      //marker.setPosition(place.geometry.location);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
        console.log(address)
      }
    });
  }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('register-page');
    body.classList.add('off-canvas-sidebar');

    this.getPlans()
    this.getMerchantAccessLevels()
    this.initAutoComplete()
  }
  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('register-page');
    body.classList.remove('off-canvas-sidebar');
  }

  getPlans() {
    firebase.firestore().collection('db').doc('bidbuddy').collection('plans').get().then(query => {
      this.plans = []
      query.forEach(data => {
        const p = <Subscriptions>data.data()
        this.plans.push(p)
      })
    });
  }

  getMerchantAccessLevels() {
    firebase.firestore().collection('db').doc('bidbuddy').collection('roles').where("name", "==", "Merchant").get().then(role => {
      role.forEach(r => {
        const rol = r.data()
        this.access_levels = rol['access_levels']
      })
    })
  }

  optionSelection($event: NgbTabChangeEvent) {
    this.selected_payment_option = $event.nextId
  }

  planSelected(id: string) {
    this.isActiveSelectedPlan = id
  }

  async checkIfBusinessNameExists() {
    const a = await firebase.firestore().collection('db').doc('bidbuddy').collection('merchants').where('business_name', '==', this.business_name).get()
    return a.size
  }

  async SubmitClicked() {
    if (
      this.business_name == '' ||
      this.phone == '' ||
      this.email == '' ||
      this.isActiveSelectedPlan == '' ||
      this.cac_number == '' ||
      this.total_users == 0 ||
      this.industry == '' || this.password == '' || this.selected_payment_option == ''
    ) {
      this.config.displayMessage("All fields marked with * are required", false)
      return
    }
    const size = await this.checkIfBusinessNameExists()
    if (size > 0) {
      this.config.displayMessage("Sorry, business name already exists. Try another name", false)
      return
    }
    this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent);
    firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(d => {
      const key = firebase.database().ref().push().key
      const current_email = this.email
      const current_name = this.business_name
      const merchant: Merchants = {
        id: key,
        business_name: this.business_name,
        business_location: this.business_location,
        phone: this.phone,
        email: this.email.toLowerCase(),
        subscription_id: this.isActiveSelectedPlan,
        payment_option: this.selected_payment_option,
        total_users: this.total_users,
        cac_number: this.cac_number,
        industry: this.industry,
        approved: false,
        status: 'in-active',
        created_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        created_by: `${current_name}|${current_email}`,
        modified_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
      }
      firebase.firestore().collection('db').doc('bidbuddy').collection('merchants').doc(key).set(merchant).then(d => {
        const add_merchat_to_admin_user: AdminUsers = {
          id: key,
          access_levels: this.access_levels,
          blocked: false,
          email: this.email.toLowerCase(),
          image: 'https://firebasestorage.googleapis.com/v0/b/bidbuddy-9b4de.appspot.com/o/default-avatar.png?alt=media&token=68922254-b829-4080-b23f-d18879aa0b25',
          name: this.business_name,
          position: 'Merchant - Owner',
          role: 'Merchant',
          business_owner: key
        }
        firebase.firestore().collection('db').doc('bidbuddy').collection('users').doc(this.email.toLowerCase()).set(add_merchat_to_admin_user).then(async d => {
          this.config.logActivity(`${current_name}|${current_email} created this merchant: ${this.business_name}`)
          await firebase.auth().signOut()
          await this.subscribeToNewsletterAndSendEmailNotification()
          this.previewProgressSpinner.close()
          this.config.displayMessage(`Merchant account created successfully. Await approval from Admin before you can access your account.`, true);
          this.clearField()
        })
      }).catch(err => {
        this.previewProgressSpinner.close()
        this.config.displayMessage(`${err}`, false);
      })
    }).catch(err => {
      this.previewProgressSpinner.close()
      this.config.displayMessage(`${err}`, false);
    })
  }

  async subscribeToNewsletterAndSendEmailNotification() {
    var _fn = '', _ln = ''
    if (this.business_name.split(' ').length > 0) {
      _fn = this.business_name.split(' ')[0]
      _ln = this.business_name.split(' ')[1]
    } else {
      _fn = this.business_name
    }
    const htmlBody = new MailChirmp().emailHtmlBody()
    await this.mHttp.post(`https://mail.bidbuddy.app/emailsending/mailchimp.php?sender_email=${this.email}&sender_name=${this.business_name}`, {
      lat: '', lng: '', fn: _fn, ln: _ln, body: htmlBody
    }).toPromise()
  }
}
