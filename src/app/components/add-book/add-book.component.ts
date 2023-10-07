import { Component, Inject } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorService } from 'src/app/services/author.service';
import { IAuthor } from 'src/app/models/author.model';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent {
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
    this.bookForm.setValue({
      name: book.name,
      authorId: book.author._id,
      isbn: book.isbn,
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const newBook = this.bookForm.value;

      if (this.data && this.data.book) {
        this.bookService.update(this.data.book._id, newBook).subscribe(
          () => {
            console.log('Book updated successfully');
            this.dialogRef.close(newBook);
          },
          (error) => {
            console.error('Error updating book:', error);
          }
        );
      } else {
        this.bookService.create(newBook).subscribe(
          (response) => {
            console.log('Book added successfully:', response);
            this.dialogRef.close(newBook);
          },
          (error) => {
            console.error('Error adding book:', error);
          }
        );
      }
    }
  }

  getAuthors(): void {
    this.authorService.getAll().subscribe(
      (response: any) => {
        this.authors = response;
        console.log('Authors:', response);
      },
      (error) => {
        console.error('Error :', error);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
