import { Injectable } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { IElement } from '../models/element';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

import * as moment from 'moment';

@Injectable()
export class ElementsDataSource implements DataSource<IElement> {
  private originalElementsSubject = new BehaviorSubject<IElement[]>([]);
  private elementsSubject = new BehaviorSubject<IElement[]>([]);

  constructor(private api: ApiService) {}

  connect(collectionViewer: CollectionViewer): Observable<IElement[]> {
    return this.elementsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.elementsSubject.complete();
  }

  loadElements() {
    this.api.getElements().subscribe((elements) => {
      this.elementsSubject.next(elements);
      this.originalElementsSubject.next(elements);
    });
  }

  addElement(element: IElement) {
    this.api.postElement(element).subscribe({
      next: (res) => {
        this.elementsSubject.next([...this.elementsSubject.getValue(), res]);
        this.originalElementsSubject.next(this.elementsSubject.getValue());
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteElement(id: number) {
    this.api.deleteElement(id).subscribe({
      next: () => {
        this.elementsSubject.next(
          this.elementsSubject.getValue().filter((e) => e.id !== id)
        );
        this.originalElementsSubject.next(this.elementsSubject.getValue());
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  findIndex(id: number | undefined): number {
    return this.elementsSubject.getValue().findIndex((d) => d.id === id);
  }

  isFirst(id: number | undefined): boolean {
    return this.findIndex(id) === 0;
  }

  isLast(id: number | undefined): boolean {
    return this.findIndex(id) === this.elementsSubject.getValue().length - 1;
  }

  isEmpty(): boolean {
    return this.originalElementsSubject.getValue().length === 0;
  }

  swapElements(a: number, b: number): void {
    const normalElements = this.elementsSubject.getValue();

    [normalElements[a], normalElements[b]] = [
      normalElements[b],
      normalElements[a],
    ];

    this.elementsSubject.next(normalElements);
  }

  filterElements(
    filterText: string,
    filterDateStart?: string,
    filterDateEnd?: string
  ) {
    this.elementsSubject.next(
      this.originalElementsSubject.getValue().filter((e) => {
        if (filterDateEnd) {
          return (
            e.name.toLowerCase().includes(filterText.toLowerCase()) &&
            moment(e.dateEnd).isBetween(filterDateStart, filterDateEnd)
          );
        } else {
          return e.name.toLowerCase().includes(filterText.toLowerCase());
        }
      })
    );
  }

  notificationElements(): IElement[] {
    return this.originalElementsSubject
      .getValue()
      .filter((e) => moment().milliseconds(0).isSame(e.dateEnd));
  }
}
