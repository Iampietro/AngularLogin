import { Component, OnDestroy, OnInit   } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Subject } from 'rxjs';
import { takeUntil, tap, catchError } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Post } from '@models/post.model';
import { PostApiService } from '@api/post-api.service';
import { feedbackType } from '@utils/feedbackType.enum';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    CardModule,
    CommonModule,
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent implements OnDestroy, OnInit  {
  private destroy$ = new Subject<void>();
  postForm!: FormGroup;
  feedbackMessage: string | null = null; //I was having issues using either toast or dialog from primeng
  feedbackType: 'success' | 'error' | null = null;
  isEditMode: boolean = false;
  postId?: string;

  constructor(
    private fb: FormBuilder,
    private postApi: PostApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      userId: ['', Validators.required]
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.postId = id;
        this.loadPost(id);
      }
    });
  }

  loadPost(id: string) {
    this.postApi.getPost(id).pipe(
      tap((post) => {
        this.postForm.patchValue(post);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  onSubmit() {
    if (this.postForm.valid) {
      const postData: Post = this.postForm.value;

      if (this.isEditMode && this.postId) {
        postData.id = this.postId;
        this.postApi.editPost(this.postForm.value).pipe(
          tap((response) => {
            console.log('Post updated:', response);
            this.handleFeedbackMessage('Post updated successfully!', feedbackType.SUCCESS);
            this.postForm.reset();
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 2300);
          }),
          catchError((error) => {
            this.handleFeedbackMessage('Error updating post!', feedbackType.ERROR);
            console.error('Error updating post:', error);
            return of(null);
          }),
          takeUntil(this.destroy$)
        ).subscribe();
      } else {
        postData.id = this.generateId();  
        this.postApi.addPost(postData).pipe(
          tap((response) => {
            console.log('Post created:', response);
            this.handleFeedbackMessage('Post created successfully!', feedbackType.SUCCESS);
            this.postForm.reset();
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 2300);
          }),
          catchError((error) => {
            this.handleFeedbackMessage('Error creating post!', feedbackType.ERROR);
            console.error('Error creating post:', error);
            return of(null);
          }),
          takeUntil(this.destroy$)
        ).subscribe();
      }
    }
  }

  handleFeedbackMessage(message: string, type: feedbackType) {
    this.feedbackMessage = message;
    this.feedbackType = type;
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
