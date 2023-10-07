import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ViewBookComponent } from './view-book.component';
import { BookService } from 'src/app/services/book.service';
import { MaterialComponentsModule } from '../material-components/material-components.module';

describe('ViewBookComponent', () => {
  let component: ViewBookComponent;
  let fixture: ComponentFixture<ViewBookComponent>;
  let activatedRoute: ActivatedRoute;
  let bookService: jasmine.SpyObj<BookService>;

  const mockBook = { id: '1', title: 'Sample Book' };

  beforeEach(() => {
    const activatedRouteMock = {
      params: of({ id: '1' }),
    };

    const bookServiceMock = jasmine.createSpyObj('BookService', ['getById']);
    bookServiceMock.getById.and.returnValue(of(mockBook));

    TestBed.configureTestingModule({
      declarations: [ViewBookComponent],
      imports: [MaterialComponentsModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: BookService, useValue: bookServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewBookComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load book on initialization', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.book).toEqual(mockBook);
    expect(bookService.getById).toHaveBeenCalledWith('1');
  }));

  it('should handle error when loading book', fakeAsync(() => {
    const errorMessage = 'Error fetching book';
    bookService.getById.and.returnValue(throwError(errorMessage));

    const consoleErrorSpy = spyOn(console, 'error');

    fixture.detectChanges();
    tick();

    expect(component.book).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching book:',
      errorMessage
    );
  }));
});
