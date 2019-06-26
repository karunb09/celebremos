import { Component, EventEmitter } from '@angular/core';

import { Post } from '../posts.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
   postCreated = new EventEmitter<Post>();

  constructor(public postService: PostService) {}

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postService.addPosts(form.value.title, form.value.content);
    form.resetForm();
  }

}
