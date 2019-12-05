import { Component, OnInit, ViewChild } from '@angular/core';
import { Post } from '../posts.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import {
  MatDatepickerInputEvent,
  MatSnackBar,
  MatBottomSheet
} from '@angular/material';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth.service';
import { Subscription } from 'rxjs';
import { BottomSheetOverviewExampleSheet } from './bottom-sheet-overview';
import { ContactService } from 'src/app/csvread/contact.service';
import { Contact } from 'src/app/csvread/contact-model';

export interface Eventss {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  constructor(
    public postService: PostService,
    private authService: AuthService,
    public route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private _bottomSheet: MatBottomSheet,
    private contactService: ContactService
  ) {}

  public contacts: any[] = [];
  contactBottomSheet;
  title = 'ReadCSV';
  public records: Contact[] = [];
  @ViewChild('csvReader', { static: false }) csvReader: any;
  mode = 'create';
  minDate = new Date();
  formattedaddress = '';
  username: string;
  imagePathCreate: string = '';
  events: Eventss[] = [
    { value: 'Anniversary', viewValue: 'Anniversary' },
    { value: 'Baby Shower', viewValue: 'Baby Shower' },
    { value: 'Bachelor Party', viewValue: 'Bachelor Party' },
    { value: 'Wedding', viewValue: 'Wedding' },
    { value: 'Beach Party', viewValue: 'Beach Party' },
    { value: 'Dinner Party', viewValue: 'Dinner Party' },
    { value: 'Birthday', viewValue: 'Birthday' },
    { value: 'Engagement Party', viewValue: 'Engagement Party' },
    { value: 'Housewarming', viewValue: 'Housewarming' },
    { value: 'Custom', viewValue: 'Custom' }
  ];
  private postId: string;
  post: Post;
  imagePreview: string;
  newGuests: [string] = ['celebremos'];
  date = new FormControl(new Date());
  newDate;
  myDate;
  image;
  form: FormGroup;
  customType: string;
  placesRef: GooglePlaceDirective;

  onSavePost() {

    if (this.form.invalid && this.mode !== 'createImage') {
      return;
    }
    if (this.newDate == null) {
      this.myDate = this.post.date;
    } else {
      this.myDate = this.newDate;
    }
    console.log(this.myDate);
    if (this.form.value.guests == null) {
      this.newGuests.pop();
    } else if (this.form.value.guests.includes(',')) {
      const anotherGuests = this.form.value.guests.split(',');
      for (let _i = 0; _i < anotherGuests.length; _i++) {
        if (_i === 0) {
          this.newGuests.pop();
        }
        this.newGuests.push(anotherGuests[_i].trim());
        if (Number(anotherGuests[_i].trim())) {
          this.records.push({
            firstname: '',
            lastname: '',
            emailid: '',
            mobilenumber: anotherGuests[_i].trim()
          });
        } else {
          this.records.push({
            firstname: '',
            lastname: '',
            emailid: anotherGuests[_i].trim(),
            mobilenumber: ''
          });
        }
      }
    } else {
      this.newGuests[0] = this.form.value.guests;
      if (Number(this.form.value.guests)) {
        this.records.push({
          firstname: '',
          lastname: '',
          emailid: '',
          mobilenumber: this.form.value.guests
        });
      } else {
        this.records.push({
          firstname: '',
          lastname: '',
          emailid: this.form.value.guests,
          mobilenumber: ''
        });
      }
    }
    console.log(this.mode);
    if (this.mode === 'create' || this.mode === 'createImage') {
      this.form.value.location = this.formattedaddress;
      this.postService.addPosts(
        this.form.value.title,
        this.form.value.type,
        this.form.value.image,
        this.myDate,
        this.form.value.time,
        this.form.value.host,
        this.form.value.location,
        this.form.value.content,
        this.newGuests,
        this.username,
        this.records
      );
    } else {
      if (this.formattedaddress) {
        this.form.value.location = this.formattedaddress;
      }
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.type,
        this.form.value.image,
        this.myDate,
        this.form.value.time,
        this.form.value.host,
        this.form.value.location,
        this.form.value.content,
        this.newGuests
      );
    }
    this.form.reset();
  }

  onSaveforLaterUse() {
    if (this.form.invalid) {
      return;
    }
    if (this.newDate == null) {
      this.myDate = this.post.date;
    } else {
      this.myDate = this.newDate;
    }
    console.log(this.myDate);
    if (this.form.value.guests == null) {
      this.newGuests.pop();
    } else if (this.form.value.guests.includes(',')) {
      const anotherGuests = this.form.value.guests.split(',');
      for (let _i = 0; _i < anotherGuests.length; _i++) {
        if (_i === 0) {
          this.newGuests.pop();
        }
        this.newGuests.push(anotherGuests[_i].trim());

            if (Number(anotherGuests[_i].trim())) {
              this.records.push({
                firstname: '',
                lastname: '',
                emailid: '',
                mobilenumber: anotherGuests[_i].trim()
              });
            } else {
              this.records.push({
                firstname: '',
                lastname: '',
                emailid: anotherGuests[_i].trim(),
                mobilenumber: ''
              });

        }
      }
    } else {
      this.newGuests[0] = this.form.value.guests;

          if (Number(this.form.value.guests)) {
            this.records.push({
              firstname: '',
              lastname: '',
              emailid: '',
              mobilenumber: this.form.value.guests
            });
          } else {
            this.records.push({
              firstname: '',
              lastname: '',
              emailid: this.form.value.guests,
              mobilenumber: ''
            });
          }

    }
    this.form.value.location = this.formattedaddress;
    this.postService.savePosts(
      this.form.value.title,
      this.form.value.type,
      this.form.value.image,
      this.myDate,
      this.form.value.time,
      this.form.value.host,
      this.form.value.location,
      this.form.value.content,
      this.newGuests,
      this.username,
      this.records
    );
    this.openSnackBar();
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8)]
      }),
      type: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      date: new FormControl(null, { validators: [Validators.required] }),
      time: new FormControl(null, { validators: [Validators.required] }),
      host: new FormControl(null, { validators: [] }),
      location: new FormControl(null, { validators: [Validators.required] }),
      guests: new FormControl(null, { validators: [] }),
      content: new FormControl('', { validators: [] })
    });

    this.authService
      .getAuthUsernameListener()
      .subscribe(message => (this.username = message));
    this.authService.getContacts(this.username);
    this.authService.getContactGroups(this.username);
    this.authService
      .getContactsListListener()
      .subscribe((contacts1: Contact[]) => {
        this.contactBottomSheet = contacts1;
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        console.log(this.postId);
        this.postService.getPost(this.postId).subscribe(postData => {
          const nowDate = postData.date.slice(postData.date.indexOf(', ') + 2);
          console.log(nowDate);
          const dateArray = nowDate.split('/');
          this.post = {
            id: postData._id,
            title: postData.title,
            type: postData.type,
            imagePath: postData.imagePath,
            date: postData.date,
            time: postData.time,
            host: postData.host,
            location: postData.location,
            content: postData.content,
            guests: postData.guests
          };
          let guestsvalue: string = '';
          for (let i = 0; i < this.post.guests.length; i++) {
            if (i === this.post.guests.length - 1) {
              guestsvalue += this.post.guests[i];
            } else {
              guestsvalue += this.post.guests[i] + ',';
            }
          }
          this.form.setValue({
            title: this.post.title,
            type: this.post.type,
            image: this.post.imagePath,
            date: new Date(
              Number(dateArray[2]),
              Number(dateArray[0]) - 1,
              Number(dateArray[1])
            ),
            time: this.post.time,
            host: this.post.host,
            location: this.post.location,
            content: this.post.content,
            guests: guestsvalue
          });
          let recordsRetrieved: Contact[] = [];
          for (let i = 0; i < this.post.guests.length; i++) {
            this.postService
              .getRecords(this.post.guests[0], this.username)
              .subscribe(postData => {
                recordsRetrieved.push(postData);
              });
          }
          this.records = recordsRetrieved;
          this.imagePreview = '';
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      let imagesss;
      if (paramMap.has('imagePath')) {
        imagesss = paramMap.get('imagePath');
        this.mode = 'createImage';
        this.imagePathCreate =
          'http://localhost:3000/images/' + imagesss + '.jpg';
      }
      this.form.setValue({
        image: this.imagePathCreate
      });
      this.imagePreview = '';
    });
  }

  public handleAddressChange(address: Address) {
    this.formattedaddress = address.formatted_address;
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    const date = `${event.value}`;
    this.newDate = date
      .slice(0, date.indexOf('00:00:00') - 1)
      .concat(
        ', ' +
          `${event.value.getMonth() + 1}` +
          '/' +
          `${event.value.getDate()}` +
          '/' +
          `${event.value.getFullYear()}`
      );
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  openSnackBar() {
    if (this.form.invalid) {
      return;
    } else {
      // this.onSaveforLaterUse();
      this.snackBar.open('Events Saved!', 'Dismiss', {
        duration: 2000
      });
    }
  }

  openBottomSheet(): void {
    const bottomSheetRef = this._bottomSheet.open(BottomSheetOverviewExampleSheet, {
      data: this.contactBottomSheet
    });
    bottomSheetRef.afterDismissed().subscribe(result => {
    this.contactService
      .getselectedContactList()
      .subscribe((list: Contact[]) => {
        console.log(list.length);
        let newFormValue = '';
        console.log(this.form.value.guests);
        if (this.form.value.guests) {
          newFormValue = this.form.value.guests + ',';
          for (let i = 0; i < list.length; i++) {
            let concatenatedString = '';
            if (list[i].emailid === null || list[i].emailid === '') {
              concatenatedString = list[i].mobilenumber;
            } else {
              concatenatedString = list[i].emailid;
            }
            if (newFormValue.includes(concatenatedString)) {
            } else {
              if (i === list.length - 1) {
                newFormValue += concatenatedString;
              } else {
                newFormValue += concatenatedString + ',';
              }
            }
          }
        } else {
          for (let i = 0; i < list.length; i++) {
            let concatenatedString = '';
            if (list[i].emailid === null || list[i].emailid === '') {
              concatenatedString = list[i].mobilenumber;
            } else {
              concatenatedString = list[i].emailid;
            }
            if (newFormValue.includes(concatenatedString)) {
            } else {
              if (i === list.length - 1) {
                newFormValue += concatenatedString;
              } else {
                newFormValue += concatenatedString + ',';
              }
            }
          }
        }
        while (newFormValue.endsWith(',')) {
          newFormValue = newFormValue.substring(0, newFormValue.length - 1);
        }
        this.form.patchValue({ guests: newFormValue });
        // this.form.setValue({
        //   title: this.form.value.title,
        //   type: this.form.value.type,
        //   image: this.form.value.image,
        //   date: this.form.value.date,
        //   time: this.form.value.time,
        //   host: this.form.value.host,
        //   location: this.form.value.location,
        //   content: this.form.value.content,
        //   guests: newFormValue
        // });
      });
    });
  }

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
        let newContacts = '';
        for (let i = 0; i < this.records.length; i++) {
          newContacts += this.records[i].emailid + ',';
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
