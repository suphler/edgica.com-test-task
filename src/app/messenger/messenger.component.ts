import {Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {Message} from './message';
import {MessagingService} from '../services/messaging.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit, OnChanges, OnDestroy {
  currentMessage: Message;
  listOfNotes: any[];
  originListOfNotes: any[];
  filters: any[];

  messageEditForm: FormGroup;
  filterForm: FormGroup;

  sub = [];


  constructor(private messagingService: MessagingService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.originListOfNotes = this.messagingService.getListOfMessage();
    this.listOfNotes = this.originListOfNotes;
    this.createForm();
    this.createFilter();
    this.sub.push(
      this.filterForm.valueChanges
        .debounceTime(500)
        .subscribe(
          (data) => {
            this.doFiltering(data['filters']);
          },
          (error) => {
            console.log(error);
          }
        )
    );


    this.setCurrentMessage(this.originListOfNotes[0].id);

  }

  ngOnChanges() {
    if (this.listOfNotes.length > 0) {
      this.createForm();
    }

  }

  ngOnDestroy() {
    this.sub.forEach(subs => {
      subs.unsubscribe();
    });
  }

  setCurrentMessage(id) {
    const tmpMsg = this.listOfNotes.filter((a) => {
      return a.id === id;
    });
    this.currentMessage = tmpMsg[0];
    this.setFormValues(this.currentMessage);

  }

  checkId(id) {
    return id === this.currentMessage['id'] ? true : false;
  }

  getCurrentMessageData() {
    const tmpDate = new Date();
    tmpDate.setTime(this.currentMessage['data']);
    return tmpDate.toISOString().substr(0, 10);
  }

  private createForm() {
    this.messageEditForm = this.fb.group({
      id: '',
      header: '',
      body: '',
      keywords: '',
      date: ''
    });

  }

  private setFormValues(message?: Message) {
    if (message) {
      this.messageEditForm.setValue({
        id: message.id,
        header: message.header,
        body: message.body,
        keywords: message.keywords,
        date: this.getCurrentMessageData()
      });
    }


  }

  onSubmitAction() {
    this.listOfNotes.forEach((note) => {
      if (note.id === this.messageEditForm.get('id').value) {
        Object.assign(note, this.messageEditForm.value);
        this.setFormValues(this.messageEditForm.value);
      }
    });
    this.messagingService.setListOfMessage(this.listOfNotes);

  }


  onDelete(id) {
    this.listOfNotes.forEach((note, index) => {
      if (note.id === id) {
        this.listOfNotes.splice(index, 1);
      }
    });
    this.messagingService.setListOfMessage(this.listOfNotes);
    this.ngOnChanges();

  }

  addNewMessage() {
    const tmpMessage = new Message(this.getNewId(), 'New Header', '', [], Date.now());
    this.originListOfNotes.push(tmpMessage);
    this.listOfNotes = this.originListOfNotes;
    this.filterForm.patchValue({
      filters: ''
    });

    this.setCurrentMessage(tmpMessage.id);
  }

  getNewId() {

    return Math.round(Math.random() * 10000);
  }

  private createFilter() {
    this.filterForm = this.fb.group({
      filters: ''
    });
  }

  doFiltering(f: string) {
    if (f.length > 0) {
      let tmpFilters = [];
      tmpFilters = f.toString().split(',');
      this.filters = tmpFilters;
      this.listOfNotes = [];
      this.originListOfNotes.forEach((note) => {
        let tmpListOfKeywords = [];
        tmpListOfKeywords = note.keywords.toString().split(',');
        this.filters.forEach((filter) => {
          tmpListOfKeywords.forEach((key) => {
            if (key === filter) {
              this.listOfNotes.push(note);
            }

          });
        });

      });
      if (this.listOfNotes.length > 0) {
        this.setCurrentMessage(this.listOfNotes[0].id);
      }
    } else {
      this.listOfNotes = this.originListOfNotes;
    }

    this.ngOnChanges();

  }


}
