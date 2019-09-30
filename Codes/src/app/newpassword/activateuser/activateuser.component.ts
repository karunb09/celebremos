import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activateuser',
  templateUrl: './activateuser.component.html',
  styleUrls: ['./activateuser.component.css']
})
export class ActivateUserComponent implements OnInit {
  isLoading = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    const currentURL = this.router.url;
    console.log(currentURL.slice(currentURL.lastIndexOf('/') + 1));
    this.isLoading = true;
    this.authService.activateUser(currentURL.slice(currentURL.lastIndexOf('/') + 1));
  }
}
