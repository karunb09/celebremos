import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { Contact } from './csvread/contact-model';
import { map } from 'rxjs/operators';
import { ContactModel } from './csvread/contact.service';

export interface ContactGroups {
  groupName: string;
  groupcontacts: [ {
  _id: string;
  firstname: string;
  lastname: string;
  mobilenumber: string;
  emailid: string;
  }]
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private emailId: string;
  private authStatusListener = new Subject<boolean>();
  private authUsernameListener = new BehaviorSubject<string>('Hello from APP');
  private authEmailIdListener = new BehaviorSubject<string>('Hello from APP');
  private contacts: Contact[] = [];
  private contactgroups: ContactGroups[] = [];
  private contactsUpdated = new Subject<Contact[]>();
  private contactGroups = new Subject<ContactGroups[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAuthUsernameListener() {
    return this.authUsernameListener.asObservable();
  }

  getContactsListListener() {
    return this.contactsUpdated.asObservable();
  }

  getContactGroupsListener() {
    return this.contactGroups.asObservable();
  }

  getAuthEmailIdListener() {
    return this.authEmailIdListener.asObservable();
  }

  createUser(
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    phonenumber: string
  ) {
    const contact: Contact = {
      firstname: null,
      lastname: null,
      mobilenumber: null,
      emailid: null
    };
    let contacts: [Contact] = [contact];
    const authData: AuthData = {
      firstname: firstname,
      lastname: lastname,
      username: username,
      email: email,
      password: password,
      phonenumber: phonenumber,
      activationStatus: true,
      createdEvents: ['0'],
      contacts: contacts
    };
    this.http.post('http://localhost:3000/user/register', authData).subscribe(
      response => {
        setTimeout(() => {
          this.router.navigate(['/']);
      }, 2000);
      },
      error => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(username: string, password: string) {
    const authData: AuthData = {
      firstname: null,
      lastname: null,
      username: username,
      email: null,
      password: password,
      phonenumber: null,
      activationStatus: true,
      createdEvents: ['0'],
      contacts: [{ firstname: '', lastname: '', mobilenumber: '', emailid: '' }]
    };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/user/login',
        authData
      )
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);
            this.authUsernameListener.next(authData.username);
            this.getUserEmailId(authData.username).subscribe(
              message => {
                this.authEmailIdListener.next(message);
              }
            );
            this.router.navigate(['/create']);
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  resetPassword(email: string) {
    const authData: AuthData = {
      firstname: null,
      lastname: null,
      username: null,
      email: email,
      password: null,
      phonenumber: null,
      activationStatus: true,
      createdEvents: ['0'],
      contacts: [{ firstname: '', lastname: '', mobilenumber: '', emailid: '' }]
    };
    this.http
      .post<{ token: string }>(
        'http://localhost:3000/user/reset-password',
        authData
      )
      .subscribe(response => {
        setTimeout(() => {
          this.router.navigate(['/']);
      }, 1500);
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
      this.router.navigate(['/']);
  }

  storePassword(id: string, password: string) {
    const authData: AuthData = {
      firstname: null,
      lastname: null,
      username: null,
      email: id,
      password: password,
      phonenumber: null,
      activationStatus: true,
      createdEvents: ['0'],
      contacts: [{ firstname: '', lastname: '', mobilenumber: '', emailid: '' }]
    };
    this.http
      .put<{ token: string }>(
        'http://localhost:3000/user/store-password',
        authData
      ).subscribe(response => {
        setTimeout(() => {
          this.router.navigate(['/']);
      }, 1500);
      });
  }

  activateNewUser(userid: string) {
    const authData: AuthData = {
      firstname: null,
      lastname: null,
      username: '12312',
      email: userid,
      password: null,
      phonenumber: null,
      activationStatus: true,
      createdEvents: ['0'],
      contacts: [{ firstname: '', lastname: '', mobilenumber: '', emailid: '' }]
    };
    this.http
      .put<{ token: string }>(
        'http://localhost:3000/user/activate',
        authData
      ).subscribe(response => {
        setTimeout(() => {
          this.router.navigate(['/']);
      }, 5000);
      });
  }

  getUserEmailId(username: string) {
    return this.http.get<
      string
    >('http://localhost:3000/api/getuseremail/' + username);
  }

  getContacts(username: string) {
    const authData: AuthData = {
      firstname: null,
      lastname: null,
      username: username,
      email: null,
      password: null,
      phonenumber: null,
      activationStatus: true,
      createdEvents: ['0'],
      contacts: [{ firstname: '', lastname: '', mobilenumber: '', emailid: '' }]
    };
    this.http
      .get<{ contacts: any; message: string }>(
        'http://localhost:3000/contacts/' + username
      )
      .pipe(
        map(contacts => {
          return contacts.contacts.map(contact => {
            return {
              firstname: contact.firstname,
              lastname: contact.lastname,
              emailid: contact.emailid,
              id: contact._id,
              mobilenumber: contact.mobilenumber
            };
          });
        })
      )
      .subscribe(transformedContacts => {
        this.contacts = transformedContacts;
        this.contactsUpdated.next([...this.contacts]);
      });
  }

  getContactGroups(username: string) {
    const authData: AuthData = {
      firstname: null,
      lastname: null,
      username: username,
      email: null,
      password: null,
      phonenumber: null,
      activationStatus: true,
      createdEvents: ['0'],
      contacts: [{ firstname: '', lastname: '', mobilenumber: '', emailid: '' }]
    };
    this.http
      .get<{ contacts: any; message: string }>(
        'http://localhost:3000/contactgroups/' + username
      )
      .pipe(
        map(contacts => {
          return contacts.contacts.map(contact => {
            return {
              _id: contact._id,
              groupName: contact.groupName,
              groupcontacts: contact.groupcontacts,
            };
          });
        })
      )
      .subscribe(transformedContacts => {
        this.contactgroups = transformedContacts;
        this.contactGroups.next([...this.contactgroups]);
      });
  }

  addContact(
    firstname: string,
    lastname: string,
    emailid: string,
    mobilenumber: string,
    username: string,
    contactgroupId: string
  ) {
    let contact = {
      firstname: firstname,
      lastname: lastname,
      emailid: emailid,
      mobilenumber: mobilenumber,
      contactgroupId: contactgroupId
    };
    console.log(contact);
    this.http
      .put<{ message: string; contacts: any }>(
        'http://localhost:3000/user/contacts/' + username,
        contact
      )
      .subscribe(responseData => {
        const contact1 = {
          firstname: responseData.contacts.firstname,
          lastname: lastname,
          emailid: emailid,
          mobilenumber: mobilenumber
        };
        this.contacts.push(contact1);
        this.contactsUpdated.next([...this.contacts]);
      });
  }

  addContactGroup(
    username: string,
    groupName: string,
    contacts: ContactModel[]
  ) {
    let contactgroup = {
      groupName: groupName,
      groupContacts: contacts
    };
    console.log(contactgroup);
    this.http
      .put<{ message: string; contacts: any }>(
        'http://localhost:3000/user/addcontactsgroup/' + username,
        contactgroup
      )
      .subscribe(responseData => {

      });
  }

  deleteContact(contactId: string, firstname: string, username: string) {
    this.http
      .delete(
        'http://localhost:3000/api/contacts/' + contactId + '/' + username
      )
      .subscribe(() => {
        console.log('Deleted');
        const updatedContacts = this.contacts.filter(
          contact => contact.firstname !== firstname
        );
        this.contacts = updatedContacts;
        this.contactsUpdated.next([...this.contacts]);
      });
  }

  deleteContactGroup(contactId: string, contactgroupId: string, firstname: string, username: string) {
    this.http
      .delete(
        'http://localhost:3000/api/contactgroup/' + contactId + '/' + username + '/' + contactgroupId
      )
      .subscribe(() => {
        console.log('Deleted');

      });
  }

  getContact(username: string, id: string) {
    return this.http.get<{
      _id: string;
      firstname: string;
      lastname: string;
      emailid: string;
      mobilenumber: string;
      contactgroup: string;
    }>('http://localhost:3000/contacts/' + username + '/' + id);
  }

  updateContact(
    id: string,
    firstname: string,
    lastname: string,
    emailid: string,
    mobilenumber: string,
    username: string,
    contactgroupId: string
  ) {
    let contact = {
      id: id,
      firstname: firstname,
      lastname: lastname,
      emailid: emailid,
      mobilenumber: mobilenumber,
      contactgroupId: contactgroupId
    };
    this.http
      .put<{ message: string; contacts: any }>(
        'http://localhost:3000/user/contacts/' + username + '/' + id,
        contact
      )
      .subscribe(responseData => {
        const contact1 = {
          firstname: responseData.contacts.firstname,
          lastname: lastname,
          emailid: emailid,
          mobilenumber: mobilenumber
        };
        this.contacts.push(contact1);
        this.contactsUpdated.next([...this.contacts]);
      });
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

}
