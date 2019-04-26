import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//COMPONENT
import { ServiceComponent } from './service-list/service.component';

//Guards
import { AuthguardService } from '../../services/authguard.service';



const routes: Routes = [
    { path:':id', 
    component: ServiceComponent,
    canActivate: [AuthguardService],
    data: { path: 'projectservice', titulo: 'OCA Global - ODIS Proyectos', subtitle: 'Proyectos', descripcion: 'OCA Global - ODIS Project Services Managment' }
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthguardService]
})
export class ServiceRoutingModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/