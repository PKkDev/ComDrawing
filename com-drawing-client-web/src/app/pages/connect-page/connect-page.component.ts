import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/config.service';
import { ConfigModel } from 'src/app/model';

@Component({
  selector: 'app-connect-page',
  templateUrl: './connect-page.component.html',
  styleUrls: ['./connect-page.component.scss']
})
export class ConnectPageComponent implements OnInit {

  public host: string | undefined;
  public userName: string | undefined;
  public groupName: string | undefined;

  public isSelectedHost = true;
  public isSelectedClient = false;

  public totalGroups: string[] = [];

  constructor(
    private http: HttpClient,
    private route: Router,
    private configService: ConfigService) { }

  ngOnInit() {
    this.host = window.document.baseURI;
    this.checkUrlParam();
  }

  private checkUrlParam() {
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

  public onRefreshGroups() {
    this.http.get<string[]>(this.host + 'api/groups/all')
      .subscribe({
        next: (value: string[]) => {
          this.totalGroups = value;
        },
      });
  }

  public onConnect() {
    if (this.host && this.userName && this.groupName) {
      const config = new ConfigModel(this.host, this.userName, this.groupName);
      this.configService.setConfig(config);
      this.route.navigate(['/hub']);
    }
  }

}
