import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Contact } from './contact-model';
import { ContactGroups } from '../auth.service';

export interface ContactModel {
  id: string;
  firstname: string;
  lastname: string;
  mobilenumber: string;
  emailid: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private selectedContactsList = new Subject<Contact[]>();
  private selectedContactsListDialog = new Subject<ContactModel[]>();
  private selectedContactGroups = new Subject<ContactGroups[]>();
  private groupName = new BehaviorSubject<string>('Hello from APP');

  constructor(private httpClient: HttpClient) {
    this.selectedContactsList = new Subject<Contact[]>();
  }

  setSelectedContactList(list: Contact[]) {
    this.selectedContactsList.next([...list]);
  }

  getselectedContactList() {
    return this.selectedContactsList.asObservable();
  }

  setSelectedContactGroupList(list: ContactGroups[]) {
    this.selectedContactGroups.next([...list]);
  }

  getselectedContactGroupList() {
    return this.selectedContactGroups.asObservable();
  }

  setSelectedContactListDialog(list: ContactModel[]) {
    this.selectedContactsListDialog.next([...list]);
  }

  getselectedContactListDialog() {
    return this.selectedContactsListDialog.asObservable();
  }

  setGroupName(name: string) {
    this.groupName.next(name);
  }

  getGroupName() {
    return this.groupName.asObservable();
  }
}
