import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IElement } from '../models/element';

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
      time: [''],
    });

    if (this.data) {
      const date = new Date(this.data.dateEnd);
      this.elementForm.controls['name'].setValue(this.data.name);
      this.elementForm.controls['description'].setValue(this.data.description);
      this.elementForm.controls['dateEnd'].setValue(date);
      this.elementForm.controls['time'].setValue(
        `${date.getHours().toString().padStart(2, '0')}:${date
          .getMinutes()
          .toString()
          .padStart(2, '0')}`
      );
    }
  }

  addElement() {
    if (this.elementForm.valid) {
      this.api.postElement(this.elementForm.value).subscribe({
        next: (res) => {
          this.elementForm.reset();
          this.dialogRef.close('add');
        },
        error: () => {
          console.log('Error while adding the product.');
        },
      });
    }
  }
}
