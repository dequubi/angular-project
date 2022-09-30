import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';

import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

import { DialogComponent } from '../dialog/dialog.component';
import { IElement } from '../models/element';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
  @Input() filterText: string = '';
  @Input() filterDateStart: string = '';
  @Input() filterDateEnd: string = '';
  @ViewChild(MatTable) table!: MatTable<IElement>;
  dataSource!: IElement[];
  originalDataSource!: IElement[];

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'dateStart',
    'dateEnd',
    'action',
  ];

  constructor(public dialog: MatDialog, private api: ApiService) {}

  openDialog(e: any, row: IElement): void {
    if (e.target.tagName !== 'TD') return;
    console.log(row);
    this.dialog
      .open(DialogComponent, {
        width: '40%',
        data: row,
      })
      .afterClosed()
      .subscribe((msg) => {
        if (msg === 'add') this.getElements();
      });
  }

  moveRow(e: IElement, dir: number): void {
    const i = this.dataSource.findIndex((d) => d.id === e.id);
    [this.dataSource[i], this.dataSource[i - dir]] = [
      this.dataSource[i - dir],
      this.dataSource[i],
    ];
    this.table.renderRows();
  }

  isFirst(e: IElement): boolean {
    return this.dataSource.findIndex((d) => d.id === e.id) === 0;
  }

  isLast(e: IElement): boolean {
    return (
      this.dataSource.findIndex((d) => d.id === e.id) ===
      this.dataSource.length - 1
    );
  }

  ngOnInit(): void {
    this.getElements();
  }

  getElements(): void {
    this.api.getElements().subscribe({
      next: (res) => {
        this.dataSource = res;
        this.originalDataSource = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  applyFilter(): void {
    this.dataSource = this.originalDataSource.filter((e) => {
      if (this.filterDateEnd) {
        return (
          e.name.toLowerCase().includes(this.filterText.toLowerCase()) &&
          new Date(e.dateEnd) < new Date(this.filterDateEnd) &&
          new Date(e.dateEnd) > new Date(this.filterDateStart)
        );
      } else {
        return e.name.toLowerCase().includes(this.filterText.toLowerCase());
      }
    });

    this.table.renderRows();
  }
}
