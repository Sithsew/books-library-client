import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthorService } from './author.service';
import { environment } from 'src/environments/environment';
import { IAuthor } from '../models/author.model';

describe('AuthorService', () => {
  let service: AuthorService;
  let httpTestingController: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/authors`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthorService],
    });

    service = TestBed.inject(AuthorService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all authors', () => {
    const mockAuthors: IAuthor[] = [
      { _id: '1', first_name: 'John', last_name: 'Doe' },
      { _id: '2', first_name: 'Jane', last_name: 'Doe' },
    ];

    service.getAll().subscribe((authors) => {
      expect(authors).toEqual(mockAuthors);
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toEqual('GET');

    req.flush(mockAuthors);
  });

  it('should get author by id', () => {
    const authorId = '1';
    const mockAuthor: IAuthor = {
      _id: '1',
      first_name: 'John',
      last_name: 'Doe',
    };

    service.getById(authorId).subscribe((author) => {
      expect(author).toEqual(mockAuthor);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/${authorId}`);
    expect(req.request.method).toEqual('GET');

    req.flush(mockAuthor);
  });

  it('should create author', () => {
    const newAuthor: IAuthor = { first_name: 'New', last_name: 'Author' };

    service.create(newAuthor).subscribe();

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newAuthor);

    req.flush({});
  });

  it('should update author', () => {
    const authorId = '1';
    const updatedAuthor: IAuthor = {
      _id: '1',
      first_name: 'Updated',
      last_name: 'Author',
    };

    service.update(authorId, updatedAuthor).subscribe();

    const req = httpTestingController.expectOne(`${apiUrl}/${authorId}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(updatedAuthor);

    req.flush({});
  });

  it('should delete author', () => {
    const authorId = '1';

    service.delete(authorId).subscribe();

    const req = httpTestingController.expectOne(`${apiUrl}/${authorId}`);
    expect(req.request.method).toEqual('DELETE');

    req.flush({});
  });
});
