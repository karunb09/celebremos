import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ItemsToBring } from '../post-questionaire.component';

@Component({
  selector: 'items-to-bring-dialog',
  templateUrl: 'items-to-bring-dialog.html',
  styleUrls: ['./items-to-bring-dialog.css']
})
export class ItemsToBringDialog {

  constructor(
    public dialogRef: MatDialogRef<ItemsToBringDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ItemsToBring) {}
  onNoClick(): void {
    this.dialogRef.close();
  }

  increaseArraySize() {
    this.data.items.push({ itemname: '', quantity: '' });
  }

}
