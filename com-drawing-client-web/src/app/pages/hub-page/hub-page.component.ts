import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { ConfigService } from 'src/app/config.service';
import { ConfigModel, CursorData, CursorModel, DrawData, MessageModel } from 'src/app/model';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-hub-page',
  templateUrl: './hub-page.component.html',
  styleUrls: ['./hub-page.component.scss']
})
export class HubPageComponent implements OnInit, AfterViewInit {

  public connection: HubConnection | undefined;
  public isConnected: boolean = false;

  public config!: ConfigModel;

  public messages: MessageModel[] = [];

  public color: string = '#000';
  public width: number = 1;

  private map: Map<string, CursorModel> = new Map<string, CursorModel>();

  @ViewChild('canvas', { static: false }) canvas: ElementRef<any> | undefined;

  public ctx: CanvasRenderingContext2D | null = null;

  constructor(
    private http: HttpClient,
    private route: Router,
    private configService: ConfigService,
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    private clipboard: Clipboard) { }

  ngOnInit() {
    const config = this.configService.getConfig();
    if (config) {
      this.config = config;
      this.initiclConnect();
    }
    else {
      this.route.navigate(['/connect']);
    }
  }

  ngAfterViewInit() {
    if (this.canvas) {
      const canvasItem = this.canvas.nativeElement as HTMLCanvasElement;
      this.ctx = canvasItem.getContext('2d');
    }
  }

  private initiclConnect() {
    if (this.connection && this.connection.state != HubConnectionState.Disconnected) {
      this.connection.stop();
      this.connection = undefined;
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(this.config.host + 'DrawHub')
      .build();

    this.connection.onclose((err) => {
      window.alert(err);
      this.connection?.start();
    });
    this.isConnected = true;

    this.connection.on('DrawReceived', (userName: string, data: DrawData,) => {
      if (this.config.userName != userName)
        this.drawLine(data.startX, data.startY, data.endX, data.endY, data.width, data.colorHex);
    });

    this.connection.on('MoveCursorReceived', (userName: string, data: CursorData) => {
      if (this.config.userName != userName)
        this.viewCursor(data.x, data.y, userName);
    });

    this.connection.on('SendMessage', (userName: string, message: string) => {
      this.viewUserMessage(message, userName);
    });

    this.connection.start()
      .catch((err) => {
        this.viewSystemMessage(err);
        this.isConnected = false;
      })
      .then(() => {
        this.connection?.invoke('AddToGroup', this.config.groupName, this.config.userName)
      });
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
          .invoke("Drawing", this.config.groupName, this.config.userName, drawData)
          .catch((err) => { this.viewSystemMessage(err); });
      }

      this.startX = currX;
      this.startY = currY;
    }

    if (this.connection && this.connection.state == HubConnectionState.Connected) {
      const cursorData: CursorData = { x: currX, y: currY, }
      this.connection
        .invoke("MoveCursor", this.config.groupName, this.config.userName, cursorData)
        .catch((err) => { this.viewSystemMessage(err); });
    }

  }

  public onMouseUp(event: any) {
    this.isDrawing = false;
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

  //#endregion Drawing

  public onSendMessage(message: string) {
    if (this.connection)
      this.connection
        .invoke('SendMessageToGroup', this.config.groupName, this.config.userName, message)
        .catch((err) => { this.viewSystemMessage(err); });
  }

  public onSelectEraser() {
    this.color = '#fff';
  }

  //#region View message
  private viewSystemMessage(message: string) {
    this.messages.push({
      message: message,
      userName: 'System'
    });
  }
  private viewUserMessage(message: string, user: string) {
    this.messages.push({
      message: message,
      userName: user
    });
  }
  //#endregion View message

  public onCopyLinc() {
    const httpParams: HttpParams = new HttpParams()
      .append('id', '5')
      .append('host', encodeURIComponent(this.config.host))
      .append('group', this.config.groupName);
    const req = new HttpRequest('GET', window.document.baseURI + 'connect', { params: httpParams });
    this.clipboard.copy(req.urlWithParams)
  }

}
