import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { Post } from '../../posts.model';
import { PostService } from '../../posts.service';

@Component({
  selector: 'app-invitedevents-list',
  templateUrl: './invitedevents-list.component.html',
  styleUrls: ['./invitedevents-list.component.css']
})
export class InvitedEventComponent implements OnInit, OnDestroy {
  posts: Post[] = [];

  isLoading = false;

  username: string;

  title = 'angular-material-tab-router';
  navLinks: any[];
  activeLinkIndex = -1;


  constructor(
    public postService: PostService,
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.navLinks = [
      {
        label: 'All Events',
        link: '/allevents',
        index: 0
      },
      {
        label: 'Hosted Events',
        link: '/hostedevents',
        index: 1
      },
      {
        label: 'Invited Events',
        link: '/invitedevents',
        index: 2
      },
      {
        label: 'Saved Events',
        link: '/savedevents',
        index: 3
      },
      {
        label: 'Past Events',
        link: '/pastevents',
        index: 4
      }
    ];
  }

  private postsSub: Subscription;

  ngOnInit() {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
  });
    this.isLoading = true;
    this.authService
      .getAuthUsernameListener()
      .subscribe(message => (this.username = message));
    this.postService.getInvitedPosts(this.username);
    this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }

  onDelete(post: string) {
    this.postService.deletePost(post, this.username);
  }

  ngOnDestroy() {
    // this.postsSub.unsubscribe();
  }

  openDialog(postId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to cancel the event?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        this.onDelete(postId);
        // DO SOMETHING
      }
    });
  }

  onSendInvitations(postId: string) {
    let requiredPost: Post;
    for(let i = 0; i < this.posts.length; i++) {
      if(postId === this.posts[i].id){
        requiredPost = this.posts[i];
      }
    }
    this.postService.sendInvitations(
      requiredPost.id,
      requiredPost.title,
      requiredPost.type,
      requiredPost.imagePath,
      requiredPost.date,
      requiredPost.time,
      requiredPost.host,
      requiredPost.location,
      requiredPost.content,
      requiredPost.guests,
      requiredPost.accepted,
      requiredPost.denied,
      requiredPost.ambiguous,
      this.username
    );
  }

}
