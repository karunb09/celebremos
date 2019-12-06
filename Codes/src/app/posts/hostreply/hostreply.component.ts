import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostService } from '../posts.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-hostreply',
  templateUrl: './hostreply.component.html',
  styleUrls: ['./hostreply.component.css']
})
export class HostreplyComponent implements OnInit {

  answerFromHost;
  emailId: string;
  emailDetails: { _id: string; email: string; numberofguests: string; status: string; questionsFromGuest: string; };
  postId: string;
  useremailId: string;

  constructor(private route: ActivatedRoute, private postService: PostService,
    private snackBar: MatSnackBar,
    private authService: AuthService) { }

  ngOnInit() {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        const postId = paramMap.get('postId');
        this.postId = postId;
      }
    });
    this.authService
      .getAuthEmailIdListener()
      .subscribe(message => (this.useremailId = message));
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
  }

  onReset(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.sendMail(form.value.answer, this.emailId, this.useremailId);
    this.openSnackBar();
  }

  openSnackBar() {
    this.snackBar.open('Email is sent to your guest', 'Dismiss', {
      duration: 2000
    });
  }

}
