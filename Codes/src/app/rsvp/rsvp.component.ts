import { Component, OnInit, OnDestroy } from '@angular/core';
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

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        let postId = paramMap.get('postId');
        this.postService.getPost(postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            type: postData.type,
            date: postData.date,
            time: postData.time,
            host: postData.host,
            location: postData.location,
            street: postData.street,
            city: postData.city,
            state: postData.state,
            content: postData.content,
            guests: postData.guests,
            responses: postData.responses,
          };
        });
      }
    });
  }

  sendResponse(){

  }

}
