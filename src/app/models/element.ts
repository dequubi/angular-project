import * as moment from 'moment';

export interface IElement {
  id?: number;
  name: string;
  description: string;
  dateStart: string;
  dateEnd: string;
}

export class Element implements IElement {
  public id?: number;
  public name: string;
  public description: string;
  public dateStart: string;
  public dateEnd: string;

  constructor(
    name: string,
    description: string,
    dateEnd: string,
    timeEnd?: string
  ) {
    this.name = name;
    this.description = description;
    this.dateStart = moment().toString();

    if (timeEnd) {
      // Приведение даты выполнения к необходимому формату
      const time = timeEnd
        ? timeEnd.split(':').map((t) => parseInt(t))
        : [0, 0];
      const date = moment(dateEnd).hours(time[0]).minutes(time[1]);
      this.dateEnd = date.toString();
    } else {
      this.dateEnd = dateEnd;
    }
  }
}
