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

  constructor(public authService: AuthService) {}

  onResetting(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.storePassword(form.value.email, form.value.password);
  }
}
