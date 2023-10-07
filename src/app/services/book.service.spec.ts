import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookService } from './book.service';
import { environment } from 'src/environments/environment';
import { IBook } from '../models/book.model';
import { ICreateBook } from '../models/create-book.model';

describe('BookService', () => {
  let service: BookService;
  let httpTestingController: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/books`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookService],
    });

    service = TestBed.inject(BookService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all books', () => {
    const mockBooks: IBook[] = [
      {_id: '1', name: 'Book 1' },
      {_id: '2', name: 'Book 2' },
    ];

    service.getAll(1, 10).subscribe((books) => {
      expect(books).toEqual(mockBooks);
    });

    const req = httpTestingController.expectOne(`${apiUrl}?page=1&pageSize=10`);
    expect(req.request.method).toEqual('GET');

    req.flush(mockBooks);
  });

  it('should get book by_id', () => {
    const bookId = '1';
    const mockBook: IBook = {_id: '1', name: 'Book 1' };

    service.getById(bookId).subscribe((book) => {
      expect(book).toEqual(mockBook);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/${bookId}`);
    expect(req.request.method).toEqual('GET');

    req.flush(mockBook);
  });

  it('should create book', () => {
    const newBook: ICreateBook = { name: 'New Book', authorId: '1', isbn: '1234567890' };

    service.create(newBook).subscribe((createdBook) => {
      expect(createdBook).toEqual(newBook);
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newBook);

    req.flush(newBook);
  });

  it('should update book', () => {
    const bookId = '1';
    const updatedBook: ICreateBook = { name: 'Updated Book', authorId: '2', isbn: '0987654321' };

    service.update(bookId, updatedBook).subscribe((book) => {
      expect(book).toEqual(updatedBook);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/${bookId}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(updatedBook);

    req.flush(updatedBook);
  });

  it('should delete book', () => {
    const bookId = '1';

    service.delete(bookId).subscribe();

    const req = httpTestingController.expectOne(`${apiUrl}/${bookId}`);
    expect(req.request.method).toEqual('DELETE');

    req.flush({});
  });
});
