import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from '../services/api.service';

import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

import { IElement } from '../models/element';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<IElement>;
  dataSource!: IElement[];

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'dateStart',
    'dateEnd',
    'action',
  ];

  constructor(public dialog: MatDialog, private api: ApiService) {}

  ngOnInit(): void {
    this.getElements();
  }

  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '40%',
      })
      .afterClosed()
      .subscribe((element) => {
        this.dataSource = [...this.dataSource, element];
      });
  }

  getElements() {
    this.api.getElements().subscribe({
      next: (res) => {
        this.dataSource = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  duplicateElement(element: IElement) {
    this.api.postElement(element).subscribe({
      next: (res) => {
        // this.dataSource.push(res) почему-то не обновляет view,
        // поэтому пришлось так
        this.dataSource = [...this.dataSource, res];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteElement(id: number) {
    this.api.deleteElement(id).subscribe({
      next: (res) => {
        this.dataSource = this.dataSource.filter((e) => e.id !== id);
      },
    });
  }
}
