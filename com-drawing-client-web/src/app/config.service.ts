import { Injectable } from '@angular/core';
import { ConfigModel } from './model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private config: ConfigModel | null = null;

  constructor() { }

  public setConfig(config: ConfigModel) {
    this.config = config;
  }

  public getConfig(): ConfigModel | null {
    return this.config;
  }

}
