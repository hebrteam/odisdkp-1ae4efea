import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// COMPONENTS
import { AddUserServiceComponent } from './components/adduserservice/adduserservice.component';
import { ProjectCategorieListComponent } from './dialog/project-categorie-list/project-categorie-list.component';
import { ProjectTypeListComponent } from './dialog/project-type-list/project-type-list.component';
import { RemoveUserComponent } from './components/removeuser/removeuser.component';
import { ServiceComponent } from './service-list/service.component';

// DIRECTIVES
import { DirectiveModule } from 'src/app/directives/directive.module';


// DIALOG
import { AddServiceComponent } from './dialog/addservice/addservice.component';
import { AddProjectTypeComponent } from './dialog/add-project-type/add-project-type.component';
import { AddProjectCategorieComponent } from './dialog/add-project-categorie/add-project-categorie.component';
import { AddProjectCurrencyValueComponent } from './dialog/add-project-currency-value/add-project-currency-value.component';
import { CloneServiceComponent } from './dialog/clone-service/clone-service.component';
import { CsvServiceComponent } from './dialog/csvservice/csvservice.component';
import { SettingServiceComponent } from './components/settingservice/settingservice.component';
import { DeleteServiceComponent } from './dialog/deleteservice/deleteservice.component';
import { InviteUserComponent } from './components/invite-user/invite-user.component';
import { ProjectCurrencyValueListComponent } from './dialog/project-currency-value-list/project-currency-value-list.component';
import { ProjectKpiListComponent } from './dialog/project-kpi-list/project-kpi-list.component';
import { UserComponent } from './dialog/user/user.component';

// MODULES
import { AngularSplitModule } from 'angular-split';
import { CalendarModule } from 'primeng/calendar';
import { CoreModule } from '../../core.module';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ViewModule } from '../../components/views/view.module';

// ROUTING
import { ServiceRoutingModule } from './service.routing';


@NgModule({
  imports: [
    AngularSplitModule.forRoot(),
    CalendarModule,
    CommonModule,
    CoreModule,
    DirectiveModule,
    FormsModule,
    HttpClientModule,
    MatProgressButtonsModule,
    NgSelectModule,
    NgxMatSelectSearchModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    PipesModule,
    ReactiveFormsModule,
    ServiceRoutingModule,
    SharedModule,
    ScrollingModule,
    ViewModule
  ],
  declarations:
  [
    AddProjectTypeComponent,
    AddProjectCategorieComponent,
    AddProjectCurrencyValueComponent,
    AddServiceComponent,
    AddUserServiceComponent,
    CloneServiceComponent,
    CsvServiceComponent,
    DeleteServiceComponent,
    InviteUserComponent,
    RemoveUserComponent,
    ServiceComponent,
    SettingServiceComponent,
    UserComponent,
    ProjectCategorieListComponent,
    ProjectTypeListComponent,
    ProjectCurrencyValueListComponent,
    ProjectKpiListComponent,
  ],
  entryComponents: [
    AddProjectTypeComponent,
    AddProjectCategorieComponent,
    AddProjectCurrencyValueComponent,
    AddServiceComponent,
    AddUserServiceComponent,
    CloneServiceComponent,
    CsvServiceComponent,
    DeleteServiceComponent,
    ProjectKpiListComponent,
    UserComponent
  ],
  providers: [
  ],
})
export class ServiceModule { }
