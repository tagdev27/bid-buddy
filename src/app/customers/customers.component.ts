import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import * as firebase from "firebase";
import { Users } from '../models/users';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OverlayService } from '../overlay/overlay.module';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.module';
import { AppConfig } from '../services/global.service';
import swal from 'sweetalert2';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'app-customers-cmp',
  templateUrl: 'customers.component.html',
  styleUrls: ['./customers.component.css']
})

export class CustomersComponent implements OnInit {

  public dataTable: DataTable;
  data: string[][] = []
  users: Users[] = []
  config = new AppConfig()
  blocked_value = ''
  current_user: Users
  closeResult = ''

  blocks_data = [
    { value: 'false', viewValue: 'False' },
    { value: 'true', viewValue: 'True' },
  ]

  ngOnInit() {
    this.getUsers()
  }

  @ViewChild('user', { static: false }) private userContainer: ElementRef;

  constructor(private modalService: NgbModal, private previewProgressSpinner: OverlayService) {
  }

  getUsers() {
    firebase.firestore().collection('customers').onSnapshot(query => {
      this.data = []
      this.users = []
      var amount = ''
      var bonus_amount = ''
      var data_index = 0
      var index = 1
      query.forEach(data => {
        const user = <Users>data.data()
        this.users.push(user)
        if(user.bid_tokens != null){
          amount = `₦${user.bid_tokens['amount']}`
          bonus_amount = `₦${user.bid_tokens['bonus']}`
        }
        this.data.push([`${index}`, user.fullName, user.email, user.phone, amount, bonus_amount, user.location, user.gender, user.dob, `${user.blocked}`, user.referral_code, user.created_date, 'btn-link', `${data_index}`])
        index = index + 1
        data_index = data_index + 1
      })
      this.dataTable = {
        headerRow: ['ID', 'Username', 'Email Address', 'Phone Number', 'Actual Current Balance', 'Bonus Balance', 'Location', 'Gender', 'DOB', 'Blocked', 'Referral Code', 'Created Date'],
        footerRow: ['ID', 'Username', 'Email Address', 'Phone Number', 'Actual Current Balance', 'Bonus Balance', 'Location', 'Gender', 'DOB', 'Blocked', 'Referral Code', 'Created Date'],
        dataRows: this.data
      };
    });
  }

  deleteUser(_id: any) {
    const id = `${this.users[Number(_id)].email}`
    const name = `${this.users[Number(_id)].id}`
    swal({
        title: 'Delete Alert',
        text: 'Are you sure about deleting this customer?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
        confirmButtonClass: "btn btn-success",
        cancelButtonClass: "btn btn-danger",
        buttonsStyling: false
    }).then((result) => {
        if (result.value) {
            firebase.firestore().collection('customers').doc(id).delete().then(del => {
                const current_email = localStorage.getItem('email')
                const current_name = localStorage.getItem('name')
                this.config.logActivity(`${current_name}|${current_email} deleted this customer: ${name}`)
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

  editUser(_id: any) {
    this.current_user = this.users[_id]
    this.blocked_value = `${this.users[_id].blocked}`
    this.open(this.userContainer, '', '')
  }

  userButtonAction() {
    this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent);
    firebase.firestore().collection('customers').doc(this.current_user.email).update({
      'blocked': (this.blocked_value == 'true') ? true : false
    }).then(d => {
      const current_email = localStorage.getItem('email')
      const current_name = localStorage.getItem('name')
      this.config.logActivity(`${current_name}|${current_email} updated this customer: ${this.current_user.fullName}`)
      this.previewProgressSpinner.close()
      this.modalService.dismissAll()
      this.config.displayMessage("Customer successfully updated.", true);
      this.blocked_value = ''
    }).catch(err => {
      this.previewProgressSpinner.close()
      this.config.displayMessage(`${err}`, false);
    })
  }

  open(content, type, modalDimension) {
    if (modalDimension === 'sm' && type === 'modal_mini') {
      this.modalService.open(content, { windowClass: 'modal-mini', size: 'sm', centered: true }).result.then((result) => {
        this.closeResult = 'Closed with: $result';
      }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
      });
    } else if (modalDimension === '' && type === 'Notification') {
      this.modalService.open(content, { windowClass: 'modal-danger', centered: true }).result.then((result) => {
        this.closeResult = 'Closed with: $result';
      }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
      });
    } else {
      this.modalService.open(content, { centered: true }).result.then((result) => {
        this.closeResult = 'Closed with: $result';
      }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
      });
    }
  }

  ngAfterViewInit() {
    (<any>$('#datatables')).DataTable({
      "pagingType": "full_numbers",
      "lengthMenu": [
        [10, 25, 50, -1],
        [10, 25, 50, "All"]
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
      }

    });

    const table = (<any>$('#datatables')).DataTable();

    $('.card .material-datatables label').addClass('form-group');
  }
}
