import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { CarouselComponent } from './carousel/app-carousel.component';
import { PostCreateComponent } from './posts/create-posts/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { AuthGuard } from './auth.guard';
import { NewPasswordComponent } from './newpassword/newpassword.component';
import { ResetPasswordComponent } from './newpassword/resetpassword/resetpassword.component';
import { AddGuestsComponent } from './add guests/addguests.component';
import { ActivateUserComponent } from './newpassword/activateuser/activateuser.component';
import { RSVPComponent } from './rsvp/rsvp.component';
import { CsvReadComponent } from './csvread/app-csvread.component';

// Setting path to redirect next page

const routes: Routes =  [
  { path: '', component: CarouselComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'list', component: PostListComponent, canActivate: [AuthGuard] },
  { path: 'reset', component: NewPasswordComponent},
  { path: 'reset/:userId', component: ResetPasswordComponent},
  { path: 'addGuests/:eventName', component: AddGuestsComponent},
  { path: 'activateUser/:userId', component: ActivateUserComponent},
  { path: 'rsvp/:postId/:emailId', component: RSVPComponent},
  { path: 'csvupload' , component: CsvReadComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {
}
