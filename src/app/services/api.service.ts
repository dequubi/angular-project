import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  postElement(data: any) {
    // Приведение даты выполнения к необходимому формату
    const time = data.time ? data.time.split(':') : ['00', '00'];
    const date = moment(data.dateEnd).hours(time[0]).minutes(time[1]);

    const element = {
      name: data.name,
      description: data.description,
      dateStart: moment(),
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
