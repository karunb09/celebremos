import { Component } from '@angular/core';
import { NgForm} from "@angular/forms";
//import { AuthenticationService, TokenPayload } from '../authentication.service';

import { Router } from '@angular/router';

/**
 * @title Basic toolbar
 */
@Component({
  selector: 'app-signin',
  templateUrl: './app-signin.component.html',
  styleUrls: ['./app-signin.component.css']
})
export class SignINComponent {

  onLogin(form: NgForm){
    console.log(form.value);
  }
}



