import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { HrAgentComponent } from './hr-agent/hr-agent.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogInComponent } from './log-in/log-in.component';
import { AuthGuard } from './auth-services/auth.guard';
import { PostJobComponent } from './post-job/post-job.component';
import { ResultComponent } from './result/result.component';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {path: 'login', component: LogInComponent},
    // { path: 'home', component: HomePageComponent },
    {path:'hr-agent',component:HrAgentComponent, canActivate: [AuthGuard]},
    {path:'dashboard',component:DashboardComponent, canActivate: [AuthGuard]},
    {path:'job-post',component:PostJobComponent,canActivate:[AuthGuard]},
    {path:'results',component:ResultComponent,canActivate:[AuthGuard]},
    { path: '**', redirectTo: 'home' },

  ];
