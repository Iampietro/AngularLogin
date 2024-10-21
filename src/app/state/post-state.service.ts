import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '../models/post.model'

@Injectable({
  providedIn: 'root'
})
export class PostStateService {
  private initialPost: Post[] = [{
    id: '',
    title: '',
    body: '',
    userId: '',
  }];

  private postsSubject = new BehaviorSubject<Post[]>(this.initialPost);
  posts$: Observable<Post[]> = this.postsSubject.asObservable();

  setPosts(posts: Post[]): void {
    this.postsSubject.next(posts);
  }

  addPost(newPost: Post): void {
    const currentPosts = this.postsSubject.value;
    this.postsSubject.next([...currentPosts, newPost]);
  }

  editPost(updatedPost: Post): void {
    const currentPosts = this.postsSubject.value.map((post) =>
      post.id === updatedPost.id ? updatedPost : post
    );
    this.postsSubject.next(currentPosts);
  }
}
