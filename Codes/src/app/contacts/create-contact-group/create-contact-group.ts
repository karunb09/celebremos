import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Contact } from 'src/app/csvread/contact-model';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { ContactService } from 'src/app/csvread/contact.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: "createcontactcomponent",
  templateUrl: 'create-contact-group.html',
  styleUrls: ['create-contact-group.css']
})
export class CreateContactGroup {
  constructor(
    public dialogRef: MatDialogRef<CreateContactGroup>,
    @Inject(MAT_DIALOG_DATA) public data: [Contact],
    private formbuilder: FormBuilder,
    private contactService: ContactService,
    private authService: AuthService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

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

  openLink(event: MouseEvent): void {
    this.dialogRef.close();
    event.preventDefault();
    this.authService.addContactGroup(
      this.username,
      this.form.value.groupName,
      this.selectedContact
    );
  }

  onClick() {}

  ngOnInit(): void {
    this.form = this.formbuilder.group({
      groupName: new FormControl(null, { validators: [Validators.required] }),
      contacts: this.addContactsControls()
    });
    this.authService
      .getAuthUsernameListener()
      .subscribe(message => (this.username = message));
    this.contactsArry = this.data;
    this.contacts = this.contactsArry;
    this.lengthOfArray = this.contacts.length;
  }

  get contactsArray() {
    return this.form.get('contacts') as FormArray;
  }

  addContactsControls() {
    const arr = this.data.map(element => {
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

  SelectAll() {
    this.contactsArray.controls.forEach(control => {
      control.setValue(true);
    });
    this.getSelectedContactsValue();
  }

  SelectNone() {
    this.contactsArray.controls.forEach(control => {
      control.setValue(false);
    });
    this.getSelectedContactsValue();
  }
}
