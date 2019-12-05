import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { Post } from '../../posts.model';
import { PostService } from '../../posts.service';

@Component({
  selector: 'app-allevents-list',
  templateUrl: './allevents-list.component.html',
  styleUrls: ['./allevents-list.component.css']
})
export class AllEventsComponent implements OnInit, OnDestroy {
  posts: Post[] = [];

  postsAdded: Post[] = [];
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
        label: 'Saved Events',
        link: '/savedevents',
        index: 2
      },
      {
        label: 'Invited Events',
        link: '/pastevents',
        index: 3
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
    this.postService.getAllPosts(this.username);
    this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.isLoading = false;
      const sortedArray: Post[] = posts.sort((obj1, obj2) => {
        const obj1Date = obj1.date.slice(0, obj1.date.indexOf(', '));
        const obj2Date = obj2.date.slice(0, obj2.date.indexOf(', '));
        const obj1DateFormat = new Date(obj1Date);
        const obj2DateFormat = new Date(obj2Date);
        if (obj1DateFormat > obj2DateFormat) {
          return 1;
        } else if (obj1DateFormat < obj2DateFormat) {
          return -1;
        } else if (obj1DateFormat === obj2DateFormat) {
          if (obj1.time > obj2.title) {
            return 1;
          } else {
            return -1;
          }
        }
        return 0;
    });
      this.posts = sortedArray;
    });
    if (this.posts.length === 0 ) {
      this.isLoading = false;
    }
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
      }
    });
  }

}
