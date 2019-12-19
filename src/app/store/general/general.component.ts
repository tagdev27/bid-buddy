import { Component, OnInit, OnDestroy } from "@angular/core";
import { AppConfig } from "src/app/services/global.service";
import * as firebase from "firebase";
import { StoreSettings } from "../../models/store";
import { OverlayService } from '../../overlay/overlay.module';
import { ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.module';


@Component({
    selector: 'app-general-cmp',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.css']
})

export class GeneralComponent implements OnInit, OnDestroy {

    ngOnDestroy() {

    }

    constructor(private previewProgressSpinner: OverlayService) {

    }

    min_sub: number = 0
    unlimited: number = 0
    delivery: number = 0
    bidvalue: number = 0
    commission: number = 0
    // desc: string = ''
    // facebook: string = ''
    // instagram: string = ''
    // twitter: string = ''
    // stock_level:number = 0

    settings: StoreSettings

    config = new AppConfig()

    ngOnInit() {
        this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent);
        firebase.firestore().collection('db').doc('bidbuddy').collection('settings').doc('general').get().then(snap => {
            this.previewProgressSpinner.close()
            if (!snap.exists) {
                return
            }
            this.settings = <StoreSettings>snap.data()
            this.min_sub = this.settings.min_sub
            this.unlimited = this.settings.unlimited
            this.delivery = this.settings.delivery
            this.bidvalue = this.settings.bidvalue
            this.commission = this.settings.commission
            // this.desc = this.settings.description
            // this.facebook = this.settings.facebook_url
            // this.instagram = this.settings.instagram_url
            // this.twitter = this.settings.twitter_url
            // this.stock_level = this.settings.stock_level
        })
    }

    setAbout() {
        if (this.delivery == 0 || this.bidvalue == 0 || this.unlimited == 0 || this.min_sub == 0 || this.commission == 0) {
            this.config.displayMessage("Please all fields are required.", false)
            return
        }
        const current_email = localStorage.getItem('email')
        const current_name = localStorage.getItem('name')
        this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent);
        const setting: StoreSettings = {
            min_sub: this.min_sub,
            unlimited: this.unlimited,
            delivery: this.delivery,
            bidvalue: this.bidvalue,
            commission: this.commission
        }
        firebase.firestore().collection('db').doc('bidbuddy').collection('settings').doc('general').set(setting).then(snap => {
            this.config.logActivity(`${current_name}|${current_email} edited general settings`)
            this.previewProgressSpinner.close()
            this.config.displayMessage("Settings saved", true)
        }).catch(err => {
            this.previewProgressSpinner.close()
            this.config.displayMessage(`${err}`, false)
        })
    }
}