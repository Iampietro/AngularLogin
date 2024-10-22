import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Post } from '@models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  addPost(newPost: Post): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, newPost);
  }

  editPost(updatedPost: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/posts/${updatedPost.id}`, updatedPost);
  }

  getPost(postId: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${postId}`);
  }
}
