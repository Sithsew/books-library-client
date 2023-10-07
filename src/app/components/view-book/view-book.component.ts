import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-view-book',
  templateUrl: './view-book.component.html',
  styleUrls: ['./view-book.component.scss'],
})
export class ViewBookComponent implements OnInit {
  book: any;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.loadBook();
  }

  private loadBook(): void {
    this.route.params.subscribe((params) => {
      const bookId = params['id'];
      this.bookService.getById(bookId).subscribe(
        (data) => {
          this.book = data;
        },
        (error) => {
          console.error('Error fetching book:', error);
        }
      );
    });
  }
}
