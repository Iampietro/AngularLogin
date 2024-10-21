import { Component, OnDestroy  } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Subject } from 'rxjs';
import { takeUntil, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Post } from '@models/post.model';
import { PostApiService } from '@api/post-api.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    CardModule,
    CommonModule
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  postForm: FormGroup;
  feedbackMessage: string | null = null; //I was having issues using either toast or dialog from primeng
  feedbackType: 'success' | 'error' | null = null;

  constructor(
    private fb: FormBuilder,
    private postApi: PostApiService,
    private router: Router,
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      userId: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      const newPost: Post = {
        id: this.generateId(),
        title: this.postForm.value.title,
        body: this.postForm.value.body,
        userId: this.postForm.value.userId
      };

      this.postApi.addPost(newPost).pipe(
        tap((response) => {
          console.log('Post created:', response);
          this.feedbackMessage = 'Post created successfully!';
          this.feedbackType = 'success';
          this.postForm.reset();
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2300);
        }),
        catchError((error) => {
          this.feedbackMessage = 'Error creating post!';
          this.feedbackType = 'error';
          console.error('Error creating post:', error);
          return of(null);
        }),
        takeUntil(this.destroy$)
      ).subscribe();
    }
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
