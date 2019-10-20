
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Contact } from './contact-model';

@Injectable({ providedIn: 'root' })
export class ContactService {

  private selectedContactsList = new Subject<Contact[]>();

  constructor(private httpClient: HttpClient) {}

  setSelectedContactList(list: Contact[]) {
    this.selectedContactsList.next([...list]);
  }

  getselectedContactList() {
    return this.selectedContactsList.asObservable();
  }
}
