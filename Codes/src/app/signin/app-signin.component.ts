import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm} from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

/**
 * @title Basic toolbar
 */
@Component({
  selector: 'app-signin',
  templateUrl: './app-signin.component.html',
  styleUrls: ['./app-signin.component.css']
})
export class SignINComponent implements OnInit, OnDestroy {

  isLoading = false;

  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.username, form.value.password);
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }


}



