import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from '../services/api.service';
import { ElementsDataSource } from '../services/elements.datasource';

import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

import { IElement, Element } from '../models/element';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<IElement>;
  dataSource!: ElementsDataSource;

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
    this.dataSource = new ElementsDataSource(this.api);
    this.dataSource.loadElements();
  }

  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '40%',
      })
      .afterClosed()
      .subscribe((element) => {
        if (element) this.dataSource.addElement(element);
      });
  }

  duplicateElement(element: IElement) {
    const elementDuplicate: IElement = new Element(
      element.name,
      element.description,
      element.dateEnd
    );
    this.dataSource.addElement(elementDuplicate);
  }

  deleteElement(id: number) {
    this.dataSource.deleteElement(id);
  }
}
