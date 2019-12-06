import { Component, OnInit, Inject, Pipe, PipeTransform, Injectable } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { Contact } from 'src/app/csvread/contact-model';
import { ContactService } from 'src/app/csvread/contact.service';
import { MatTableDataSource } from '@angular/material';
import { AuthService, ContactGroups } from 'src/app/auth.service';


@Component({
  selector: "bottom-sheet-overview-example-sheet",
  templateUrl: 'bottom-sheet-overview-example.html'
})
@Injectable()
export class BottomSheetOverviewExampleSheet implements OnInit {

  form: FormGroup;

  contacts: Contact[] = [];

  contactsArry: Contact[] = [];

  contact: Contact = {
    firstname: 'Vishal',
    lastname: 'Pannala',
    mobilenumber: '13124312',
    emailid: 'vishalreddy.pannala@gmail.com'
  };

  checked = true;

  selectedContact = [];
  username: string;
  lengthOfArray;
  selectedAll: any;
  dataSource;
  searchTerm: any;
  itemsCopy;
  selected: string;
  selectedContactGroups: any[];

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private formbuilder: FormBuilder,
    private contactService: ContactService,
    private authService: AuthService
  ) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
    this.getSelectedContactGroupValue();
    this.getSelectedContactsValue();
    this.contactService.setSelectedContactList(this.selectedContact);
    this.contactService.setSelectedContactGroupList(this.selectedContactGroups);
  }

  onClick() {

  }

  ngOnInit(): void {
    this.form = this.formbuilder.group({
      contactgroups: this.addContactGroupControls(),
      contacts: this.addContactsControls()
    });

    this.authService
      .getAuthUsernameListener()
      .subscribe(message => (this.username = message));
    this.authService.getContacts(this.username);

    this.authService
      .getContactsListListener()
      .subscribe((contacts1: Contact[]) => {
        this.contactsArry = this.data;
        this.contacts = this.contactsArry;
        this.lengthOfArray = this.contacts.length;
      });
    this.authService
      .getContactGroupsListener()
      .subscribe((contacts1: ContactGroups[]) => {});
  }

  get contactsArray() {
    return this.form.get('contacts') as FormArray;
  }

  addContactsControls() {
    const arr = this.data.contacts.map(element => {
      return this.formbuilder.control(false);
    });
    return this.formbuilder.array(arr);
  }

  getSelectedContactsValue() {
    this.selectedContact = [];
    this.contactsArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedContact.push(this.data.contacts[i]);
      }
    });
  }

  get contactGroupArray() {
    return this.form.get('contactgroups') as FormArray;
  }

  addContactGroupControls() {
    const arr = this.data.contactgroups.map(element => {
      return this.formbuilder.control(false);
    });
    return this.formbuilder.array(arr);
  }

  getSelectedContactGroupValue() {
    this.selectedContactGroups = [];
    this.contactGroupArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedContactGroups.push(this.data.contactgroups[i]);
      }
    });
  }

  SelectAll() {
    this.contactsArray.controls.forEach((control) => {
      control.setValue(true);
    });
    this.contactGroupArray.controls.forEach((control) => {
      control.setValue(true);
    });
    this.getSelectedContactsValue();
    this.getSelectedContactGroupValue();
  }

  SelectNone() {
    this.contactsArray.controls.forEach((control) => {
      control.setValue(false);
    });
    this.contactGroupArray.controls.forEach((control) => {
      control.setValue(false);
    });
    this.getSelectedContactsValue();
    this.getSelectedContactGroupValue();
  }


}
