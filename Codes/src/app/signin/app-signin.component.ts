import { Component } from '@angular/core';
//import { AuthenticationService, TokenPayload } from '../authentication.service';

import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

/**
 * @title Basic toolbar
 */
@Component({
  selector: 'app-signin',
  templateUrl: './app-signin.component.html',
  styleUrls: ['./app-signin.component.css']
})
export class SignINComponent {

  onLogin(form: NgForm){
    console.log(form.value);
  }
}

  // credentials: TokenPayload = {
  //   email: '',
  //   password: ''
  // };

  // constructor(private auth: AuthenticationService, private router: Router) {}

  // login() {
  //   this.auth.login(this.credentials).subscribe(() => {
  //     this.router.navigateByUrl('/profile');
  //   }, (err) => {
  //     console.error(err);

