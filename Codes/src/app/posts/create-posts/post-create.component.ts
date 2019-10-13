import { Component, OnInit, ViewChild } from '@angular/core';
import { Post } from '../posts.model';
import { NgForm, FormControl } from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { FnParam } from '@angular/compiler/src/output/output_ast';

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
  constructor(public postService: PostService, public route: ActivatedRoute) {}
  private mode = 'create';

  formattedaddress = '';

  events: Event[] = [
    { value: 'Anniversary', viewValue: 'Anniversary' },
    { value: 'Baby Shower', viewValue: 'Baby Shower' },
    { value: 'Bachelor Party', viewValue: 'Bachelor Party' },
    { value: 'Wedding', viewValue: 'Wedding' },
    { value: 'Beach Party', viewValue: 'Beach Party' },
    { value: 'Dinner Party', viewValue: 'Dinner Party' },
    { value: 'Birthday', viewValue: 'Birthday' },
    { value: 'Engagement Party', viewValue: 'Engagement Party' },
    { value: 'Housewarming', viewValue: 'Housewarming' }
  ];

  private postId: string;

  post: Post;
  newGuests: [string] = ['celebremos'];

  date = new FormControl(new Date().toISOString());

  placesRef: GooglePlaceDirective;

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (form.value.guests.includes(',')) {
      const anotherGuests = form.value.guests.split(',');
      // tslint:disable-next-line: prefer-for-of
      // tslint:disable-next-line: variable-name
      for (let _i = 0; _i < anotherGuests.length; _i++) {
        if (_i === 0) {
          this.newGuests.pop();
        }
        this.newGuests.push(anotherGuests[_i].trim());
      }
    } else {
      this.newGuests[0] = form.value.guests;
    }
    console.log(this.newGuests);
    form.value.location = this.formattedaddress;

    if (this.mode === 'create') {
      this.postService.addPosts(
        form.value.title,
        form.value.type,
        '12/13/2019',
        form.value.time,
        form.value.host,
        form.value.location,
        form.value.content,
        this.newGuests,
        ['0'],
        ['0'],
        ['0'],
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
        form.value.content,
        this.newGuests,
        ['0'],
        ['0'],
        ['0'],
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
            content: postData.content,
            guests: postData.guests,
            accepted: postData.accepted,
            denied: postData.denied,
            ambiguous: postData.ambiguous,
          };
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  public handleAddressChange(address: Address) {
    this.formattedaddress = address.formatted_address;

  }

  importcsv(){
    console.log("in function")
    window.location.href = "/csvupload";
  }
}
