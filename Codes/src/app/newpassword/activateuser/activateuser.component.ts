import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-activateuser',
  templateUrl: './activateuser.component.html',
  styleUrls: ['./activateuser.component.css']
})
export class ActivateUserComponent implements OnInit {
  isLoading = false;
  userid;

  constructor(public authService: AuthService, private router: Router, public route: ActivatedRoute) {

  }

  ngOnInit() {
    const currentURL = this.router.url;
    this.isLoading = true;

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.userid = paramMap.get('userId');
        console.log(this.userid);
      }
      this.authService.activateNewUser(this.userid);
    });

  }

}
