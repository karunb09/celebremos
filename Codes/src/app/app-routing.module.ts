import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { CarouselComponent } from './carousel/app-carousel.component'; 
import { SignINComponent } from './signin/app-signin.component';

// Setting path to redirect next page

const routes : Routes =  [
  { path: '', component: CarouselComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'signin', component: SignINComponent}
];


@NgModule({
  
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
