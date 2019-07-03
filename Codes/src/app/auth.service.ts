import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';

import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(firstname: string, lastname: string, username: string, email: string, password: string, phonenumber: string) {
    const authData: AuthData = {firstname: firstname, lastname: lastname,
      username: username, email: email, password: password,
      phonenumber: phonenumber};
    this.http.post('http://localhost:3000/user/register', authData)
      .subscribe(response => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(username: string, password: string) {
    const authData: AuthData = {firstname: null, lastname: null, username: username, email: null, password: password, phonenumber: null};
    this.http.post<{token: string}>('http://localhost:3000/user/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/create']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  resetPassword(email: string) {
    const authData: AuthData = {firstname: null, lastname: null, username: null, email: email, password: null, phonenumber: null};
    this.http.post<{token: string}>('http://localhost:3000/user/reset-password', authData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

  storePassword(email: string, password: string) {
    console.log('I am in store password');
    const authData: AuthData = {firstname: null, lastname: null, username: null, email: email, password: password, phonenumber: null};
    this.http.put<{token: string}>('http://localhost:3000/user/store-password', authData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

}
