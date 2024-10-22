import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';

import { PostFacadeService } from '../services/post-facade.service';
import { Post } from '@models/post.model';
import { PostItemComponent } from '../post-item/post-item.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [PostItemComponent, ButtonModule, PaginatorModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  paginatedPosts: Post[] = [];
  rows = 10;
  totalPosts = 0;
  private destroy$ = new Subject<void>();

  constructor(private postFacade: PostFacadeService, private router: Router) {
    this.postFacade.posts$.pipe(takeUntil(this.destroy$)).subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  ngOnInit(): void {
    this.postFacade.loadPosts().pipe(
      tap((posts: Post[]) => {
        this.totalPosts = this.posts.length;
        this.paginate({ first: 0, rows: this.rows });
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  paginate(event: any) {
    const start = event.first;
    const end = event.first + event.rows;
    this.paginatedPosts = this.posts.slice(start, end);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isAdmin(): boolean {
    return this.postFacade.isAdmin();
  }

  redirectToCreatePost() {
    this.router.navigate(['posts/new'])
  }
}
