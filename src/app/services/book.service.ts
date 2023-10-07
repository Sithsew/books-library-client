import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBook } from '../models/book.model';
import { ICreateBook } from '../models/create-book.model';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.apiUrl}/books`;

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient) {}

  getAll(page: number, pageSize: number): Observable<IBook[]> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);

    return this.http.get<IBook[]>(baseUrl, { params });
  }

  getById(id: string): Observable<IBook> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: ICreateBook): Observable<ICreateBook> {
    return this.http.post(baseUrl, data);
  }

  update(id: string, data: ICreateBook): Observable<IBook> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
