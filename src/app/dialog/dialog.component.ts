import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef } from '@angular/material/dialog';

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
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.elementForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      dateEnd: ['', Validators.required],
      time: [''],
    });
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
