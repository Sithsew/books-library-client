import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IBook } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { AddBookComponent } from '../add-book/add-book.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'author', 'actions'];
  dataSource = new MatTableDataSource<IBook>();
  isLoading = false;
  totalBooks = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  selectedBook: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getAll(this.currentPage + 1, this.pageSize).subscribe(
      (data: any) => {
        this.dataSource.data = data.data;

        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.totalBooks = data.pagination.totalBooks;
          this.paginator.length = this.totalBooks;
        });

        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.loadBooks();
  }

  openAddEditBookDialog(book?: any): void {
    const dialogRef = this.dialog.open(AddBookComponent, {
      width: '350px',
      data: { book: book },
    });

    dialogRef.afterClosed().subscribe((newBook: any) => {
      console.log('The dialog was closed with result:', newBook);
      if (newBook) {
        this.loadBooks();
      }
    });
  }

  onClickEdit(book?: any): void {
    this.openAddEditBookDialog(book);
  }

  onClickAddBook(): void {
    this.openAddEditBookDialog();
  }

  onClickDelete(bookId: string) {
    this.bookService.delete(bookId).subscribe(
      () => {
        this.loadBooks();
      },
      (error) => {
        console.error('Error deleting book:', error);
      }
    );
  }

  onClickView(bookId: string): void {
    this.router.navigate(['/book-details', bookId]);
  }

  onClickRow(row: IBook): void {
    if (this.selectedBook !== row) {
      this.selectedBook = row;
    } else {
      this.selectedBook = null;
    }
  }
}
