import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAuthor } from 'src/app/models/author.model';
import { AuthorService } from 'src/app/services/author.service';

@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.scss'],
})
export class AddAuthorComponent {
  authorForm!: FormGroup;
  authors: IAuthor[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddAuthorComponent>,
    private formBuilder: FormBuilder,
    private authorService: AuthorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.data && this.data.author) {
      this.populateForm(this.data.author);
    }
  }

  initForm(): void {
    this.authorForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
    });
  }

  populateForm(author: any): void {
    this.authorForm.setValue({
      first_name: author.first_name,
      last_name: author.last_name,
    });
  }

  onSubmit(): void {
    if (this.authorForm.valid) {
      const newAuthor = this.authorForm.value;

      if (this.data && this.data.author) {
        this.authorService.update(this.data.author._id, newAuthor).subscribe(
          () => {
            console.log('Author updated successfully');
            this.dialogRef.close(newAuthor);
          },
          (error) => {
            console.error('Error updating Author:', error);
          }
        );
      } else {
        this.authorService.create(newAuthor).subscribe(
          (response) => {
            console.log('Author added successfully:', response);
            this.dialogRef.close(newAuthor);
          },
          (error) => {
            console.error('Error adding Author:', error);
          }
        );
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
