import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BookService } from 'src/app/services/book.service';
import { AuthorService } from 'src/app/services/author.service';
import { IAuthor } from 'src/app/models/author.model';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit {
  bookForm!: FormGroup;
  authors: IAuthor[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddBookComponent>,
    private formBuilder: FormBuilder,
    private bookService: BookService,
    private authorService: AuthorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAuthors();
    if (this.data && this.data.book) {
      this.populateForm(this.data.book);
    }
  }

  initForm(): void {
    this.bookForm = this.formBuilder.group({
      name: ['', Validators.required],
      authorId: ['', Validators.required],
      isbn: ['', Validators.required],
    });
  }

  populateForm(book: any): void {
    const { name, author, isbn } = book;
    this.bookForm.setValue({
      name,
      authorId: author._id,
      isbn,
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const newBook = this.bookForm.value;

      const handleResponse = (response: any, action: string): void => {
        console.log(`Book ${action} successfully:`, response);
        this.dialogRef.close(newBook);
      };

      const handleError = (error: any, action: string): void => {
        console.error(`Error ${action} newBook:`, error);
      };

      if (this.data && this.data.book) {
        this.bookService.update(this.data.book._id, newBook).subscribe(
          (response) => handleResponse(response, 'updated'),
          (error) => handleError(error, 'updating')
        );
      } else {
        this.bookService.create(newBook).subscribe(
          (response) => handleResponse(response, 'added'),
          (error) => handleError(error, 'adding')
        );
      }
    }
  }

  getAuthors(): void {
    this.authorService.getAll().subscribe(
      (response: IAuthor[]) => {
        this.authors = response;
        console.log('Authors:', response);
      },
      (error) => {
        console.error('Error fetching authors:', error);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
