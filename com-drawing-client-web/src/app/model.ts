import { TemplateRef } from "@angular/core";

export interface CursorData {
    x: number;
    y: number;
}

export interface DrawData {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    width: number;
    colorHex: string;
}

export interface CursorModel {
    element: HTMLElement;
    timeOut: any;
}

export interface MessageModel {
    message: string,
    userName: string
    template: TemplateRef<any>
}