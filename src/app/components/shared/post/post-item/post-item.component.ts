import { Component, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { Post } from '@models/post.model';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [CardModule, ButtonModule],
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.css'
})
export class PostItemComponent {
  @Input() post!: Post;
  @Input() isAdmin!: boolean;

  constructor(
    private router: Router,
  ) { }

  editPost(post: Post) {
    this.router.navigate(['posts/edit/', post.id])
  }
}
