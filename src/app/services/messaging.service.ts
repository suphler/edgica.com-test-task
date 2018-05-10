import {Injectable} from '@angular/core';
import {Message} from '../messenger/message';

@Injectable()
export class MessagingService {

  listOfMessages: any[];

  constructor() {
    this.generateFictiveListOfMessages();
  }

  getListOfMessage() {
    return this.listOfMessages;
  }

  generateFictiveListOfMessages() {

    const tmpMsgListArray = [];
    for (let i = 0; i < 5; i++) {
      tmpMsgListArray.push(new Message(Math.round(Math.random() * 10000),
        'Note header' + i,
        'Note body' + i,
        ['test1', 'test2', 'test3' + i],
        Date.now()));

    }
    this.listOfMessages = tmpMsgListArray;
  }


  setListOfMessage(list) { // just moch
    console.log('This should go  to  server side: ', list);
    return;
  }

}
