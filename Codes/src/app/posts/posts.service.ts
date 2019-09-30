import { Post } from "./posts.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) {}

  getPosts() {
    this.httpClient
      .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              type: post.type,
              date: post.date,
              time: post.time,
              host: post.host,
              location: post.location,
              street: post.street,
              city: post.city,
              state: post.state,
              guests: post.guests,
              reponses: post.reponses
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

  addPosts(
    title: string,
    type: string,
    date: string,
    time: string,
    host: string,
    location: string,
    street: string,
    city: string,
    state: string,
    content: string,
    guests: [string],
    accepted: [string],
    denied: [string],
    ambiguous: [string]
  ) {
    const post: Post = {
      id: null,
      title: title,
      type: type,
      date: date,
      time: time,
      host: host,
      location: location,
      street: street,
      city: city,
      state: state,
      content: content,
      guests: guests,
      responses: { accepted: accepted, denied: denied, ambiguous: ambiguous }
    };
    this.httpClient
      .post<{ message: string; postId: string }>(
        "http://localhost:3000/api/posts",
        post
      )
      .subscribe(responseData => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.httpClient
      .delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        console.log("Deleted");
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
    //console.log(this.httpClient.get('http://localhost:3000/api/posts/' + id));
    return this.httpClient.get<{
      _id: string;
      title: string;
      type: string;
      date: string;
      time: string;
      host: string;
      location: string;
      street: string;
      city: string;
      state: string;
      content: string;
      guests: [string];
      responses: { accepted: [string]; denied: [string]; ambiguous: [string]; };
    }>("http://localhost:3000/api/posts/" + id);
    // return {...this.posts.find(p => p.id === id)};
  }

  updatePost(
    id: string,
    title: string,
    type: string,
    date: string,
    time: string,
    host: string,
    location: string,
    street: string,
    city: string,
    state: string,
    content: string,
    guests: [string],
    accepted: [string],
    denied: [string],
    ambiguous: [string]
  ) {
    const post: Post = {
      id: id,
      title: title,
      type: type,
      date: date,
      time: time,
      host: host,
      location: location,
      street: street,
      city: city,
      state: state,
      content: content,
      guests: guests,
      responses: { accepted: accepted, denied: denied, ambiguous: ambiguous }
    };

    this.httpClient
      .put("http://localhost:3000/api/posts/" + id, post)
      .subscribe(responseData => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
