import { Injectable } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { IElement } from '../models/element';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable()
export class ElementsDataSource implements DataSource<IElement> {
  private elementsSubject = new BehaviorSubject<IElement[]>([]);

  constructor(private api: ApiService) {}

  connect(collectionViewer: CollectionViewer): Observable<IElement[]> {
    return this.elementsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.elementsSubject.complete();
  }

  loadElements() {
    this.api
      .getElements()
      .subscribe((elements) => this.elementsSubject.next(elements));
  }

  addElement(element: IElement) {
    this.api.postElement(element).subscribe({
      next: (res) => {
        this.elementsSubject.next([...this.elementsSubject.getValue(), res]);
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
