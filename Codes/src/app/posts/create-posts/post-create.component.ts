import { Component, OnInit } from '@angular/core';
import { Post } from '../posts.model';
import { NgForm, FormControl } from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

export interface Event {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';

  events: Event[] = [
    { value: 'anniversary', viewValue: 'Anniversary' },
    { value: 'babyshower', viewValue: 'Baby Shower' },
    { value: 'bachelorparty', viewValue: 'Bachelor Party' },
    { value: 'wedding', viewValue: 'Wedding' },
    { value: 'beachparty', viewValue: 'Beach Party' },
    { value: 'dinnerparty', viewValue: 'Dinner Party' },
    { value: 'birthday', viewValue: 'Birthday' },
    { value: 'engagementparty', viewValue: 'Engagement Party' },
    { value: 'housewarming', viewValue: 'Housewarming' }
  ];

  private postId: string;

  post: Post;

  date = new FormControl(new Date().toISOString());

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    let newGuests =  form.value.guests.split(',');
    if (this.mode === 'create') {
      this.postService.addPosts(
        form.value.title,
        form.value.type,
        '12/13/2019',
        form.value.time,
        form.value.host,
        form.value.location,
        form.value.street,
        form.value.city,
        form.value.state,
        form.value.content,
        newGuests,
        ['0'],
        ['0'],
        ['0']
      );
    } else {
      this.postService.updatePost(
        this.postId,
        form.value.title,
        form.value.type,
        '12/13/2019',
        form.value.time,
        form.value.host,
        form.value.location,
        form.value.street,
        form.value.city,
        form.value.state,
        form.value.content,
        newGuests,
        ['0'],
        ['0'],
        ['0']
      );
    }
    form.resetForm();
  }

  ngOnInit() {
    this.date = new FormControl(new Date());
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe(postData => {
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
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
}
