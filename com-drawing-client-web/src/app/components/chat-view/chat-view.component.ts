import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { MessageModel } from 'src/app/model';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements AfterViewInit {

  public newMessage: string | undefined;

  @Output() public sendMessage: EventEmitter<string> = new EventEmitter<string>();

  @Input() public messages: MessageModel[] = [];
  @Input() public userName: string | undefined;

  @ViewChild('sysMesTempl', { static: false }) sysMesTempl: TemplateRef<any> | undefined;
  @ViewChild('thisUserMesTempl', { static: false }) thisUserMesTempl: TemplateRef<any> | undefined;
  @ViewChild('otherUserMesTempl', { static: false }) otherUserMesTempl: TemplateRef<any> | undefined;

  @ViewChild('messagesList', { static: false }) messagesList: ElementRef | undefined;

  @ViewChildren('messageItem') private messageItems?: QueryList<ElementRef>;

  constructor() { }

  ngAfterViewInit() {
    if (this.messageItems) {
      this.messageItems.changes.subscribe((x: QueryList<ElementRef>) => {
        if (x.length) {
          setTimeout(() => { if (this.messagesList) this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight + 40; }, 500);
        }
      });
    }
  }

  public onSendMessage() {
    this.sendMessage.emit(this.newMessage);
    this.newMessage = undefined;
  }

  public setMessageTemplate(message: MessageModel): TemplateRef<any> {
    if (message.userName == 'System') return this.sysMesTempl!;
    if (message.userName == this.userName) return this.thisUserMesTempl!;
    return this.otherUserMesTempl!;
  }

}
