import { Post } from './posts.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Contact } from '../csvread/contact-model';
import { Router } from '@angular/router';
import { ItemsToBring } from './create-posts/post-questionaire/post-questionaire.component';

@Injectable({ providedIn: 'root' })
export class PostService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts(username: string) {
    this.httpClient
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/postslist/' + username
      )
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              type: post.type,
              imagePath: post.imagePath,
              date: post.date,
              time: post.time,
              host: post.host,
              location: post.location,
              guests: post.guests,
              responses: post.responses,
              question: post.question,
              itemstobring: post.itemstobring,
              photos: post.photos,
              foodmenu: post.foodmenu,
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getSavedPosts(username: string) {
    this.httpClient
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/savedlist/' + username
      )
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              type: post.type,
              imagePath: post.imagePath,
              date: post.date,
              time: post.time,
              host: post.host,
              location: post.location,
              guests: post.guests,
              responses: post.responses,
              question: post.question,
              itemstobring: post.itemstobring,
              photos: post.photos,
              foodmenu: post.foodmenu
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getAllPosts(username: string) {
    this.httpClient
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/alleventslist/' + username
      )
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              type: post.type,
              imagePath: post.imagePath,
              date: post.date,
              time: post.time,
              host: post.host,
              location: post.location,
              guests: post.guests,
              responses: post.responses,
              question: post.question,
              itemstobring: post.itemstobring,
              photos: post.photos,
              foodmenu: post.foodmenu
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getInvitedPosts(username: string) {
    this.httpClient
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/invitedlist/' + username
      )
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              type: post.type,
              imagePath: post.imagePath,
              date: post.date,
              time: post.time,
              host: post.host,
              location: post.location,
              guests: post.guests,
              responses: post.responses,
              question: post.question,
              itemstobring: post.itemstobring,
              photos: post.photos,
              foodmenu: post.foodmenu
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  savePosts(
    title: string,
    type: string,
    image: File,
    date: string,
    time: string,
    host: string,
    location: string,
    content: string,
    guests: [string],
    username: string,
    contacts: Contact[]
  ) {
    const post = new FormData();
    post.append('title', title);
    post.append('type', type);
    post.append('image', image, title);
    post.append('date', date);
    post.append('time', time);
    post.append('host', host);
    post.append('location', location);
    post.append('content', content);
    for (let i = 0; i < guests.length; i++) {
      post.append('guests[]', guests[i]);
    }
    post.append('username', username);
    for (let i = 0; i < contacts.length; i++) {
      let contact =
        contacts[i].firstname +
        '$' +
        contacts[i].lastname +
        '$' +
        contacts[i].emailid +
        '$' +
        contacts[i].mobilenumber;
      post.append('contacts[]', contact);
    }
    this.httpClient
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/saveposts',
        post
      )
      .subscribe(responseData => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          type: type,
          imagePath: responseData.post.imagePath,
          date: date,
          time: time,
          host: host,
          location: location,
          content: content,
          guests: guests
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/questionaire', post.id]);
      });
  }

  addPosts(
    title: string,
    type: string,
    image: File | string,
    date: string,
    time: string,
    host: string,
    location: string,
    content: string,
    guests: [string],
    username: string,
    contacts: Contact[]
  ) {
    const post = new FormData();
    post.append('title', title);
    post.append('type', type);
    if (typeof image === 'object') {
      post.append('image', image, title);
    } else {
      post.append('image', image, title);
    }
    post.append('date', date);
    post.append('time', time);
    post.append('host', host);
    post.append('location', location);
    post.append('content', content);
    for (let i = 0; i < guests.length; i++) {
      post.append('guests[]', guests[i]);
    }
    post.append('username', username);
    for (let i = 0; i < contacts.length; i++) {
      let contact =
        contacts[i].firstname +
        '$' +
        contacts[i].lastname +
        '$' +
        contacts[i].emailid +
        '$' +
        contacts[i].mobilenumber;
      post.append('contacts[]', contact);
    }
    this.httpClient
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe(responseData => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          type: type,
          imagePath: responseData.post.imagePath,
          date: date,
          time: time,
          host: host,
          location: location,
          content: content,
          guests: guests
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/hostedevents']);
      });
  }

  deletePost(postId: string, username: string) {
    this.httpClient
      .delete('http://localhost:3000/api/posts/' + postId + '/' + username)
      .subscribe(() => {
        console.log('Deleted');
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
    return this.httpClient.get<{
      _id: string;
      title: string;
      type: string;
      imagePath: string;
      date: string;
      time: string;
      host: string;
      location: string;
      content: string;
      guests: [string];
      responses: [string];
      question: [string];
      itemstobring: [string];
      photos: [string];
      foodmenu: [string]
    }>('http://localhost:3000/api/posts/' + id);
  }

  updatePost(
    id: string,
    title: string,
    type: string,
    image: File | string,
    date: string,
    time: string,
    host: string,
    location: string,
    content: string,
    guests: [string]
  ) {
    let post: Post | FormData;
    if (typeof image === 'object') {
      post = new FormData();
      post.append('id', id);
      post.append('title', title);
      post.append('type', type);
      post.append('image', image, title);
      post.append('date', date);
      post.append('time', time);
      post.append('host', host);
      post.append('location', location);
      post.append('content', content);
      for (let i = 0; i < guests.length; i++) {
        post.append('guests[]', guests[i]);
      }
    } else {
      post = {
        id: id,
        title: title,
        type: type,
        imagePath: image,
        date: date,
        time: time,
        host: host,
        location: location,
        content: content,
        guests: guests
      };
    }
    this.httpClient
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(responseData => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post = {
          id: id,
          title: title,
          type: type,
          imagePath: '',
          date: date,
          time: time,
          host: host,
          location: location,
          content: content,
          guests: guests
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/hostedevents']);
      });
  }

  sendInvitations(
    id: string,
    title: string,
    type: string,
    image: string,
    date: string,
    time: string,
    host: string,
    location: string,
    content: string,
    guests: [string],
    username: string
  ) {
    let post: Post = {
      id: id,
      title: title,
      type: type,
      imagePath: image,
      date: date,
      time: time,
      host: host,
      location: location,
      content: content,
      guests: guests
    };
    this.httpClient
      .post(
        'http://localhost:3000/api/posts/update/' + id + '/' + username,
        post
      )
      .subscribe(responseData => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post = {
          id: id,
          title: title,
          type: type,
          imagePath: '',
          date: date,
          time: time,
          host: host,
          location: location,
          content: content,
          guests: guests
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/hostedevents']);
      });
  }

  updateRSVP(postId: string, emailid: string, response: string, guestsNumber: number, questionsFromGuest: string) {
    let post = {
      id: postId,
      emailId: emailid,
      response: response,
      guestsNumber: guestsNumber,
      questionsFromGuest: questionsFromGuest
    };
    this.httpClient
      .put(
        'http://localhost:3000/api/posts/update/rsvp',
        post
      ).subscribe(response => {

      });
  }

  getEmailDetails(postId: string, emailId: string) {
    return this.httpClient.get<{
      _id: string;
      email: string;
      numberofguests: string;
      status: string;
      questions: string;
    }>('http://localhost:3000/api/posts/responseitem/' + emailId + '/' + postId);
  }

  updatePostwithPoll(postId: string, username: string, question: string, options: string[], items: ItemsToBring, list: string[]) {
    const post = {
      question: question,
      options: options,
      items: items.items,
      foodmenu: list,
      postId: postId,
      username: username
    };
    this.httpClient
      .put(
        'http://localhost:3000/api/posts/update/foodpoll' ,
        post
      ).subscribe(response => {
        this.router.navigate(['/hostedevents']);
      });
  }

  getRecords(emailid: string, userId: string) {
    return this.httpClient.get<{
      firstname: string;
      lastname: string;
      emailid: string;
      mobilenumber: string;
    }>('http://localhost:3000/api/posts/getcontact/' + emailid + '/' + userId);
  }
}
