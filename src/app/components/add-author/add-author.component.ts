import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAuthor } from 'src/app/models/author.model';
import { AuthorService } from 'src/app/services/author.service';

@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.scss'],
})
export class AddAuthorComponent implements OnInit {
  authorForm!: FormGroup;

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

  populateForm(author: IAuthor): void {
    this.authorForm.patchValue({
      first_name: author.first_name,
      last_name: author.last_name,
    });
  }

  onSubmit(): void {
    if (this.authorForm.valid) {
      const newAuthor = this.authorForm.value;

      const handleResponse = (response: any, action: string): void => {
        console.log(`Author ${action} successfully:`, response);
        this.dialogRef.close(newAuthor);
      };

      const handleError = (error: any, action: string): void => {
        console.error(`Error ${action} Author:`, error);
      };

      if (this.data && this.data.author) {
        this.authorService.update(this.data.author._id, newAuthor).subscribe(
          (response) => handleResponse(response, 'updated'),
          (error) => handleError(error, 'updating')
        );
      } else {
        this.authorService.create(newAuthor).subscribe(
          (response) => handleResponse(response, 'added'),
          (error) => handleError(error, 'adding')
        );
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
