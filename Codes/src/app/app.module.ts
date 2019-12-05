import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatCardModule, MatButtonModule,
  MatToolbarModule, MatExpansionModule, MatDividerModule,
  MatListModule, MatProgressSpinnerModule, MatDialogModule, MatFormFieldModule,
  MatSelectModule, MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule,
  MatTableModule, MatRadioModule, MatTooltipModule, MatSnackBarModule,
  MatBottomSheetModule, MatCheckboxModule, MatPaginatorModule, MatSortModule, MatIconModule, MatTabsModule,
  MatBadgeModule,
  MatTreeModule} from '@angular/material';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/create-posts/post-create.component';
import { HeaderComponent } from './appheader/app-header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FooterComponent } from './appfooter/app-footer.component';
import { CarouselComponent } from './carousel/app-carousel.component';
import { SignINComponent } from './signin/app-signin.component';
import { RegisterComponent } from './register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { NewPasswordComponent } from './newpassword/newpassword.component';
import { ResetPasswordComponent } from './newpassword/resetpassword/resetpassword.component';
import { AddGuestsComponent } from './add guests/addguests.component';
import { ActivateUserComponent } from './newpassword/activateuser/activateuser.component';
import { RSVPComponent } from './rsvp/rsvp.component';
import { CsvReadComponent } from './csvread/app-csvread.component';
import { BottomSheetOverviewExampleSheet } from './posts/create-posts/bottom-sheet-overview';
import { ContactsComponent } from './contacts/contacts.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { SavedEventComponent } from './posts/post-list/savedevents/savedevents-list.component';
import { PastEventComponent } from './posts/post-list/pastevents/pastevent-list.component';
import { AllEventsComponent } from './posts/post-list/allevents/allevents-list.component';
import { InvitedEventComponent } from './posts/post-list/invitedevents/invitedevents-list.component';
import { BirthdayCardsComponent } from './cards/birthday-cards/birthday-cards.component';
import { WeddingCardsComponent } from './cards/wedding-cards/wedding-cards.component';
import { PartyCardsComponent } from './cards/party-cards/party-cards.component';
import { PostQuestionaireComponent } from './posts/create-posts/post-questionaire/post-questionaire.component';
import { DialogOverviewExampleDialog } from './posts/create-posts/post-questionaire/add-poll/dialog-overview-example-dialog';
import { ItemsToBringDialog } from './posts/create-posts/post-questionaire/items-to-bring/items-to-bring-dialog';
import { AddFoodItemsDialog } from './posts/create-posts/post-questionaire/add-food-menu/add-food-items-dialog';
import { CreateContactGroup } from './contacts/create-contact-group/create-contact-group';
import { SearchFilterPipe } from './posts/create-posts/search-filter.pipe';


@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    FooterComponent,
    CarouselComponent,
    SignINComponent,
    RegisterComponent,
    ErrorComponent,
    NewPasswordComponent,
    ResetPasswordComponent,
    AddGuestsComponent,
    ActivateUserComponent,
    RSVPComponent,
    CsvReadComponent,
    BottomSheetOverviewExampleSheet,
    ContactsComponent,
    ContactsComponent,
    ConfirmationDialogComponent,
    SavedEventComponent,
    InvitedEventComponent,
    PastEventComponent,
    AllEventsComponent,
    BirthdayCardsComponent,
    WeddingCardsComponent,
    PartyCardsComponent,
    PostQuestionaireComponent,
    DialogOverviewExampleDialog,
    ItemsToBringDialog,
    AddFoodItemsDialog,
    CreateContactGroup,
    SearchFilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    HttpClientModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatRadioModule,
    GooglePlaceModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatTabsModule,
    MatBadgeModule,
    MatTreeModule
  ],
  providers: [ MatDatepickerModule,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent, BottomSheetOverviewExampleSheet,
    ConfirmationDialogComponent,
    DialogOverviewExampleDialog,
    ItemsToBringDialog,
    AddFoodItemsDialog,
    CreateContactGroup
  ]
})
export class AppModule { }
