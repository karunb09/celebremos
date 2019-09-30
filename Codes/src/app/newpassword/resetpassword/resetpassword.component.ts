import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetPasswordComponent {

  isLoading = false;

  constructor(public authService: AuthService, private route: ActivatedRoute) { }

  checkEmail(form: NgForm) {
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
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('userId')) {
          let userId = paramMap.get('userId');
          console.log(userId);
          this.isLoading = true;
          this.authService.storePassword(userId, form.value.password);
        };
      });
     // console.log(currentURL);

  }
}
}
