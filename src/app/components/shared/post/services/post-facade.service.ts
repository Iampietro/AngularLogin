import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { PostApiService } from '@api/post-api.service';
import { PostStateService } from '@state/post-state.service';
import { UserStateService } from '@state/user-state.service';
import { Post } from '@models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostFacadeService {

  constructor(
    private postApiService: PostApiService,
    private postStateService: PostStateService,
    private userStateService: UserStateService
  ) { }

  loadPosts(): Observable<Post[]> {
    return this.postApiService.getPosts().pipe(
      tap((posts) => this.postStateService.setPosts(posts))
    );
  }

  addPost(newPost: Post): Observable<Post> {
    return this.postApiService.addPost(newPost);
  }

  editPost(updatedPost: Post): Observable<Post> {
    return this.postApiService.editPost(updatedPost);
  }

  get posts$() {
    return this.postStateService.posts$;
  }

  isAdmin(): boolean {
    return this.userStateService.isAdmin();
  }
}
