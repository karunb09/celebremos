import { Post } from "./posts.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Contact } from '../csvread/contact-model';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root" })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts(username: string) {
    this.httpClient
      .get<{ message: string; posts: any }>("http://localhost:3000/api/postslist/"+username)
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
              accepted: post.accepted,
              denied: post.denied,
              ambiguous: post.ambiguous
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
      .get<{ message: string; posts: any }>("http://localhost:3000/api/savedlist/"+username)
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
              accepted: post.accepted,
              denied: post.denied,
              ambiguous: post.ambiguous
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
      .get<{ message: string; posts: any }>("http://localhost:3000/api/alleventslist/"+username)
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
              accepted: post.accepted,
              denied: post.denied,
              ambiguous: post.ambiguous
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
    console.log("Getting Invited Posts");
    this.httpClient
      .get<{ message: string; posts: any }>("http://localhost:3000/api/invitedlist/"+username)
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
              accepted: post.accepted,
              denied: post.denied,
              ambiguous: post.ambiguous
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
    accepted: [string],
    denied: [string],
    ambiguous: [string],
    username: string,
    contacts: Contact[]
  ) {
    const post = new FormData();
    post.append("title", title);
    post.append("type", type);
    post.append("image", image, title);
    post.append("date", date);
    post.append("time", time);
    post.append("host", host);
    post.append("location", location);
    post.append("content", content);
    accepted.pop();
    denied.pop();
    ambiguous.pop();
    for (let i = 0; i < guests.length; i++) {
      post.append("guests[]", guests[i]);
    }
    for (let i = 0; i < accepted.length; i++) {
      post.append("accepted[]", accepted[i]);
    }
    for (let i = 0; i < denied.length; i++) {
      post.append("denied[]", denied[i]);
    }
    for (let i = 0; i < ambiguous.length; i++) {
      post.append("ambiguous[]", ambiguous[i]);
    }
    post.append("username", username);
    for (let i = 0; i < contacts.length; i++) {
      let contact = contacts[i].firstname + '$' + contacts[i].lastname + '$' + contacts[i].emailid + '$' + contacts[i].mobilenumber ;
      post.append("contacts[]", contact  );
    }
    this.httpClient
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/saveposts",
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
          guests: guests,
          accepted: accepted,
          denied: denied,
          ambiguous: ambiguous
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/allevents']);
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
    accepted: [string],
    denied: [string],
    ambiguous: [string],
    username: string,
    contacts: Contact[]
  ) {
    const post = new FormData();
    post.append("title", title);
    post.append("type", type);
    post.append("image", image, title);
    post.append("date", date);
    post.append("time", time);
    post.append("host", host);
    post.append("location", location);
    post.append("content", content);
    accepted.pop();
    denied.pop();
    ambiguous.pop();
    for (let i = 0; i < guests.length; i++) {
      post.append("guests[]", guests[i]);
    }
    for (let i = 0; i < accepted.length; i++) {
      post.append("accepted[]", accepted[i]);
    }
    for (let i = 0; i < denied.length; i++) {
      post.append("denied[]", denied[i]);
    }
    for (let i = 0; i < ambiguous.length; i++) {
      post.append("ambiguous[]", ambiguous[i]);
    }
    post.append("username", username);
    for (let i = 0; i < contacts.length; i++) {
      let contact = contacts[i].firstname + '$' + contacts[i].lastname + '$' + contacts[i].emailid + '$' + contacts[i].mobilenumber ;
      post.append("contacts[]", contact  );

    }

    this.httpClient
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
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
          guests: guests,
          accepted: accepted,
          denied: denied,
          ambiguous: ambiguous
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/allevents']);
      });
  }

  deletePost(postId: string, username: string) {
    this.httpClient
      .delete("http://localhost:3000/api/posts/" + postId+ "/" + username)
      .subscribe(() => {
        console.log("Deleted");
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
    // console.log(this.httpClient.get('http://localhost:3000/api/posts/' + id));
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
      accepted: [string];
      denied: [string];
      ambiguous: [string];
    }>("http://localhost:3000/api/posts/" + id);
    // return {...this.posts.find(p => p.id === id)};
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
    guests: [string],
    accepted: [string],
    denied: [string],
    ambiguous: [string],
  ) {
    let post: Post | FormData;
    if (typeof image === "object") {
      post = new FormData();
      post.append("id", id);
      post.append("title", title);
      post.append("type", type);
      post.append("image", image, title);
      post.append("date", date);
      post.append("time", time);
      post.append("host", host);
      post.append("location", location);
      post.append("content", content);
      for (let i = 0; i < guests.length; i++) {
        post.append("guests[]", guests[i]);
      }
      for (let i = 0; i < accepted.length; i++) {
        post.append("accepted[]", accepted[i]);
      }
      for (let i = 0; i < denied.length; i++) {
        post.append("denied[]", denied[i]);
      }
      for (let i = 0; i < ambiguous.length; i++) {
        post.append("ambiguous[]", ambiguous[i]);
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
      guests: guests,
      accepted: accepted,
      denied: denied,
      ambiguous: ambiguous
    };
  }
    this.httpClient
      .put("http://localhost:3000/api/posts/" + id, post)
      .subscribe(responseData => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post  = {
          id: id,
          title: title,
          type: type,
          imagePath: "",
          date: date,
          time: time,
          host: host,
          location: location,
          content: content,
          guests: guests,
          accepted: accepted,
          denied: denied,
          ambiguous: ambiguous
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/allevents']);
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
    accepted: [string],
    denied: [string],
    ambiguous: [string],
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
      guests: guests,
      accepted: accepted,
      denied: denied,
      ambiguous: ambiguous
    };
    this.httpClient
      .post("http://localhost:3000/api/posts/update/" + id+ "/"+ username, post)
      .subscribe(responseData => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post  = {
          id: id,
          title: title,
          type: type,
          imagePath: "",
          date: date,
          time: time,
          host: host,
          location: location,
          content: content,
          guests: guests,
          accepted: accepted,
          denied: denied,
          ambiguous: ambiguous
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/hostedevents']);
      });
  }
}
