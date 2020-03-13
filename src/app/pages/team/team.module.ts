import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PROVIDERS
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from '../../providers/interceptor/index';

// MODULES
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

// COMPONENTS

// DIALOG
import { AddUserTeamComponent } from './dialog/add-user-team/add-user-team.component';
import { EditTeamComponent } from './dialog/edit-team/edit-team.component';

// ROUTING
import { TeamRoutingModule } from './team.routing';


// SERVICES
import { ServiceModule } from 'src/app/services/service.module';
import { TeamListComponent } from './team-list/team-list.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule,
    PipesModule,
    ServiceModule,
    SharedModule,
    TeamRoutingModule,
  ],
  declarations: [
    // AddTeamComponent,
    AddUserTeamComponent,
    EditTeamComponent,
    TeamListComponent
  ],
  entryComponents: [
    // AddTeamComponent
    AddUserTeamComponent,
    EditTeamComponent
  ],
  providers: [
    httpInterceptorProviders
  ],
})
export class TeamModule { }
