import { Component, OnInit } from '@angular/core';
import { AuthService, ContactGroups } from '../auth.service';
import { Contact } from '../csvread/contact-model';
import { MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CreateContactGroup } from './create-contact-group/create-contact-group';
import { ContactService } from '../csvread/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private contactService: ContactService,
    private router: ActivatedRoute
  ) {
    this.events.push();
  }

  contacts;

  contactgroups;

  isLoading: boolean;

  mode: string = 'create';

  contactId;

  form: FormGroup;

  displayedColumns: string[] = [
    'firstname',
    'lastname',
    'mobilenumber',
    'emailid',
    'operations'
  ];

  dataSource;

  contactsInGroups = [];

  username: string;

  contact;

  events = [{ id: '', groupName: 'No group' }];

  ngOnInit() {
    this.isLoading = true;
    this.form = new FormGroup({
      firstname: new FormControl(null, {
        validators: []
      }),
      lastname: new FormControl(null, {
        validators: []
      }),
      emailid: new FormControl(null, {
        validators: []
      }),
      mobilenumber: new FormControl(null, {
        validators: []
      }),
      group: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.authService
      .getAuthUsernameListener()
      .subscribe(message => (this.username = message));
    this.authService.getContacts(this.username);
    this.authService.getContactGroups(this.username);
    this.authService
      .getContactsListListener()
      .subscribe((contacts1: Contact[]) => {
        this.contacts = contacts1;
        this.dataSource = new MatTableDataSource<Contact>(this.contacts);
        this.isLoading = false;
      });
    this.authService
      .getContactGroupsListener()
      .subscribe((contacts1: ContactGroups[]) => {
        this.contactgroups = contacts1;
        this.isLoading = false;
        this.isLoading = false;
        for (let i = 0; i < this.contactgroups.length; i++) {
          this.events.push({
            id: this.contactgroups[i]._id,
            groupName: this.contactgroups[i].groupName
          });
          this.contactsInGroups[i] = new MatTableDataSource<Contact>(this.contactgroups[i].groupcontacts)
        }
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('contactId')) {
        this.mode = 'edit';
        this.contactId = paramMap.get('contactId');
        console.log(this.mode);
        this.authService
          .getContact(this.username, this.contactId)
          .subscribe(contactData => {
            this.contact = {
              id: contactData._id,
              firstname: contactData.firstname,
              lastname: contactData.lastname,
              emailid: contactData.emailid,
              mobilenumber: contactData.mobilenumber,
              contactgroup: contactData.contactgroup
            };
            this.form.setValue({
              firstname: this.contact.firstname,
              lastname: this.contact.lastname,
              mobilenumber: this.contact.mobilenumber,
              emailid: this.contact.emailid,
              group: this.contact.contactgroup
            });
          });
      } else {
        this.mode = 'create';
        this.contactId = null;
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSaveContact() {
    if (this.form.invalid) {
      return;
    }
    console.log(this.mode);
    let contactgroupId = '';
    for (let i = 0; i < this.events.length; i++) {
      if (this.form.value.group === this.events[i].groupName) {
        contactgroupId = this.events[i].id;
      }
    }
    console.log(contactgroupId);
    if (this.mode === 'create') {
      this.authService.addContact(
        this.form.value.firstname,
        this.form.value.lastname,
        this.form.value.emailid,
        this.form.value.mobilenumber,
        this.username,
        contactgroupId
      );
      this.openSnack('A new contact has been created.');
    } else {
      this.authService.updateContact(
        this.contactId,
        this.form.value.firstname,
        this.form.value.lastname,
        this.form.value.emailid,
        this.form.value.mobilenumber,
        this.username,
        contactgroupId
      );
      this.openSnack('Contact is successfully updated.');
    }
    this.form.reset();
  }

  openSnack(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 2000
    });
  }

  onDelete(contactId: string, firstname: string) {
    this.authService.deleteContact(contactId, firstname, this.username);
    this.openSnack('Contact is successfully Deleted.');
  }

  onDeleteContactGroup(
    contactId: string,
    contactgroupId: string,
    firstname: string
  ) {
    this.authService.deleteContactGroup(
      contactId,
      contactgroupId,
      firstname,
      this.username
    );
    this.openSnack('Contact is successfully Deleted.');
  }

  openDialog(contactId: string, firstname: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete the contact?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        this.onDelete(contactId, firstname);
        // DO SOMETHING
      }
    });
  }

  openDialogContactGroup(
    contactId: string,
    contactgroupId: string,
    firstname: string
  ): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete the contact?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        this.onDeleteContactGroup(contactId, contactgroupId, firstname);
        // DO SOMETHING
      }
    });
  }

  openCreateContactDialog(): void {
    const dialogRef = this.dialog.open(CreateContactGroup, {
      width: '500px',
      data: this.contacts
    });
    dialogRef.afterClosed().subscribe(result => {
      this.openSnackBar();
    });
  }

  openSnackBar() {
    this.snackBar.open('Contact group created successfully!', 'Dismiss', {
      duration: 2000
    });
  }
}
