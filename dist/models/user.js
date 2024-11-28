"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(firstname, lastname, mail, password, isAdmin, status) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.mail = mail;
        this.password = password;
        this.isAdmin = isAdmin;
        this.status = status;
    }
}
exports.default = User;
