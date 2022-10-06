import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';

import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DialogComponent } from '../dialog/dialog.component';
import { SnackMessageComponent } from '../snack-message/snack-message.component';
import { IElement } from '../models/element';

import * as moment from 'moment';

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

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.getElements();

    // Для toast уведомлений я решил каждую минуту проверять,
    // есть ли в массиве элемент, у которого дата выполнения
    // совпадает с текущим временем.
    // setInterval начинается, как только наступает следующая минута.

    // Изначально я думал просто устанавливать setTimeout для каждого
    // элемента, но тогда они дублируются при переключении страниц,
    // а запоминать состояния таймаутов, похоже, возможно
    // только через родительский компонент.

    const nextMinute = moment().add(1, 'minutes').seconds(0);

    setTimeout(() => {
      // setInterval начнет работать через минуту, поэтому
      // чтобы проверить и текущую минуту тоже, вызываю функцию здесь.
      this.elementNotificationCheck();
      setInterval(() => {
        this.elementNotificationCheck();
      }, 60000);
    }, nextMinute.diff(moment(), 'milliseconds'));
  }

  elementNotificationCheck(): void {
    if (!this.originalDataSource) return;
    const today = moment();
    this.originalDataSource
      .filter((e) => today.milliseconds(0).isSame(e.dateEnd))
      .map((e) => {
        this._snackBar.openFromComponent(SnackMessageComponent, {
          data: e,
          duration: 5000,
          horizontalPosition: 'end',
        });
      });
  }

  openDialog(e: any, row: IElement): void {
    // Функция вызывается даже если нажать на кнопку смены порядка строки,
    // поэтому здесь проверка, что нажатый элемент не является кнопкой
    if (e.target.tagName !== 'TD') return;

    this.dialog.open(DialogComponent, {
      width: '40%',
      data: row,
    });
  }

  moveRow(e: IElement, dir: number): void {
    // После перемещения id элемента не всегда совпадает
    // с индексом массива, поэтому сначала нахожу индекс
    const i = this.dataSource.findIndex((d) => d.id === e.id);
    // Перестановка [a, b] = [b, a]
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

  // Из-за необходимости добавить перемещение строк пришлось
  // не использовать MatTableDataSource, который содержит
  // встроенный метод фильтрации. Насколько эффективен/оптимизирован
  // код ниже я не знаю
  applyFilter(): void {
    this.dataSource = this.originalDataSource.filter((e) => {
      if (this.filterDateEnd) {
        return (
          e.name.toLowerCase().includes(this.filterText.toLowerCase()) &&
          moment(e.dateEnd).isBetween(this.filterDateStart, this.filterDateEnd)
        );
      } else {
        return e.name.toLowerCase().includes(this.filterText.toLowerCase());
      }
    });

    this.table.renderRows();
  }

  clearFilter(): void {
    this.filterText = '';
    this.filterDateStart = '';
    this.filterDateEnd = '';
    this.dataSource = this.originalDataSource;
  }
}
