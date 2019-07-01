import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthService } from "../auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  isLoading = false;

  constructor(public authService: AuthService) {}

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.createUser( form.value.firstname, form.value.lastname, form.value.username, form.value.email, form.value.password, form.value.phone);
  }
}
