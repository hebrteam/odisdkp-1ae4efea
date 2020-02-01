import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PROVIDERS
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from '../../providers/interceptor/my.interceptor';


// MODULES
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

// COMPONENTS
import { UsuariosComponent } from './usuarios-list/usuarios.component';
import { UsuariosDetailComponent } from './usuarios-detail/usuarios-detail.component';
import { UsuarioWorkComponent } from './usuario-work/usuario-work.component';

// DIALOG
import { AddUserComponent } from './dialog/adduser/adduser.component';
// import { AddTeamComponent } from './dialog/add-team/add-team.component';
import { EditUserComponent } from './dialog/edituser/edituser.component';
import { ModalUploadImageComponent } from './dialog/modaluploadimage/modaluploadimage.component';
import { SettingUserComponent } from './dialog/setting-user/setting-user.component';
import { ShowProfileSecurityComponent } from './dialog/showprofilesecurity/showprofilesecurity.component';

// ROUTING
import { UsuariosRoutingModule } from './usuarios.routing';


// SERVICES
import { ServiceModule } from 'src/app/services/service.module';



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
    UsuariosRoutingModule,
  ],
  declarations: [
    AddUserComponent,
    // AddTeamComponent,
    EditUserComponent,
    ModalUploadImageComponent,
    SettingUserComponent,
    ShowProfileSecurityComponent,
    UsuariosComponent,
    UsuariosDetailComponent,
    UsuarioWorkComponent,
  ],
  entryComponents: [
    AddUserComponent,
    // AddTeamComponent,
    EditUserComponent,
    ModalUploadImageComponent,
    SettingUserComponent,
    ShowProfileSecurityComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
  ],
})
export class UsuariosModule { }
