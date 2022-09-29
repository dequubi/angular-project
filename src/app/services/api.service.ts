import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  postElement(data: any) {
    let time = data.elTime.split(':');
    if (time[0] == '') time = ['00', '00'];
    const date = new Date(data.elDate);
    date.setHours(time[0]);
    date.setMinutes(time[1]);
    const element = {
      name: data.elName,
      description: data.elDesc,
      dateStart: new Date(Date.now()),
      dateEnd: date,
    };
    return this.http.post<any>('http://localhost:3000/elements', element);
  }
  getElements() {
    return this.http.get<any>('http://localhost:3000/elements');
  }
}
