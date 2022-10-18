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
    return this.http.post<IElement>('/api/elements', element);
  }
  getElements(): Observable<IElement[]> {
    return this.http.get<IElement[]>('/api/elements');
  }
  deleteElement(id: number) {
    return this.http.delete<any>('/api/elements/' + id);
  }
}
