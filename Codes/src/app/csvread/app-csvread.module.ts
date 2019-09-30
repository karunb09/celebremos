import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from '../app-routing.module';
import { CsvReadComponent } from './app-csvread.component';

@NgModule({
  declarations: [
    CsvReadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [CsvReadComponent]
})
export class AppModule { }
