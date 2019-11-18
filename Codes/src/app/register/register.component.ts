import { Component, OnInit, OnDestroy } from '@angular/core';
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

  checkEmail(form: NgForm) {
    if (form.value.password !== form.value.password1) {
      alert('Passwords do not match! Please check and enter same passwords');
      return false;
    } else {
      return true;
    }
  }

  onSignUp(form: NgForm) {
    if (this.checkEmail(form)) {
      if (form.invalid) {
        return;
      }
      this.isLoading = true;
      this.authService.createUser(form.value.firstname, form.value.lastname,
        form.value.username, form.value.email, form.value.password, form.value.phone);
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
