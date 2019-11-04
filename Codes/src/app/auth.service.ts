import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';

import { Subject, BehaviorSubject } from 'rxjs';
import { Contact } from './csvread/contact-model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })


export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private authUsernameListener = new BehaviorSubject<string>("Hello from APP");

  private contacts: Contact[] = [];
  private contactsUpdated = new Subject<Contact[]>();

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

  createUser(
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    phonenumber: string
  ) {
    const contact: Contact = {firstname: null, lastname: null, mobilenumber: null, emailid: null};
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
        this.router.navigate(['/']);
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
      contacts: [{firstname: '', lastname: '', mobilenumber: '', emailid: ''}]
    };
    this.http
      .post<{ token: string }>('http://localhost:3000/user/login', authData)
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;
          if (token) {
            this.isAuthenticated = true;
            this.authUsernameListener.next(authData.username);
            this.authStatusListener.next(true);
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
      contacts: [{firstname: '', lastname: '', mobilenumber: '', emailid: ''}]
    };
    this.http
      .post<{ token: string }>(
        'http://localhost:3000/user/reset-password',
        authData
      )
      .subscribe(response => {
        this.router.navigate(['/']);
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
      contacts: [{firstname: '', lastname: '', mobilenumber: '', emailid: ''}]
    };
    this.http
      .put<{ token: string }>(
        'http://localhost:3000/user/store-password',
        authData
      )
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  activateUser(id: string) {
    const authData: AuthData = {
      firstname: null,
      lastname: null,
      username: null,
      email: id,
      password: null,
      phonenumber: null,
      activationStatus: true,
      createdEvents: ['0'],
      contacts: [{firstname: '', lastname: '', mobilenumber: '', emailid: ''}]
    };
    this.http.put<{ token: string }>(
      'http://localhost:3000/user/activateuser',
      authData
    );
  }

  getContacts(username: string){
    const authData: AuthData = {
      firstname: null,
      lastname: null,
      username: username,
      email: null,
      password: null,
      phonenumber: null,
      activationStatus: true,
      createdEvents: ['0'],
      contacts: [{firstname: '', lastname: '', mobilenumber: '', emailid: ''}]
    };
    this.http.get<{ contacts: any, message: string }>(
      'http://localhost:3000/contacts/' + username
    ).pipe(
      map(contacts => {
        return contacts.contacts.map(contact => {
          return {
            firstname: contact.firstname,
            lastname: contact.lastname,
            emailid: contact.emailid,
            id: contact._id,
            mobilenumber: contact.mobilenumber,
          };
        });
      })
    ).subscribe(transformedContacts => {
      this.contacts = transformedContacts;
      this.contactsUpdated.next([...this.contacts]);
    });
  }

  addContact(
    firstname: string,
    lastname: string,
    emailid: string,
    mobilenumber: string,
    username: string,
  ) {
    let contact: Contact = {
      firstname: firstname,
      lastname: lastname,
      emailid: emailid,
      mobilenumber: mobilenumber
    }
    this.http
      .put<{ message: string; contacts: any }>(
        "http://localhost:3000/user/contacts/" + username,
        contact
      )
      .subscribe(responseData => {
        const contact1 = {
          firstname: responseData.contacts.firstname,
          lastname: lastname,
          emailid: emailid,
          mobilenumber: mobilenumber,
        };
        this.contacts.push(contact1);
        console.log(contact1);
        this.contactsUpdated.next([...this.contacts]);
      });
  }

  deleteContact(contactId: string, firstname: string, username: string) {
    this.http
      .delete("http://localhost:3000/api/contacts/" + contactId + "/" + username)
      .subscribe(() => {
        console.log("Deleted");
        const updatedContacts = this.contacts.filter(contact =>
          contact.firstname !== firstname
        );
        this.contacts = updatedContacts;
        this.contactsUpdated.next([...this.contacts]);
      });
  }

  getContact(username: string, id: string ) {
    // console.log(this.httpClient.get('http://localhost:3000/api/posts/' + id));
    return this.http.get<{
      _id: string;
      firstname: string;
      lastname: string;
      emailid: string;
      mobilenumber: string;
    }>("http://localhost:3000/contacts/" + username + '/' + id);
    // return {...this.posts.find(p => p.id === id)};
  }

  updateContact(
    id: string,
    firstname: string,
    lastname: string,
    emailid: string,
    mobilenumber: string,
    username: string
  ) {
    let contact = {
      id: id,
      firstname: firstname,
      lastname: lastname,
      emailid: emailid,
      mobilenumber: mobilenumber
    }
    console.log(contact);
    this.http
      .put<{ message: string; contacts: any }>(
        "http://localhost:3000/user/contacts/" + username + '/' + id,
        contact
      )
      .subscribe(responseData => {
        const contact1 = {
          firstname: responseData.contacts.firstname,
          lastname: lastname,
          emailid: emailid,
          mobilenumber: mobilenumber,
        };
        this.contacts.push(contact1);
        console.log(contact1);
        this.contactsUpdated.next([...this.contacts]);
      });
}
}
