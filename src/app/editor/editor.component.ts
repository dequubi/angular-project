import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from '../services/api.service';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'dateStart',
    'dateEnd',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  constructor(public dialog: MatDialog, private api: ApiService) {}

  ngOnInit(): void {
    this.getElements();
  }

  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((msg) => {
        if (msg === 'add') this.getElements();
      });
  }

  getElements() {
    this.api.getElements().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  duplicateElement(element: any) {
    this.api.postElement(element).subscribe({
      next: (res) => {
        console.log('Success');
        this.getElements();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteElement(id: number) {
    this.api.deleteElement(id).subscribe({
      next: (res) => {
        this.getElements();
      },
    });
  }
}
