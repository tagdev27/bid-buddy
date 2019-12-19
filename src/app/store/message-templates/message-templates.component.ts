import { Component, OnInit, OnDestroy } from "@angular/core";
import { Currency } from "../../models/currency";
import { AppConfig } from "../../services/global.service";
import * as firebase from "firebase"
import swal from "sweetalert2";
import { OverlayService } from '../../overlay/overlay.module';
import { ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.module';
import { MainCategory } from "src/app/models/main.category";
import { SubCategory } from "src/app/models/sub.category";

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

declare interface Styles {
    id: string;
    title: string;
    image: string;
}

declare interface Messages {
    id: string;
    category: string;
    text: string;
}

@Component({
    selector: 'app-message-templates-cmp',
    templateUrl: './message-templates.component.html',
    styleUrls: ['./message-templates.component.css']
})

export class MessageTemplatesComponent implements OnInit, OnDestroy {
    public tableData2: TableData;

    messages: Messages[] = []
    config = new AppConfig()
    data2: string[][] = [];
    closeResult = ''

    isAddEdit = false
    isAdding = false
    sTitle = ''

    //messages
    card_category = [
        { value: 'email', viewValue: 'Email' },
    { value: 'sms', viewValue: 'SMS' },
    ]
    mCategory = []
    mText = ''
    isMessageAddEdit = false
    currentMessage: any

    constructor(private previewProgressSpinner: OverlayService) {
    }

    getGiftCardMessages() {
        firebase.firestore().collection('db').doc('bidbuddy').collection('template-messages').onSnapshot(query => {
            this.data2 = []
            this.messages = []
            var index = 0
            query.forEach(data => {
                const msg = <Messages>data.data()
                this.messages.push(msg)
                this.data2.push([`${index + 1}`, msg.id, msg.category, msg.text, 'btn-link'])
                index = index + 1
            })
            this.tableData2 = {
                headerRow: ['#', 'Template Category', 'Template Message', 'Actions'],
                dataRows: this.data2
            };
        });
    }

    ngOnDestroy() {

    }

    ngOnInit() {
        this.getGiftCardMessages()
    }

    addMessage() {
        this.isMessageAddEdit = true
        this.isAdding = true
    }

    cancelMessage() {
        this.isMessageAddEdit = false
        this.isAdding = false
        this.clearFields()
    }

    clearFields() {
        this.sTitle = ''
        this.mText = ''
        this.mCategory = []
    }

    editMessage(msg: any) {
        this.mCategory = `${msg[2]}`.split(',')
        this.mText = msg[3]
        this.isMessageAddEdit = true
        this.currentMessage = msg
        this.isAdding = false
    }

    deleteMessage(msg: any) {
        const id = `${msg[1]}`
        swal({
            title: 'Delete Alert',
            text: 'Are you sure about deleting this template message?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                firebase.firestore().collection('db').doc('bidbuddy').collection('template-messages').doc(id).delete().then(del => {
                    const current_email = localStorage.getItem('email')
                    const current_name = localStorage.getItem('name')
                    this.config.logActivity(`${current_name}|${current_email} deleted this template message: ${msg[3]}`)
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

    submitMessage() {
        if (this.mCategory.length == 0 || this.mText == '') {
            this.config.displayMessage("Please enter all fields.", false)
            return
        }
        if (this.mText.length > 250) {
            this.config.displayMessage("Characters should not exceed 250", false)
            return
        }
        this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent);
        const id = (this.isAdding) ? firebase.database().ref().push().key : this.currentMessage[1]
        const msg: Messages = {
            id: id,
            category: this.mCategory.join(','),
            text: this.mText
        }
        if (this.isAdding) {
            firebase.firestore().collection('db').doc('bidbuddy').collection('template-messages').doc(msg.id).set(msg).then(done => {
                const current_email = localStorage.getItem('email')
                const current_name = localStorage.getItem('name')
                this.config.logActivity(`${current_name}|${current_email} created a template message`)
                this.previewProgressSpinner.close()
                this.clearFields()
                this.config.displayMessage("Template Message saved", true)
                this.isMessageAddEdit = false
                this.isAdding = false
            }).catch(err => {
                this.previewProgressSpinner.close()
                this.config.displayMessage(`${err}`, false)
            })
        } else {
            firebase.firestore().collection('db').doc('bidbuddy').collection('template-messages').doc(msg.id).update(msg).then(done => {
                const current_email = localStorage.getItem('email')
                const current_name = localStorage.getItem('name')
                this.config.logActivity(`${current_name}|${current_email} created a template message`)
                this.previewProgressSpinner.close()
                this.clearFields()
                this.config.displayMessage("Template Message saved", true)
                this.isMessageAddEdit = false
                this.isAdding = false
            }).catch(err => {
                this.previewProgressSpinner.close()
                this.config.displayMessage(`${err}`, false)
            })
        }
    }
}