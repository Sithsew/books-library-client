import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';

import { AddBookComponent } from './add-book.component';
import { BookService } from 'src/app/services/book.service';
import { AuthorService } from 'src/app/services/author.service';
import { MaterialComponentsModule } from '../material-components/material-components.module';

describe('AddBookComponent', () => {
  let component: AddBookComponent;
  let fixture: ComponentFixture<AddBookComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AddBookComponent>>;
  let bookService: jasmine.SpyObj<BookService>;
  let authorService: jasmine.SpyObj<AuthorService>;
  const authors = [
    {
      _id: '65212bb7b3bfb29b74c05d51',
      first_name: 'J. K.',
      last_name: 'Rowling',
      createdAt: '2023-10-07T09:58:15.928Z',
      updatedAt: '2023-10-07T20:23:48.347Z',
      __v: 0,
    },
    {
      _id: '6521c730471622c35d72bfec',
      first_name: ' Earnest ',
      last_name: 'Hemingway',
      createdAt: '2023-10-07T21:01:37.014Z',
      updatedAt: '2023-10-07T21:01:37.014Z',
      __v: 0,
    },
  ];

  const response = {
    _id: '6521b40d471622c35d72be26',
    name: "Harry Potter and the Philosopher's Stone",
    isbn: 'SSDN234',
    author: {
      _id: '65212bb7b3bfb29b74c05d51',
      first_name: 'J. K.',
      last_name: 'Rowling',
      createdAt: '2023-10-07T09:58:15.928Z',
      updatedAt: '2023-10-07T20:23:48.347Z',
      __v: 0,
    },
    createdAt: '2023-10-07T19:39:57.210Z',
    updatedAt: '2023-10-07T20:24:06.019Z',
    __v: 0,
  };

  beforeEach(() => {
    const dialogMock = jasmine.createSpyObj('MatDialogRef', ['close']);
    const bookServiceMock = jasmine.createSpyObj('BookService', [
      'create',
      'update',
    ]);
    const authorServiceMock = jasmine.createSpyObj('AuthorService', ['getAll']);

    TestBed.configureTestingModule({
      declarations: [AddBookComponent],
      imports: [ReactiveFormsModule, MaterialComponentsModule],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: BookService, useValue: bookServiceMock },
        { provide: AuthorService, useValue: authorServiceMock },
      ],
    });

    fixture = TestBed.createComponent(AddBookComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<AddBookComponent>
    >;
    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    authorService = TestBed.inject(
      AuthorService
    ) as jasmine.SpyObj<AuthorService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    authorService.getAll.and.returnValue(of(authors));

    component.ngOnInit();
    expect(component.bookForm).toBeDefined();
  });

  it('should populate form if data is provided', () => {
    const bookData = {
      name: 'BookName',
      author: { _id: 'authorId' },
      isbn: '1234567890',
    };
    component.data = { book: bookData };
    authorService.getAll.and.returnValue(of(authors));

    component.ngOnInit();

    expect(component.bookForm.value).toEqual({
      name: 'BookName',
      authorId: 'authorId',
      isbn: '1234567890',
    });
  });

  it('should call service update method on form submission', () => {
    const bookData = {
      name: 'BookName',
      author: { _id: 'authorId' },
      isbn: '1234567890',
    };

    bookService.update.and.returnValue(of(response));
    authorService.getAll.and.returnValue(of(authors));

    component.data = { book: { _id: 'bookId', ...bookData } };
    component.ngOnInit();
    component.onSubmit();

    expect(bookService.update).toHaveBeenCalledWith('bookId', {
      name: 'BookName',
      authorId: 'authorId',
      isbn: '1234567890',
    });
    expect(dialogRef.close).toHaveBeenCalledWith({
      name: 'BookName',
      authorId: 'authorId',
      isbn: '1234567890',
    });
  });

  it('should call service create method on form submission', () => {
    const formData = {
      name: "Harry Potter and the Philosopher's Stone",
      isbn: 'SSDN234',
      authorId: '65212bb7b3bfb29b74c05d51',
    };
    bookService.create.and.returnValue(of(response));
    authorService.getAll.and.returnValue(of(authors));
    component.data = undefined;
    component.ngOnInit();
    component.bookForm.patchValue(formData);
    component.onSubmit();

    expect(bookService.create).toHaveBeenCalledWith(formData);
    expect(dialogRef.close).toHaveBeenCalledWith(formData);
  });

  it('should fetch authors on initialization', () => {
    authorService.getAll.and.returnValue(of(authors));

    component.ngOnInit();

    expect(authorService.getAll).toHaveBeenCalled();
    expect(component.authors).toEqual(authors);
  });

  it('should close dialog on cancel', () => {
    component.onNoClick();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
