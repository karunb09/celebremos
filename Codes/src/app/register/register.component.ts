import { Component } from '@angular/core';
//import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // credentials: TokenPayload = {
  //   email: '',
  //   name: '',
  //   password: ''
  // };

  // constructor(private auth: AuthenticationService, private router: Router) {}

  // register() {
  //   this.auth.register(this.credentials).subscribe(() => {
  //     this.router.navigateByUrl('/home-page');
  //   }, (err) => {
  //     console.error(err);
  //   });
  // }
}
