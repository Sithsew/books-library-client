import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-view-book',
  templateUrl: './view-book.component.html',
  styleUrls: ['./view-book.component.scss'],
})
export class ViewBookComponent {
  book: any;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const bookId = params['id'];
      this.bookService.getById(bookId).subscribe((data) => {
        this.book = data;
      });
    });
  }
}
