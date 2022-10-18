import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { ApiService } from '../services/api.service';
import { ElementsDataSource } from '../services/elements.datasource';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent implements OnInit, OnDestroy {
  @Input() filterText: string = '';
  @Input() filterDateStart: string = '';
  @Input() filterDateEnd: string = '';
  @ViewChild(MatTable) table!: MatTable<IElement>;

  dataSource!: ElementsDataSource;
  originalDataSource!: ElementsDataSource;

  notifTimeout!: any;
  notifInterval!: any;

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
    this.dataSource = new ElementsDataSource(this.api);
    this.dataSource.loadElements();

    // Для toast уведомлений я решил каждую минуту проверять,
    // есть ли в массиве элемент, у которого дата выполнения
    // совпадает с текущим временем.
    // setInterval начинается, как только наступает следующая минута.

    // Изначально я думал просто устанавливать setTimeout для каждого
    // элемента, но тогда они дублируются при переключении страниц,
    // а запоминать состояния таймаутов, похоже, возможно
    // только через родительский компонент.

    const nextMinute = moment().add(1, 'minutes').seconds(0);

    this.notifTimeout = setTimeout(() => {
      // setInterval начнет работать через минуту, поэтому
      // чтобы проверить и текущую минуту тоже, вызываю функцию здесь.
      this.elementNotificationCheck();
      this.notifInterval = setInterval(() => {
        this.elementNotificationCheck();
      }, 60000);
    }, nextMinute.diff(moment(), 'milliseconds'));
  }

  ngOnDestroy(): void {
    clearTimeout(this.notifTimeout);
    clearInterval(this.notifInterval);
  }

  elementNotificationCheck(): void {
    if (this.dataSource.isEmpty()) return;

    this.dataSource.notificationElements().map((e) => {
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
    const i = this.dataSource.findIndex(e.id);
    this.dataSource.swapElements(i, i - dir);
    this.table.renderRows();
  }

  isFirst(e: IElement): boolean {
    return this.dataSource.isFirst(e.id);
  }

  isLast(e: IElement): boolean {
    return this.dataSource.isLast(e.id);
  }

  // Из-за необходимости добавить перемещение строк пришлось
  // не использовать MatTableDataSource, который содержит
  // встроенный метод фильтрации. Насколько эффективен/оптимизирован
  // код ниже я не знаю
  applyFilter(): void {
    this.dataSource.filterElements(
      this.filterText,
      this.filterDateStart,
      this.filterDateEnd
    );

    this.table.renderRows();
  }

  clearFilter(): void {
    this.filterText = '';
    this.filterDateStart = '';
    this.filterDateEnd = '';
    this.dataSource.filterElements('');
  }
}
