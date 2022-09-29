import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  postElement(data: any) {
    const time = data.time ? data.time.split(':') : ['00', '00'];
    const date = new Date(data.dateEnd);
    date.setHours(time[0]);
    date.setMinutes(time[1]);
    const element = {
      name: data.name,
      description: data.description,
      dateStart: new Date(Date.now()),
      dateEnd: date,
    };
    return this.http.post<any>('http://localhost:3000/elements', element);
  }
  getElements() {
    return this.http.get<any>('http://localhost:3000/elements');
  }
  deleteElement(id: number) {
    return this.http.delete<any>('http://localhost:3000/elements/' + id);
  }
}
