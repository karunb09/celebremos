import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../posts.model';
import { PostService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];

  isLoading = false;

  constructor(public postService: PostService) { }

  private postsSub: Subscription;

  ngOnInit() {
    this.postService.getPosts();
    this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  onDelete(post: string) {
    this.postService.deletePost(post);
  }

  ngOnDestroy() {
    // this.postsSub.unsubscribe();
  }
}
