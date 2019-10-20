import {Component, OnInit} from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { NgForm, FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { element } from 'protractor';
import { Subject } from 'rxjs';
import { Contact } from 'src/app/csvread/contact-model';
import { ContactService } from 'src/app/csvread/contact.service';

@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: 'bottom-sheet-overview-example.html',
})


export class BottomSheetOverviewExampleSheet implements OnInit {

  form: FormGroup;

  contacts: Contact[] = [];
  contactsArry: Contact[] = [];

  contact: Contact = {firstname: 'Vishal', lastname: 'Pannala' , mobilenumber: '13124312' , emailid: 'vishalreddy.pannala@gmail.com'};


  checked = true;

  selectedContact = [];

  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>, private formbuilder: FormBuilder, private contactService: ContactService) {
    this.contactsArry.push(this.contact);
  this.contactsArry.push(this.contact);
  this.contacts = this.contactsArry;
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
    this.contactService.setSelectedContactList(this.selectedContact);
    this.selectedContact = [];
  }

  onClick(){

  }

  ngOnInit(): void {
    this.form = this.formbuilder.group({
      contacts: this.addContactsControls()
  });

}

get contactsArray() {
  return this.form.get('contacts') as FormArray;

}

addContactsControls() {
  const arr = this.contacts.map(element => {
    return this.formbuilder.control(false);

  });
  return this.formbuilder.array(arr);
}

getSelectedContactsValue() {
  this.selectedContact = [];
  this.contactsArray.controls.forEach((control, i) => {
    if (control.value) {
      this.selectedContact.push(this.contacts[i]);
    }
  });
}
}
