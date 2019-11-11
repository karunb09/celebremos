import {Component, OnInit} from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import {  FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { Contact } from 'src/app/csvread/contact-model';
import { ContactService } from 'src/app/csvread/contact.service';
import { MatTableDataSource } from '@angular/material';
import { AuthService } from 'src/app/auth.service';

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

  username: string;

  lengthOfArray

  selectedAll: any;

  dataSource;

  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>, private formbuilder: FormBuilder, private contactService: ContactService, private authService: AuthService) {
    for (let i = 0; i < 60; i++){
      this.contactsArry.push(this.contact);
    }
    // console.log(this.contact.mobilenumber);
    // while (this.contact.mobilenumber !== '13124312') {
    //   this.contactsArry.push(this.contact);
    // }
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

  this.authService
      .getAuthUsernameListener()
      .subscribe(message => (this.username = message));
    this.authService.getContacts(this.username);

    this.authService
      .getContactsListListener()
      .subscribe((contacts1: Contact[]) => {
        this.contactsArry = contacts1;
        this.contacts = this.contactsArry;
        this.lengthOfArray = this.contacts.length;
      });
      console.log(this.contactsArry);
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

applyFilter(filterValue: string) {
  this.dataSource = new MatTableDataSource(this.contacts);
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

selectAll() {
  for (let i = 0; i < this.contacts.length; i++) {
    this.contactsArray[i].selected = this.selectedAll;
  }
}
checkIfAllSelected() {
  this.selectedAll = this.contacts.every(function(item:any) {
      return item.selected = true;
    });
}
}
