import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../posts.model';
import { PostService } from '../posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts = [];

  isLoading = false;

  username: string;
  accepted = [];
  denied = [];
  ambiguous = [];
  noreply = [];
  totalguests = [];
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
    this.postService.getPosts(this.username);
    this.postService.getPostUpdateListener().subscribe(async (posts: Post[]) => {
      const sortedArray: Post[] = await posts.sort((obj1, obj2) => {
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
      this.findaccepted();
      this.isLoading = false;
    });
      this.isLoading = false;


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

  findaccepted() {
    for (let i = 0; i < this.posts.length; i++ ) {
      let noreplycounter = 0;
      let acceptedcounter = 0;
      let deniedcounter = 0;
      let ambiguouscounter = 0;
      let totalguestscounter = 0;
      for (let j = 0; j < this.posts[i].responses.length; j++ ) {
        if (this.posts[i].responses[j].status === 'no reply') {
          noreplycounter++;
        } else if (this.posts[i].responses[j].status === 'accepted') {
          acceptedcounter++;
          const guestsss = + this.posts[i].responses[j].numberofguests;
          totalguestscounter += guestsss;
        } else if (this.posts[i].responses[j].status === 'denied') {
          deniedcounter++;
        } else if (this.posts[i].responses[j].status === 'may be') {
          ambiguouscounter++;
          const guestsss = + this.posts[i].responses[j].numberofguests;
          totalguestscounter += guestsss;
        }
      }
      this.noreply.push(noreplycounter);
      this.accepted.push(acceptedcounter);
      this.denied.push(deniedcounter);
      this.ambiguous.push(ambiguouscounter);
      this.totalguests.push(totalguestscounter);
    }
  }
}
