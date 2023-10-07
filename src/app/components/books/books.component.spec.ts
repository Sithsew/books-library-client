import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { BooksComponent } from './books.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';
import { AddBookComponent } from '../add-book/add-book.component';
import { of } from 'rxjs';
import { MaterialComponentsModule } from '../material-components/material-components.module';

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;
  let dialog: MatDialog;
  let router: Router;
  let bookService: BookService;
  let dialogRef: MatDialogRef<AddBookComponent>;
  const matDialogRefMock = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BooksComponent],
      imports: [MaterialComponentsModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },

        { provide: MatDialog, useValue: { open: () => {} } },
        { provide: Router, useValue: { navigate: () => {} } },
        {
          provide: BookService,
          useValue: {
            getAll: () => of({ data: [], pagination: { totalBooks: 0 } }),
            delete: () => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    router = TestBed.inject(Router);
    bookService = TestBed.inject(BookService);
    dialogRef = TestBed.inject(MatDialogRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
