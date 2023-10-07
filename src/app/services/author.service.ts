import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthor } from '../models/author.model';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.apiUrl}/authors`;

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<IAuthor[]> {
    return this.http.get<IAuthor[]>(baseUrl);
  }

  getById(id: string): Observable<IAuthor> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: IAuthor): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: string, data: IAuthor): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
