import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../posts.model';
import { PostService } from '../posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];

  isLoading: boolean;

  username: string;

  constructor(public postService: PostService, private authService: AuthService) { }

  private postsSub: Subscription;

  ngOnInit() {
    this.isLoading = false;
    this.authService.getAuthUsernameListener().subscribe(message => this.username = message);
    this.postService.getPosts(this.username);
    this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;

    });
  }

  onDelete(post: string) {
    this.postService.deletePost(post, this.username);
  }

  ngOnDestroy() {
    // this.postsSub.unsubscribe();
  }
}
