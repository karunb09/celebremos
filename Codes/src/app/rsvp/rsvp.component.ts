import { Component, OnInit, OnDestroy, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Post } from '../posts/posts.model';
import { PostService } from '../posts/posts.service';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})
export class RSVPComponent implements OnInit {
  post: Post;
  yourResponse: string;
  rsvp: string[] = ['Yes', 'No', 'Maybe'];
  emailId: string;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        const postId = paramMap.get('postId');
        this.postService.getPost(postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            type: postData.type,
            imagePath: postData.imagePath,
            date: postData.date,
            time: postData.time,
            host: postData.host,
            location: postData.location,
            content: postData.content,
            guests: postData.guests,
            accepted: postData.accepted,
            denied: postData.denied,
            ambiguous: postData.ambiguous
          };
        });
      }
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('emailId')) {
        this.emailId = paramMap.get('emailId');
      }
    });
  }

  sendResponse() {
    const acceptedEmail = this.post.accepted.find(x => x === this.emailId);
    const rejectedEmail = this.post.denied.find(x => x === this.emailId);
    const ambiguousEmail = this.post.ambiguous.find(x => x === this.emailId);


    switch (this.yourResponse) {
      case 'Yes': {
        this.post.accepted.push(this.emailId);
        this.postService.updatePost(
          this.post.id,
          this.post.title,
          this.post.type,
          this.post.imagePath,
          this.post.date,
          this.post.time,
          this.post.host,
          this.post.location,
          this.post.content,
          this.post.guests,
          this.post.accepted,
          this.post.denied,
          this.post.ambiguous
        );
        break;
      }
      case 'No': {
        this.post.denied.push(this.emailId);
        this.postService.updatePost(
          this.post.id,
          this.post.title,
          this.post.type,
          this.post.imagePath,
          this.post.date,
          this.post.time,
          this.post.host,
          this.post.location,
          this.post.content,
          this.post.guests,
          this.post.accepted,
          this.post.denied,
          this.post.ambiguous
        );
        break;
      }
      case 'Maybe': {
        this.post.ambiguous.push(this.emailId);
        this.postService.updatePost(
          this.post.id,
          this.post.title,
          this.post.type,
          this.post.imagePath,
          this.post.date,
          this.post.time,
          this.post.host,
          this.post.location,
          this.post.content,
          this.post.guests,
          this.post.accepted,
          this.post.denied,
          this.post.ambiguous
        );
        break;
      }
    }
  }
}
