import { Component, OnInit } from '@angular/core';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-postdetails',
  templateUrl: './postdetails.component.html',
  styleUrls: ['./postdetails.component.css']
})
export class PostdetailsComponent implements OnInit {

  post;
  postId: string;
  displayedColumns: string[] = [
    'email',
    'status',
    'numberofguests',
    'questions',
    'operations'
  ];

  dataSource;

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
            responses: postData.responses,
            question: postData.question,
            itemstobring: postData.itemstobring,
            foodmenu: postData.foodmenu
          };
          console.log(this.post.responses);

        });

      }

    });
  }


}
