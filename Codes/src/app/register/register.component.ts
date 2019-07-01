import { Component } from '@angular/core';
//import { AuthenticationService, TokenPayload } from '../authentication.service';

import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  onSignUp(form: NgForm) {
    console.log(form.value);
  }
}
