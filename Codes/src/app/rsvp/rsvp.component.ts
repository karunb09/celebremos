import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Post } from '../posts/posts.model';
import { PostService } from '../posts/posts.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})
export class RSVPComponent implements OnInit {
  post;
  yourResponse: string;
  foodResponse;
  itemsResponse;
  guestsNumber = 0;
  rsvp: string[] = ['Yes', 'No', 'Maybe'];
  options: string[] = [];
  emailId: string;
  postId: string;
  emailDetails;
  mode: string;
  showFood = false;
  showItems = false;
  showFoodMenu = false;
  questionsFromGuest;

  constructor(
    public postService: PostService,
    public route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        const postId = paramMap.get('postId');
        this.postId = postId;
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
            question: postData.question,
            itemstobring: postData.itemstobring,
            foodmenu: postData.foodmenu
          };
          for(let i = 0; i< this.post.question[0].options.length; i++){
            this.options.push(this.post.question[0].options[i].optionvalue);
          }
        });
      }
    });


    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('emailId')) {
        this.emailId = paramMap.get('emailId');
        this.postService
          .getEmailDetails(this.postId, this.emailId)
          .subscribe(email => {
            this.emailDetails = {
              _id: email._id,
              email: email.email,
              numberofguests: email.numberofguests,
              status: email.status,
              questionsFromGuest: email.questions
            };
          });
      }
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('email')) {
        this.emailId = paramMap.get('email');
        this.mode = 'edit';
        this.postService
          .getEmailDetails(this.postId, this.emailId)
          .subscribe(email => {
            this.emailDetails = {
              _id: email._id,
              email: email.email,
              numberofguests: email.numberofguests,
              status: email.status,
              questionsFromGuest: email.questions
            };
            if (this.emailDetails.status === 'accepted') {
              this.yourResponse = 'Yes';
            } else if (this.emailDetails.status === 'denied') {
              this.yourResponse = 'No';
            } else {
              this.yourResponse = 'Maybe';
            }
          });
      }
    });
  }

  sendResponse(form: NgForm) {
    let guests;
    let questions;
    if (form.value.guestsNumber) {
      guests = form.value.guestsNumber;
    } else {
      guests = this.guestsNumber;
    }
    if (form.value.questions) {
      questions = form.value.questions;
    } else {
      questions = '';
    }
    this.postService.updateRSVP(
      this.post.id,
      this.emailId,
      this.yourResponse,
      Number(guests),
      questions
    );
    this.openSnackBar(form);
  }

  openSnackBar(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.snackBar.open('RSVP Saved!', 'Dismiss', {
        duration: 2000
      });
    }
  }

  openFoodPoll() {
    this.showFood = true;
  }

  openItemsToBringDialog() {
    this.showItems = true;
  }

  openFoodDialog() {
    this.showFoodMenu = true;
  }
}
