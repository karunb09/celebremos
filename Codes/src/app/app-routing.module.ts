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
import { ContactsComponent } from './contacts/contacts.component';
import { SavedEventComponent } from './posts/post-list/savedevents/savedevents-list.component';
import { PastEventComponent } from './posts/post-list/pastevents/pastevent-list.component';
import { AllEventsComponent } from './posts/post-list/allevents/allevents-list.component';
import { InvitedEventComponent } from './posts/post-list/invitedevents/invitedevents-list.component';



// Setting path to redirect next page

const routes: Routes =  [
  { path: '', component: CarouselComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'hostedevents', component: PostListComponent, canActivate: [AuthGuard] },
  { path: 'savedevents', component: SavedEventComponent, canActivate: [AuthGuard] },
  { path: 'invitedevents', component: InvitedEventComponent, canActivate: [AuthGuard] },
  { path: 'pastevents', component: PastEventComponent, canActivate: [AuthGuard] },
  { path: 'allevents', component: AllEventsComponent, canActivate: [AuthGuard] },
  { path: 'reset', component: NewPasswordComponent},
  { path: 'reset/:userId', component: ResetPasswordComponent},
  { path: 'addGuests/:eventName', component: AddGuestsComponent, canActivate: [AuthGuard] },
  { path: 'activateUser/:userId', component: ActivateUserComponent},
  { path: 'rsvp/:postId/:emailId', component: RSVPComponent},
  { path: 'csvupload' , component: CsvReadComponent},
  { path: 'contacts' , component: ContactsComponent, canActivate: [AuthGuard]},
  { path: 'contacts/edit/:contactId' , component: ContactsComponent, canActivate: [AuthGuard]},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {
}
