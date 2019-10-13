import { Component, OnInit, ViewChild } from '@angular/core';
import { Post } from '../posts.model';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { MatDatepickerInputEvent } from '@angular/material';
import { mimeType } from './mime-type.validator';

export interface Eventss {
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

  mode = 'create';

  minDate = new Date();

  formattedaddress = '';

  events: Eventss[] = [
    { value: 'Anniversary', viewValue: 'Anniversary' },
    { value: 'Baby Shower', viewValue: 'Baby Shower' },
    { value: 'Bachelor Party', viewValue: 'Bachelor Party' },
    { value: 'Wedding', viewValue: 'Wedding' },
    { value: 'Beach Party', viewValue: 'Beach Party' },
    { value: 'Dinner Party', viewValue: 'Dinner Party' },
    { value: 'Birthday', viewValue: 'Birthday' },
    { value: 'Engagement Party', viewValue: 'Engagement Party' },
    { value: 'Housewarming', viewValue: 'Housewarming' },
    { value: 'Custom', viewValue: 'Custom' }
  ];

  private postId: string;

  post: Post;

  imagePreview: string;

  newGuests: [string] = ['celebremos'];

  date = new FormControl(new Date());

  newDate;

  image;

  form: FormGroup;

  customType: string;

  placesRef: GooglePlaceDirective;

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    if (this.form.value.guests == null) {
      this.newGuests.pop();
    } else if (this.form.value.guests.includes(',')) {
      const anotherGuests = this.form.value.guests.split(',');
      // tslint:disable-next-line: prefer-for-of
      // tslint:disable-next-line: variable-name
      for (let _i = 0; _i < anotherGuests.length; _i++) {
        if (_i === 0) {
          this.newGuests.pop();
        }
        this.newGuests.push(anotherGuests[_i].trim());
      }
    } else {
      this.newGuests[0] = this.form.value.guests;
    }

    if (this.mode === 'create') {
      this.form.value.location = this.formattedaddress;
      this.postService.addPosts(
        this.form.value.title,
        this.form.value.type,
        this.form.value.image,
        this.newDate,
        this.form.value.time,
        this.form.value.host,
        this.form.value.location,
        this.form.value.content,
        this.newGuests,
        ['0'],
        ['0'],
        ['0']
      );
    } else {
      if (this.formattedaddress) {
        this.form.value.location = this.formattedaddress;
      }
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.type,
        this.form.value.imagePath,
        this.newDate,
        this.form.value.time,
        this.form.value.host,
        this.form.value.location,
        this.form.value.content,
        this.newGuests,
        ['0'],
        ['0'],
        ['0']
      );
    }
    this.form.reset();
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8)]
      }),
      type: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }),
      date: new FormControl(null, { validators: [Validators.required] }),
      time: new FormControl(null, { validators: [Validators.required] }),
      host: new FormControl(null, { validators: [] }),
      location: new FormControl(null, { validators: [Validators.required] }),
      guests: new FormControl(null, { validators: [] }),
      content: new FormControl('', { validators: [] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe(postData => {
          const nowDate = postData.date.slice(postData.date.indexOf(', ') + 2);
          const dateArray = nowDate.split('/');
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
          this.form.setValue({
            title: this.post.title,
            type: this.post.type,
            image: this.post.imagePath,
            date: new Date(
              Number(dateArray[2]),
              Number(dateArray[0]) - 1,
              Number(dateArray[1])
            ),
            time: this.post.time,
            host: this.post.host,
            location: this.post.location,
            content: this.post.content,
            guests: this.post.guests
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  public handleAddressChange(address: Address) {
    this.formattedaddress = address.formatted_address;
    console.log(this.formattedaddress);
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    const date = `${event.value}`;
    this.newDate = date
      .slice(0, date.indexOf('00:00:00') - 1)
      .concat(
        ', ' +
          `${event.value.getMonth() + 1}` +
          '/' +
          `${event.value.getDate()}` +
          '/' +
          `${event.value.getFullYear()}`
      );
    console.log(this.newDate);
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
