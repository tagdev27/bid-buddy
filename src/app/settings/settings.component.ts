import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { RoleUsers } from "../models/role.users";
import { AdminUsers } from "../models/admin.users";
import { AdminUsersService } from "../services/admin-users.service";
import { AppConfig } from "../services/global.service";
import * as firebase from "firebase";
import swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { OverlayService } from '../overlay/overlay.module';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.module';
import { Merchants } from '../models/merchant';

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  focus1: any
  public tableData1: TableData;
  public tableData2: TableData;
  private adminService = new AdminUsersService();
  roles: RoleUsers[] = []
  config = new AppConfig()
  data: string[][] = [];
  data2: string[][] = [];
  closeResult = ''

  isAddRole = true
  currentRole: any = []
  accountRole: string = ''
  currentUserEmail = ''
  business_owner = ''
  current_user_role = ''

  display_users = true

  button_pressed = false

  isMerchantAccount = false
  merchant_total_users = 0
  merchant_current_number_of_users = 0

  @ViewChild('role', { static: false }) private roleContainer: ElementRef;
  @ViewChild('user', { static: false }) private userContainer: ElementRef;

  constructor(private modalService: NgbModal, private router: Router, private previewProgressSpinner: OverlayService, private cdr: ChangeDetectorRef) {
    this.tableData1 = {
      headerRow: ['#', 'Name', 'Access Levels', 'Actions'],
      dataRows: this.data
    };
    this.tableData2 = {
      headerRow: ['#', 'Dp', 'Name', 'Email Address', 'Position', 'Role', 'Blocked', 'Business Owner', 'Actions'],
      dataRows: this.data2
    };
  }

  getRoles() {
    firebase.firestore().collection('db').doc('bidbuddy').collection('roles').onSnapshot(query => {
      this.data = []
      this.roles = []
      var index = 0
      query.forEach(data => {
        const role = <RoleUsers>data.data()
        this.roles.push(role)
        this.data.push([`${index + 1}`, role.id, role.name, role.access_levels, 'btn-link'])
        index = index + 1
      })
      this.tableData1 = {
        headerRow: ['#', 'Name', 'Access Levels', 'Actions'],
        dataRows: this.data
      };
    });
  }

  getUsers() {
    if (this.current_user_role == 'Merchant') {
      firebase.firestore().collection('db').doc('bidbuddy').collection('users').where('business_owner', '==', this.business_owner).onSnapshot(query => {
        this.data2 = []
        var index = 0
        query.forEach(async data => {
          const user = <AdminUsers>data.data()
          var business_owner = user.business_owner
          if (user.role == 'Merchant') {
            this.isMerchantAccount = true
            const m = await this.getMerchant(user.business_owner)
            this.merchant_total_users = m.total_users
            business_owner = m.business_name
          }
          this.data2.push([`${index + 1}`, user.image, user.id, user.name, user.email, user.position, user.role, user.access_levels, `${user.blocked}`, business_owner, 'btn-link'])
          index = index + 1
        })
        this.merchant_current_number_of_users = query.size - 1
        this.tableData2 = {
          headerRow: ['#', 'Dp', 'Name', 'Email Address', 'Position', 'Role', 'Blocked', 'Business Owner', 'Actions'],
          dataRows: this.data2
        };
      });
      return
    }
    firebase.firestore().collection('db').doc('bidbuddy').collection('users').onSnapshot(query => {
      this.data2 = []
      var index = 0
      query.forEach(async data => {
        const user = <AdminUsers>data.data()
        var business_owner = user.business_owner
        if (user.role == 'Merchant') {
          this.isMerchantAccount = true
          const m = await this.getMerchant(user.business_owner)
          business_owner = m.business_name
        }
        this.data2.push([`${index + 1}`, user.image, user.id, user.name, user.email, user.position, user.role, user.access_levels, `${user.blocked}`, business_owner, 'btn-link'])
        index = index + 1
      })
      this.tableData2 = {
        headerRow: ['#', 'Dp', 'Name', 'Email Address', 'Position', 'Role', 'Blocked', 'Business Owner', 'Actions'],
        dataRows: this.data2
      };
    });
  }

  getCurrentUser() {
    const email = localStorage.getItem('email')
    firebase.firestore().collection('db').doc('bidbuddy').collection('users').doc(email).get().then(u => {
      const user = <AdminUsers>u.data()
      if (user.role == 'Merchant') {
        this.isMerchantAccount = true
      }
      this.business_owner = user.business_owner
      this.current_user_role = user.role
    })
  }

  async getMerchant(business_owner: string) {
    const merchantStore = await firebase.firestore().collection('db').doc('bidbuddy').collection('merchants').doc(business_owner).get()
    const getMerchant = <Merchants>merchantStore.data()
    return getMerchant
  }

  ngOnInit() {
    this.getCurrentUser()
    this.getRoles()
    this.getUsers()
    if(!this.isMerchantAccount){
      this.levels = [
        { value: 'Bids', viewValue: 'Bids' },
        { value: 'Customers', viewValue: 'Customers' },
        { value: 'Merchants', viewValue: 'Merchants' },
        { value: 'Reviews', viewValue: 'Reviews' },
        { value: 'Subscriptions', viewValue: 'Subscriptions' },
        { value: 'Products', viewValue: 'Products' },
        { value: 'Sales', viewValue: 'Sales' },
        { value: 'Company', viewValue: 'Company' },
        { value: 'Logs', viewValue: 'Logs' }
      ];
    }else {
      this.levels = [
        { value: 'Bids', viewValue: 'Bids' },
        // { value: 'Customers', viewValue: 'Customers' },
        // { value: 'Merchants', viewValue: 'Merchants' },
        // { value: 'Reviews', viewValue: 'Reviews' },
        // { value: 'Subscriptions', viewValue: 'Subscriptions' },
        { value: 'Products', viewValue: 'Products' },
        // { value: 'Sales', viewValue: 'Sales' },
        // { value: 'Company', viewValue: 'Company' },
        // { value: 'Logs', viewValue: 'Logs' }
      ];
    }
  }

  selectedValue: string;
  currentLevel: string[] = [];
  blocked_status: string = '';
  blocks_data = [
    { value: 'false', viewValue: 'False' },
    { value: 'true', viewValue: 'True' },
  ]

  selectTheme = 'primary';
  levels = []

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

  addUser() {
    if (this.isMerchantAccount) {
      if (this.merchant_current_number_of_users >= this.merchant_total_users) {
        this.config.displayMessage("Maximum number of users reached. Please contact admin.", false)
        return
      }
    }
    this.display_users = false
  }

  cancelAddUser() {
    this.display_users = true
  }

  registerUser() {
    const name = (<HTMLInputElement>document.getElementById("account_name")).value;
    const email = (<HTMLInputElement>document.getElementById("email")).value;
    const position = (<HTMLInputElement>document.getElementById("position")).value;
    const ar = this.accountRole
    if (name == '' || email == '' || position == '' || this.accountRole == '') {
      this.config.displayMessage("Please enter all fields", false)
      return
    }
    // if(email.search('@tac.ng') < 0){
    //   this.config.displayMessage("Invalid email address", false)
    //   return
    // }
    const searchedRole = this.roles.filter(function (item, index, array) {
      return item.name == ar;
    })
    this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent);
    const key = firebase.database().ref().push().key
    const reg_user: AdminUsers = {
      id: key,
      access_levels: searchedRole[0].access_levels,
      blocked: false,
      email: email.toLowerCase(),
      image: 'https://firebasestorage.googleapis.com/v0/b/bidbuddy-9b4de.appspot.com/o/default-avatar.png?alt=media&token=68922254-b829-4080-b23f-d18879aa0b25',
      name: name,
      position: position,
      role: this.accountRole,
      business_owner: (!this.isMerchantAccount) ? 'bidbuddy' : this.business_owner///////////
    }
    firebase.firestore().collection('db').doc('bidbuddy').collection('users').doc(email.toLowerCase()).set(reg_user).then(d => {
      this.previewProgressSpinner.close()
      this.config.displayMessage("User successfully created.", true);
      this.display_users = true
      this.accountRole = ''
    }).catch(err => {
      this.previewProgressSpinner.close()
      this.config.displayMessage(`${err}`, false);
    })
  }

  editUser(user: any) {
    // if (user[6] == 'Administrator') {
    //   this.config.displayMessage("This user can't be edited", false);
    //   return
    // }
    this.currentUserEmail = user[4]
    this.blocked_status = user[8]
    this.accountRole = user[6]
    this.cdr.detectChanges()
    setTimeout(() => {
      this.open(this.userContainer, '', '')
    })

  }

  userButtonAction() {
    if (this.accountRole == '' || this.blocked_status == '') {
      this.config.displayMessage("All fields must be filled", false)
      return
    }
    this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent);
    const ar = this.accountRole
    const searchedRole = this.roles.filter(function (item, index, array) {
      return item.name == ar;
    })
    firebase.firestore().collection('db').doc('bidbuddy').collection('users').doc(this.currentUserEmail).update({
      'blocked': (this.blocked_status == 'true') ? true : false,
      'role': ar,
      'access_levels': searchedRole[0].access_levels
    }).then(d => {
      this.previewProgressSpinner.close()
      this.modalService.dismissAll()
      this.config.displayMessage("User successfully updated.", true);
      this.accountRole = ''
      this.blocked_status = ''
      this.currentUserEmail = ''
    }).catch(err => {
      this.previewProgressSpinner.close()
      this.config.displayMessage(`${err}`, false);
    })
  }

  deleteUser(user: any) {
    // if (user[6] == 'Administrator') {
    //   this.config.displayMessage("This role can't be deleted", false);
    //   return
    // }
    const id = `${user[4]}`
    swal({
      title: 'Delete Alert',
      text: 'Are you sure about deleting this user?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        firebase.firestore().collection('db').doc('bidbuddy').collection('users').doc(id).delete().then(del => {
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

  editRole(role: any) {
    if (role[2] == 'Administrator') {
      this.config.displayMessage("This role can't be edited", false);
      return
    }
    this.isAddRole = false
    this.currentRole = role
    this.currentLevel = role[3].split(",")
    this.cdr.detectChanges()
    setTimeout(() => {
      this.open(this.roleContainer, '', '')
    })
  }

  deleteRole(id: string, role: string) {
    if (role == 'Administrator') {
      this.config.displayMessage("This role can't be deleted", false);
      return
    }
    swal({
      title: 'Delete Alert',
      text: 'Are you sure about deleting this role?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        firebase.firestore().collection('db').doc('bidbuddy').collection('roles').doc(id).delete().then(del => {
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

  addRole() {
    this.isAddRole = true
    this.currentRole = []
    this.currentLevel = []
    this.cdr.detectChanges()
    setTimeout(() => {
      this.open(this.roleContainer, '', '')
    })
  }

  roleButtonAction() {
    const role_name = (<HTMLInputElement>document.getElementById("role_name")).value;
    if (role_name == '') {
      this.config.displayMessage("Please enter the name of this role", false)
      return
    }
    if (this.currentLevel.length == 0) {
      this.config.displayMessage("Please select one or two access levels for this role", false)
      return
    }
    if (this.isAddRole) {
      this.button_pressed = true;
      const key = firebase.database().ref().push().key
      const rolePush: RoleUsers = {
        name: role_name,
        id: key,
        access_levels: this.currentLevel.join(',')
      }
      firebase.firestore().collection('db').doc('bidbuddy').collection('roles').doc(key).set(rolePush).then(d => {
        this.modalService.dismissAll()
        this.button_pressed = false
        this.isAddRole = true
        this.currentLevel = []
        this.config.displayMessage("Successfully created", true);
      }).catch(err => {
        this.config.displayMessage(`${err}`, false);
      })
    } else {
      this.button_pressed = true;
      const key = this.currentRole[1]
      const rolePush: RoleUsers = {
        name: role_name,
        id: key,
        access_levels: this.currentLevel.join(',')
      }
      firebase.firestore().collection('db').doc('bidbuddy').collection('roles').doc(key).update(rolePush).then(d => {
        this.modalService.dismissAll()
        this.button_pressed = false
        this.isAddRole = true
        this.currentLevel = []
        this.config.displayMessage("Successfully updated", true);
      }).catch(err => {
        this.config.displayMessage(`${err}`, false);
      })
    }
  }

}
