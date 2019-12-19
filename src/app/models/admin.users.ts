
export interface AdminUsers {

    id:string
    email:string
    name:string
    position:string
    image:string
    role:string
    access_levels:string
    blocked:boolean
    business_owner:string

    // constructor(id:string,email:string,name:string,position:string,image:string,role:string,access_levels:string){
    //     this.access_levels = access_levels
    //     this.email = email
    //     this.name = name
    //     this.position = position
    //     this.image = image
    //     this.role = role
    //     this.id = id
    // }
}