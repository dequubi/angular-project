import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IElement } from '../models/element';
import * as moment from 'moment';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  public elementForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IElement
  ) {}

  ngOnInit(): void {
    this.elementForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      dateEnd: ['', Validators.required],
      time: [''], // по умолчанию будет 00:00
    });

    // Если в диалоговое окно передали data, то
    // устанавливаю всем полям необходимые значения
    if (this.data) {
      const date = moment(this.data.dateEnd);
      this.elementForm.controls['name'].setValue(this.data.name);
      this.elementForm.controls['description'].setValue(this.data.description);
      this.elementForm.controls['dateEnd'].setValue(date);
      // В input type="time" значение можно установить
      // только в формате HH:MM (H:M, например, нельзя)
      this.elementForm.controls['time'].setValue(date.format('HH:mm'));
    }
  }

  addElement() {
    if (this.elementForm.valid) {
      this.api.postElement(this.elementForm.value).subscribe({
        next: (res) => {
          this.elementForm.reset();
          this.dialogRef.close(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
