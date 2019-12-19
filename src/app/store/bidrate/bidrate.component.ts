import { Component, OnInit, OnDestroy } from "@angular/core";
import * as firebase from "firebase";
import { AppConfig } from "../../services/global.service";
import { config } from "rxjs";
import { OverlayService } from '../../overlay/overlay.module';
import swal from "sweetalert2";
import { ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.module';
import { BidRate } from "src/app/models/bidvalue";

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'app-bidrate-cmp',
    templateUrl: './bidrate.component.html',
    styleUrls: ['./bidrate.component.css']
})

export class BidRateComponent implements OnInit, OnDestroy {

    public tableData1: TableData;
    bidrates: BidRate[] = []
    config = new AppConfig()
    data: string[][] = [];
    closeResult = ''

    isAddEdit = false
    isAddCurrency = true
    bName = ''
    bSwipe = 0
    bValue = 0
    currentCurrent: any

    constructor(private previewProgressSpinner: OverlayService){
        this.tableData1 = {
            headerRow: ['#', 'Name', 'Swipe Number', 'Swipe Value', 'Created Date', 'Modified Date', 'Actions'],
            dataRows: this.data
        };
    }

    getBidRates() {
        firebase.firestore().collection('db').doc('bidbuddy').collection('bidrate').onSnapshot(query => {
            this.data = []
            this.bidrates = []
            var index = 0
            query.forEach(data => {
                const br = <BidRate>data.data()
                this.bidrates.push(br)
                this.data.push([`${index + 1}`, br.bid_rate_id, br.bid_rate_name, `${br.bid_rate_swipe_number} swipes`, `₦${br.bid_rate_swipe_value}`, br.created_date, br.modified_date, 'btn-link'])
                index = index + 1
            })
            this.tableData1 = {
                headerRow: ['#', 'Name', 'Swipe Number', 'Swipe Value', 'Created Date', 'Modified Date', 'Actions'],
                dataRows: this.data
            };
        });
    }

    ngOnDestroy() {

    }

    ngOnInit() {
        this.getBidRates()
    }

    addCurrency() {
        this.isAddEdit = true
    }

    cancelCurrency() {
        this.isAddEdit = false
        this.clearFields()
    }

    clearFields() {
        this.bName = ''
        this.bSwipe = 0
        this.bValue = 0
    }

    editCurr(curr: any) {
        this.currentCurrent = curr
        this.bName = curr[2]
        this.bSwipe = curr[3]
        this.bValue = curr[4]
        this.isAddCurrency = false
        this.isAddEdit = true
    }

    deleteCurr(curr: any) {
        const id = `${curr[1]}`
        swal({
            title: 'Delete Alert',
            text: 'Are you sure about deleting this bidrate?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                firebase.firestore().collection('db').doc('bidbuddy').collection('bidrate').doc(id).delete().then(del => {
                    const current_email = localStorage.getItem('email')
                    const current_name = localStorage.getItem('name')
                    this.config.logActivity(`${current_name}|${current_email} deleted this bidrate: ${curr[2]}`)
                    this.config.displayMessage("Successfully deleted", true);
                }).catch(err => {
                    this.config.displayMessage(`${err}`, false);
                })
            } else {
                swal({
                    title: 'Cancelled',
                    text: 'Deletion not successful',
                    type: 'error',
                    confirmButtonClass: "btn btn-info",
                    buttonsStyling: false
                }).catch(swal.noop)
            }
        })
    }

    submitCurrency() {
        if (this.bName == '' || this.bSwipe == 0 || this.bValue == 0) {
            this.config.displayMessage("Please enter all fields.", false)
            return
        }
        this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent);
        const current_email = localStorage.getItem('email')
        const current_name = localStorage.getItem('name')
        if (this.isAddCurrency) {
            const id = firebase.database().ref().push().key
            const newCurr: BidRate = {
                bid_rate_id: id,
                created_by: `${current_name}|${current_email}`,
                created_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
                modified_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
                bid_rate_name: this.bName,
                bid_rate_swipe_number: this.bSwipe,
                bid_rate_swipe_value: this.bValue
            }
            firebase.firestore().collection('db').doc('bidbuddy').collection('bidrate').doc(id).set(newCurr).then(del => {
                this.config.logActivity(`${current_name}|${current_email} created this bidrate: ${this.bName}`)
                this.previewProgressSpinner.close()
                this.clearFields()
                this.config.displayMessage("Successfully created", true);
                this.isAddEdit = false
                this.isAddCurrency = true
            }).catch(err => {
                this.previewProgressSpinner.close()
                this.config.displayMessage(`${err}`, false);
            })
        } else {
            firebase.firestore().collection('db').doc('bidbuddy').collection('bidrate').doc(this.currentCurrent[1]).update({
                'modified_date': `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
                bid_rate_name: this.bName,
                bid_rate_swipe_number: Number(this.bSwipe),
                bid_rate_swipe_value: Number(this.bValue)
            }).then(del => {
                this.config.logActivity(`${current_name}|${current_email} updated this bidrate: ${this.bName}`)
                this.previewProgressSpinner.close()
                this.clearFields()
                this.config.displayMessage("Successfully updated", true);
                this.isAddEdit = false
                this.isAddCurrency = true
            }).catch(err => {
                this.previewProgressSpinner.close()
                this.config.displayMessage(`${err}`, false);
            })
        }
    }
}