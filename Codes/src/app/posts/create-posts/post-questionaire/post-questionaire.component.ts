import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { PostService } from '../../posts.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Post } from '../../posts.model';
import { DialogOverviewExampleDialog } from './add-poll/dialog-overview-example-dialog';
import { ItemsToBringDialog } from './items-to-bring/items-to-bring-dialog';
import { AddFoodItemsDialog } from './add-food-menu/add-food-items-dialog';
import { AuthService } from 'src/app/auth.service';

export interface DialogData {
  question: string;
  options: [string];
}

export interface ItemsToBring {
  items: [
    {
      itemname: string;
      quantity: string;
    }
  ];
}

export interface Food {
  list: [string];
}

@Component({
  selector: 'app-post-questionaire',
  templateUrl: './post-questionaire.component.html',
  styleUrls: ['./post-questionaire.component.css']
})
export class PostQuestionaireComponent implements OnInit {
  post: Post;
  yourResponse: string;
  guestsNumber = 0;
  rsvp: string[] = ['Yes', 'No', 'Maybe'];
  emailId: string;
  postId: string;
  userId: string;
  emailDetails;
  mode: string;
  question: string;
  options: string[] = [];
  items: ItemsToBring;
  list: string[] = [];
  displayedColumns: string[] = ['itemname', 'quantity'];

  constructor(
    public postService: PostService,
    public route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public authService: AuthService,
    public dialog: MatDialog
  ) {
    this.options.push('');
    this.options.push('');
    this.items = { items: [{ itemname: '', quantity: '' }]};
    this.list.push('');
  }

  ngOnInit() {
    this.authService
      .getAuthUsernameListener()
      .subscribe(message => (this.userId = message));
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
            guests: postData.guests
          };
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
              status: email.status
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
              status: email.status
            };
            if (this.emailDetails.status === 'accepted') {
              this.yourResponse = 'Yes';
            } else if (this.emailDetails === 'denied') {
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
    if (form.value.guestsNumber) {
      guests = form.value.guestsNumber;
    } else {
      guests = this.guestsNumber;
    }
    this.postService.updateRSVP(
      this.post.id,
      this.emailId,
      this.yourResponse,
      Number(guests),
      ''
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

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '350px',
      data: { question: this.question, options: this.options }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.question = result.question;
      this.options = result.options;
    });
  }

  openAnotherDialog(): void {
    const dialogRef = this.dialog.open(ItemsToBringDialog, {
      width: '450px',
      data: { items: this.items.items }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.items.items = result;
    });
  }

  openFoodDialog(): void {
    const dialogRef = this.dialog.open(AddFoodItemsDialog, {
      width: '350px',
      data: { list: this.list}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.list = result.list;
    });
  }

  sendInvitationsWithOptions() {
    this.postService.updatePostwithPoll(this.postId, this.userId, this.question, this.options, this.items, this.list);
  }
}
