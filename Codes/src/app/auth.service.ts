import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient) {}

  createUser(firstname: string, lastname: string, username: string, email: string, password: string, phonenumber: string) {
// tslint:disable-next-line: max-line-length
    const authData: AuthData = {firstname: firstname, lastname: lastname, username: username, email: email, password: password, phonenumber: phonenumber};
    this.http.post("http://localhost:3000/api/user/register", authData)
      .subscribe(response => {
        console.log(response);
      });
  }

}
