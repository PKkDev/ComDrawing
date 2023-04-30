import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnectPageComponent } from './pages/connect-page/connect-page.component';
import { HubPageComponent } from './pages/hub-page/hub-page.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'connect',
        pathMatch: 'full'
    },
    {
        path: 'connect',
        component: ConnectPageComponent
    },
    {
        path: 'hub',
        component: HubPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }