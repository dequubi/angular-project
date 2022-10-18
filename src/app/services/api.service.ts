import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IElement } from '../models/element';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  postElement(element: IElement) {
    return this.http.post<IElement>('http://localhost:3000/elements', element);
  }
  getElements(): Observable<IElement[]> {
    return this.http.get<IElement[]>('http://localhost:3000/elements');
  }
  deleteElement(id: number) {
    return this.http.delete<any>('http://localhost:3000/elements/' + id);
  }
}
