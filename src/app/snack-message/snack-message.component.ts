import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { IElement } from '../models/element';

@Component({
  selector: 'app-snack-message',
  templateUrl: './snack-message.component.html',
  styleUrls: ['./snack-message.component.scss'],
})
export class SnackMessageComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: IElement) {}

  // чтобы не делать уведомление слишком огромным на случай,
  // если описание будет большим
  public shortDesc!: string;

  ngOnInit(): void {
    this.shortDesc = this.data.description.substring(0, 50).trim();
    this.shortDesc += this.data.description.length > 50 ? '...' : '';
  }
}
