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
import { BirthdayCardsComponent } from './cards/birthday-cards/birthday-cards.component';
import { WeddingCardsComponent } from './cards/wedding-cards/wedding-cards.component';
import { PartyCardsComponent } from './cards/party-cards/party-cards.component';
import { PostQuestionaireComponent } from './posts/create-posts/post-questionaire/post-questionaire.component';
import { PostdetailsComponent } from './posts/postdetails/postdetails.component';
import { HostreplyComponent } from './posts/hostreply/hostreply.component';



// Setting path to redirect next page

const routes: Routes =  [
  { path: '', component: CarouselComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'create/:imagePath', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'hostedevents', component: PostListComponent, canActivate: [AuthGuard] },
  { path: 'savedevents', component: SavedEventComponent, canActivate: [AuthGuard] },
  { path: 'invitedevents', component: InvitedEventComponent, canActivate: [AuthGuard] },
  { path: 'pastevents', component: PastEventComponent, canActivate: [AuthGuard] },
  { path: 'allevents', component: AllEventsComponent, canActivate: [AuthGuard] },
  { path: 'reset', component: NewPasswordComponent},
  { path: 'reset/:userId', component: ResetPasswordComponent},
  { path: 'addGuests/:eventName', component: AddGuestsComponent, canActivate: [AuthGuard] },
  { path: 'questionaire/:postId' , component: PostQuestionaireComponent, canActivate: [AuthGuard]},
  { path: 'postdetails/:postId' , component: PostdetailsComponent, canActivate: [AuthGuard]},
  { path: 'sendresponse/:emailId/:postId' , component: HostreplyComponent, canActivate: [AuthGuard]},
  { path: 'activateUser/:userId', component: ActivateUserComponent},
  { path: 'rsvp/:postId/:emailId', component: RSVPComponent},
  { path: 'edit/rsvp/:postId/:email', component: RSVPComponent},
  { path: 'csvupload' , component: CsvReadComponent},
  { path: 'contacts' , component: ContactsComponent, canActivate: [AuthGuard]},
  { path: 'contacts/edit/:contactId' , component: ContactsComponent, canActivate: [AuthGuard]},
  { path: 'birthdaycards' , component: BirthdayCardsComponent},
  { path: 'weddingcards' , component: WeddingCardsComponent},
  { path: 'partycards' , component: PartyCardsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {
}
