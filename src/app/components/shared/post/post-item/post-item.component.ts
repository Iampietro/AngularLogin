import { Component, Input  } from '@angular/core';
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

  editPost(post: Post) {
    console.log('Edit post:', this.post);
  }
}
