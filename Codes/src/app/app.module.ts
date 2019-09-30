import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatCardModule, MatButtonModule,
  MatToolbarModule, MatExpansionModule, MatDividerModule,
  MatListModule, MatProgressSpinnerModule, MatDialogModule, MatFormFieldModule,
  MatSelectModule, MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule,
  MatTableModule, MatRadioModule } from '@angular/material';

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
    CsvReadComponent
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
  ],
  providers: [ MatDatepickerModule,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
