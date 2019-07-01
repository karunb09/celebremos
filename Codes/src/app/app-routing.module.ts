import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { CarouselComponent } from './carousel/app-carousel.component';
import { PostCreateComponent } from './posts/create-posts/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

// Setting path to redirect next page

const routes: Routes =  [
  { path: '', component: CarouselComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'create', component: PostCreateComponent },
  { path: 'edit/:postId', component: PostCreateComponent },
  { path: 'list', component: PostListComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
