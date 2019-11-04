import { Component, ViewChild, OnInit } from '@angular/core';
import {
  NgForm,
  NgFormSelectorWarning,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { Contact } from '../csvread/contact-model';

@Component({
  selector: 'app-addguests',
  templateUrl: './addguests.component.html',
  styleUrls: ['./addguests.component.css']
})
export class AddGuestsComponent implements OnInit {
  displayedColumns: string[] = [
    'firstname',
    'lastname',
    'mobilenumber',
    'emailid'
  ];

  form: FormGroup;
  public contacts: any[] = [];

  title = 'ReadCSV';

  public records: Contact[] = [];
  @ViewChild('csvReader', { static: false }) csvReader: any;

  uploadListener($event: any): void {
    const text = [];
    const files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])) {
      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = (csvData as string).split(/\r\n|\n/);
        const headersRow = this.getHeaderArray(csvRecordsArray);
        this.contacts.push(
          this.getDataRecordsArrayFromCSVFile(
            csvRecordsArray,
            headersRow.length
          )
        );
        this.records = this.getDataRecordsArrayFromCSVFile(
          csvRecordsArray,
          headersRow.length
        );
        let newContacts: string = '';
        for (let i = 0; i < this.records.length; i++) {
          newContacts += (this.records[i].emailid) + ',';
        }
        while (newContacts.endsWith(',')) {
          newContacts = newContacts.substring(0, newContacts.length - 1);
        }

        this.form.patchValue({ guests: newContacts });
      };
      reader.onerror = function() {
        console.log('error is occured while reading file!');
      };
    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (csvRecordsArray[i] as string).split(',');
      if (curruntRecord.length === headerLength) {
        let csvRecord: Contact = {
          firstname: curruntRecord[0].trim(),
          lastname: curruntRecord[1].trim(),
          mobilenumber: curruntRecord[2].trim(),
          emailid: curruntRecord[3].trim()
        };
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }

  ngOnInit() {
    this.form = new FormGroup({
      guests: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (csvRecordsArr[0] as string).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = '';
  }

  onInvite() {
    let newGuests: Contact[] = [];
    let record: Contact[] = [];
    if (this.form.value.guests == null) {
      return;
    }
    if (this.form.value.guests.includes(',')) {
      const anotherGuests = this.form.value.guests.split(',');
      for (let _i = 0; _i < anotherGuests.length; _i++) {
        newGuests.push(anotherGuests[_i].trim());
      }
    } else {
      newGuests[0] = this.form.value.guests;
    }
    for (let i = 0; i < newGuests.length; i++) {
      let csvRecord;
      if (Number(newGuests[i])) {
        csvRecord = {
          emailid: '',
          firstname: '',
          lastname: '',
          mobilenumber: newGuests[i]
        };
      } else {
        csvRecord = {
          emailid: newGuests[i],
          firstname: '',
          lastname: '',
          mobilenumber: ''
        };
      }
      record.push(csvRecord);
    }
    this.records = record;
  }
}
