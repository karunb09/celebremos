import { Component } from '@angular/core';
<<<<<<< HEAD
//import { AuthenticationService, TokenPayload } from '../authentication.service';
=======
>>>>>>> 394a848ec733574f11e9e3a1158afc37e700ba7d
import { Router } from '@angular/router';

/**
 * @title Basic toolbar
 */
@Component({
  selector: 'app-signin',
  templateUrl: './app-signin.component.html',
  styleUrls: ['./app-signin.component.css']
})
export class SignINComponent {}

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

