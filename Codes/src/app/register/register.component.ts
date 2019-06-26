import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
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
