import { CanActivate, ActivatedRoute } from "@angular/router";
import { AdminUsersService } from "./services/admin-users.service";

export class RouteGuard implements CanActivate {

    // /constructor(private router:ActivatedRoute){}

    service = new AdminUsersService();

    /**
     * determines if a user cann view a page depending on their level of access
     */
    async canActivate() {
        const email = localStorage.getItem('email')
        if (email == null) {
            return false
        } else {
            const p = await this.service.getUserData(email)
            //console.log(`from route = ${p.access_levels}`)
            const levels = p.access_levels.toLowerCase()
            const current_menu = window.location.href.toLowerCase().split("/")[3]

            if(p.role == 'Administrator'){
                return true
            }else{
                //console.log(`from route allow = ${this.service.isAllowedAccess(levels, current_menu)}`)
                return this.service.isAllowedAccess(levels, current_menu)
            }
        }
    }
}

export class LoginRouteGuard implements CanActivate {

    /**
     * determines if a user is logged in or not.
     */
    canActivate() {
        const email = localStorage.getItem('email')
        const logged = localStorage.getItem('logged')

        if (email == null && logged == null) {
            return true
        } else {
            return logged == 'false'
        }
    }
}