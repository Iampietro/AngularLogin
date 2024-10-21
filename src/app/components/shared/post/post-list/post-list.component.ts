import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';

import { PostFacadeService } from '../services/post-facade.service';
import { Post } from '@models/post.model';
import { PostItemComponent } from '../post-item/post-item.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [PostItemComponent, ButtonModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private destroy$ = new Subject<void>();

  constructor(private postFacade: PostFacadeService, private router: Router) {
    this.postFacade.posts$.pipe(takeUntil(this.destroy$)).subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  ngOnInit(): void {
    this.postFacade.loadPosts().pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isAdmin(): boolean {
    return this.postFacade.isAdmin();
  }

  redirectToCreatePost() {
    this.router.navigate(['/create-post'])
  }
}
