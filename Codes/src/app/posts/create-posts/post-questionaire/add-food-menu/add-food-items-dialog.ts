import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {  Food } from '../post-questionaire.component';

@Component({
  selector: 'add-food-items-dialog',
  templateUrl: 'add-food-items-dialog.html',
  styleUrls: ['./add-food-items-dialog.css']
})
export class AddFoodItemsDialog {

  constructor(
    public dialogRef: MatDialogRef<AddFoodItemsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Food) {}
  onNoClick(): void {
    this.dialogRef.close();
  }

  increaseArraySize() {
    this.data.list.push('');
  }

}
