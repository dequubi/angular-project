import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IElement, Element } from '../models/element';
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
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IElement
  ) {}

  ngOnInit(): void {
    this.elementForm = this.formBuilder.nonNullable.group({
      name: new FormControl<string>('', {
        validators: Validators.required,
      }),
      description: new FormControl<string>(''),
      dateEnd: new FormControl<string>('', {
        validators: Validators.required,
      }),
      time: new FormControl<string>(''), // по умолчанию будет 00:00
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
      const form = this.elementForm.value;
      const element: IElement = new Element(
        form.name,
        form.description,
        form.dateEnd,
        form.time
      );
      this.elementForm.reset();
      this.dialogRef.close(element);
    }
  }
}
