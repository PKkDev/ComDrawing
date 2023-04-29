import { AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { CursorData, CursorModel, DrawData, MessageModel } from './model';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Clipboard } from '@angular/cdk/clipboard';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  public host: string = 'https://localhost:7034/';
  public userName: string | undefined;
  public groupName: string | undefined;

  private map: Map<string, CursorModel> = new Map<string, CursorModel>();

  public connection: HubConnection | undefined;
  public isConnected: boolean = false;

  @ViewChild('sysMesTempl', { static: false }) sysMesTempl: TemplateRef<any> | undefined;
  @ViewChild('thisUserMesTempl', { static: false }) thisUserMesTempl: TemplateRef<any> | undefined;
  @ViewChild('otherUserMesTempl', { static: false }) otherUserMesTempl: TemplateRef<any> | undefined;

  public canvas: ElementRef | undefined;
  public ctx: CanvasRenderingContext2D | null = null;

  @ViewChildren('canvas') private canvases?: QueryList<ElementRef>;

  @ViewChild('messagesList', { static: false }) messagesList: ElementRef | undefined;

  public newMessage: string | undefined;

  public messages: MessageModel[] = [];

  public color: string = '#000';
  public width: number = 1;

  constructor(
    private http: HttpClient,
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    private clipboard: Clipboard,
    private route: ActivatedRoute) {
  }

  //#region settings

  public isConfigured = false;
  public isSelectedHost = true;
  public isSelectedClient = false;

  public totalGroups: string[] = [];

  public onRefreshGroups() {
    this.http.get<string[]>(this.host + 'api/groups/all')
      .subscribe({
        next: (value: string[]) => {
          this.totalGroups = value;
        },
      });
  }

  public onConnect() {
    if (this.connection && this.connection.state != HubConnectionState.Disconnected) {
      this.connection.stop();
      this.connection = undefined;
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(this.host + 'DrawHub')
      .build();

    this.connection.onclose((err) => {
      window.alert(err);
      this.connection?.start();
    });
    this.isConnected = true;

    this.connection.on('DrawReceived', (userName: string, data: DrawData,) => {
      if (this.userName != userName)
        this.drawLine(data.startX, data.startY, data.endX, data.endY, data.width, data.colorHex);
    });

    this.connection.on('MoveCursorReceived', (userName: string, data: CursorData) => {
      if (this.userName != userName)
        this.viewCursor(data.x, data.y, userName);
    });

    this.connection.on('SendMessage', (userName: string, message: string) => {
      this.messages.push({ message: message, userName: userName, template: this.setMessageTemplate(userName) });
      setTimeout(() => { if (this.messagesList) this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight + 40; }, 500)

    });

    this.connection.start()
      .catch((err) => {
        this.messages.push({ message: err, userName: "System", template: this.setMessageTemplate("System") });
        this.isConnected = false;
      })
      .then(() => {
        this.connection?.invoke('AddToGroup', this.groupName, this.userName)
      });

    this.isConfigured = true;
  }

  //#endregion settings

  ngOnInit() {

    this.host = window.document.baseURI;

    const searchParams = new URLSearchParams(window.document.URL);

    const group = searchParams.get("group");
    if (group) {
      this.totalGroups.push(group)
      this.groupName = group;
    }

    const host = searchParams.get("host");
    if (host) {
      const encodedHost = decodeURIComponent(host);
      this.host = encodedHost;
    }

    if (group && host) {
      this.isSelectedHost = false;
      this.isSelectedClient = true;
    }

  }

  ngAfterViewInit() {
    if (this.canvases) {
      this.canvases.changes.subscribe((x: QueryList<ElementRef>) => {
        if (x.length) {
          for (const iterator of x) {
            const canvasItem = iterator.nativeElement as HTMLCanvasElement;
            this.ctx = canvasItem.getContext('2d');
            this.canvas = iterator;
          }
        }
      });
    }
  }

  private setMessageTemplate(userName: string): TemplateRef<any> {
    if (userName == 'System') return this.sysMesTempl!;
    if (userName == this.userName) return this.thisUserMesTempl!;
    return this.otherUserMesTempl!;
  }

  public onSelectEraser() {
    this.color = '#fff';
  }

  //#region  Drawing

  public isDrawing: boolean = false;
  public startX: number = -1;
  public startY: number = -1;

  public onMouseDown(e: any) {
    this.isDrawing = true;
    this.startX = e.clientX - this.canvas?.nativeElement.offsetLeft || -1;
    this.startY = e.clientY - this.canvas?.nativeElement.offsetTop || -1;
  }

  public onMouseMove(e: any) {

    const currX = e.clientX - this.canvas?.nativeElement.offsetLeft;
    const currY = e.clientY - this.canvas?.nativeElement.offsetTop;

    if (this.isDrawing && this.canvas && this.startX != -1 && this.startY != -1) {

      this.drawLine(this.startX, this.startY, currX, currY, this.width, this.color);

      if (this.connection && this.connection.state == HubConnectionState.Connected) {

        const drawData: DrawData = {
          startX: this.startX, startY: this.startY,
          endX: currX, endY: currY,
          width: this.width, colorHex: this.color
        }
        this.connection
          .invoke("Drawing", this.groupName, this.userName, drawData)
          .catch((err) => { this.messages.push({ message: err, userName: "System", template: this.setMessageTemplate("System") }); });
      }

      this.startX = currX;
      this.startY = currY;
    }

    if (this.connection && this.connection.state == HubConnectionState.Connected) {
      const cursorData: CursorData = { x: currX, y: currY, }
      this.connection
        .invoke("MoveCursor", this.groupName, this.userName, cursorData)
        .catch((err) => { this.messages.push({ message: err, userName: "System", template: this.setMessageTemplate("System") }); });
    }

  }

  public onMouseUp(event: any) {
    this.isDrawing = false;
  }

  //#endregion Drawing

  public onSendMessage() {
    if (this.connection) {
      this.connection
        .invoke('SendMessageToGroup', this.groupName, this.userName, this.newMessage)
        .then(() => this.newMessage = '')
        .catch((err) => { this.messages.push({ message: err, userName: "System", template: this.setMessageTemplate("System") }); });
    }
  }

  private viewCursor(x: number, y: number, userName: string) {

    const alreadyHere = this.map.get(userName);
    if (alreadyHere) {
      if (this.canvas) {
        alreadyHere.element.style.display = `block`;
        alreadyHere.element.style.top = `${y + 10}px`;
        alreadyHere.element.style.left = `${x + this.canvas.nativeElement.offsetLeft + 10}px`;
        clearTimeout(alreadyHere.timeOut);
        alreadyHere.timeOut = setTimeout(() => this.hideCursor(alreadyHere.element), 1000 * 2);
      }
    } else {
      const div = this.renderer2.createElement("div");
      this.renderer2.addClass(div, "display_cursor");
      const label = this.renderer2.createElement("label");
      this.renderer2.appendChild(label, this.renderer2.createText(userName));
      this.renderer2.appendChild(div, label);
      this.renderer2.appendChild(this.elementRef.nativeElement, div);

      const timeOut = setTimeout(() => this.hideCursor(div), 1000 * 2);

      this.map.set(userName, { element: div, timeOut: timeOut });
    }
  }

  private hideCursor(cursor: HTMLElement) {
    cursor.style.top = `0`;
    cursor.style.left = `0`;
    cursor.style.display = `none`;
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number, width: number, colorHex: string) {
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round'
      this.ctx.lineWidth = width;
      this.ctx.strokeStyle = colorHex;
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  public onCopyLinc() {
    if (this.host && this.groupName) {
      const httpParams: HttpParams = new HttpParams()
        .append('id', '5')
        .append('host', encodeURIComponent(this.host))
        .append('group', this.groupName);

      const req = new HttpRequest('GET', window.document.baseURI, { params: httpParams });
      this.clipboard.copy(req.urlWithParams)
    }
  }

}
