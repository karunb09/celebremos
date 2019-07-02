import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {


  isLoading = false;

  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
// tslint:disable-next-line: max-line-length
    this.isLoading = true;
    this.authService.createUser( form.value.firstname, form.value.lastname, form.value.username, form.value.email, form.value.password, form.value.phone);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
