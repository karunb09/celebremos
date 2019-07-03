import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetPasswordComponent {

  isLoading = false;

  constructor(public authService: AuthService) { }

  checkEmail(form: NgForm){
    if (form.value.password !== form.value.password1) {
          alert('Passwords do not match! Please check and enter same passwords');
          return false;
      } else {
          return true;
      }
  }

  onResetting(form: NgForm) {

    if (this.checkEmail(form)) {
      if (form.invalid) {
        return;
      }
    this.isLoading = true;
    this.authService.storePassword(form.value.email, form.value.password);
  }
}
}
