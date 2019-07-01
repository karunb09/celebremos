import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private token: string;

  constructor(private http: HttpClient) {}

  getToken() {
    return this.token;
  }

  createUser(firstname: string, lastname: string, username: string, email: string, password: string, phonenumber: string) {
    const authData: AuthData = {firstname: firstname, lastname: lastname, username: username, email: email, password: password, phonenumber: phonenumber};
    this.http.post('http://localhost:3000/user/register', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(username: string, password: string) {
    const authData: AuthData = {firstname: null, lastname: null, username: username, email: null, password: password, phonenumber: null};
    this.http.post<{token: string}>('http://localhost:3000/user/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
      });
  }

}
