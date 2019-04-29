import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

//MODELS
import { Proyecto, User } from '../models/types';


//SERVICES
import { AuthService, DashboardService, SettingsService, UserService } from '../services/service.index';

//SETTINGS
import { GLOBAL } from '../services/global';


//UTILITY
import { MatProgressButtonOptions } from 'mat-progress-buttons'


//TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';



@Component({
  selector:'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {

  departamentos: Array<any> = [];
  email: string;
  error:string;
  fotoperfil: string = '';
  hide = true;
  loading: boolean = false;  
  identity;
  idaccount;
  proyectos: Array<Proyecto>;
  rememberMe:number = 0;  
  selected: string;
  success:string;
  show:boolean = false;
  status: string;  
  title: string;
  token;
  user: User;
  userFirebase;
  useraccount: string;
  year: number;
  version:string;


  spinnerButtonOptionsDisabled: MatProgressButtonOptions = {
    active: false,
    text: 'Iniciar sesión',
    spinnerSize: 18,
    raised: true,
    stroked: false,
    buttonColor: 'primary',
    spinnerColor: 'warn',
    fullWidth: true,
    disabled: true,
    mode: 'indeterminate',    
  }

  spinnerButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Iniciar sesión',
    spinnerSize: 18,
    raised: true,
    stroked: false,
    buttonColor: 'primary',
    spinnerColor: 'warn',
    fullWidth: true,
    disabled: false,
    mode: 'indeterminate',    
  }

 barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Iniciar sesión',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }


    formControl = new FormControl('', [Validators.required, Validators.email]);

    getErrorMessage() {
    return this.formControl.hasError('required') ? 'Dato Valido Requerido' : 
        this.formControl.hasError('email') ? 'Email no valido' : 
       //this.email.hasError('email') ? 'Email no valido' : 
       '';
    }

  //private _toasterService: ToasterService;

  subscription: Subscription;

  constructor(
    public _proyectoService: DashboardService,		
    public _route: ActivatedRoute,
    public _router: Router,
    public _userService: UserService,
    public authService: AuthService,
    public label: SettingsService,
    public toasterService: ToastrService,    
  ){

    this.user = new User('','','','','','','', 1,'','',1,'','',1,1,1);
    this.year = new Date().getFullYear();
    this.identity = this._userService.getIdentity();
    this.idaccount = this._userService.getIdaccount();
    this.token = this._userService.getToken();      
    this._userService.handleAuthentication(this.identity, this.token);  
    this.success = 'Exitoso.';
    this.error = 'Credenciales no validas.'; 
    this.version = GLOBAL.version;
    this.label.getDataRoute().subscribe(data => {
      this.title = data.subtitle;
    });
          
  }

  ngOnInit(){
    if (this._userService.isAuthenticated()) {
      this._router.navigate(['dashboard']);
    }    
    this.logout();
    if (this.idaccount) {
      this.rememberMe = 1;
      this.email = this.idaccount;
    } else {
      this.rememberMe = 0;
    }

  }


	ngOnDestroy(){
		if(this.subscription){
			this.subscription.unsubscribe();
		}
		//console.log("ngOnDestroy unsuscribe");
	}

    onChange(value) {
        if (value.checked == true) {
          this.rememberMe = 1;
        } else {
          this.rememberMe = 0;
        }
    }



  onSubmit(form:NgForm){
   this.spinnerButtonOptions.active = true;
   this.spinnerButtonOptions.text = 'Espere...';
   if(!form.valid){
    return;
   }

   let usuario = new User('', '', '', '', '', form.value.email, form.value.password, 1, '', this.version, 1, '','',1, 1, 1);

   if (this.rememberMe == 1){
    let key = 'idaccount';
    this.useraccount = usuario.email;
    this._userService.saveStorage(key, this.useraccount);
   }else{
    if (localStorage['idaccount'] && localStorage['idaccount'] !== undefined && localStorage['idaccount'] !== null) {
        localStorage.removeItem('idaccount');
    }           
   }



   this._userService.signup(usuario).subscribe(
     (response:any) => {       
       if(response.status != 'error' ){
         this.status = 'success';         
         this.token = response;
       }
     },
     (error:any) => {
      this.spinnerButtonOptions.active = false;                      
      this.spinnerButtonOptions.text = 'Iniciar sesión'         
      this.status = 'error';
      this.toasterService.warning('Error: '+this.error, 'Error', {enableHtml: true,closeButton: true, timeOut: 6000 });
     },
     () => { 

      //console.log('Primer Login success')
      this._userService.signuptrue(usuario, true).subscribe(
        (response:any) => { 
          this.identity = response;
          if(this.identity){
            this.getPerfilUser(this.identity.sub);
          }        
          this._userService.handleAuthentication(this.identity, this.token);          
        },
        (error:any) => {
          this.spinnerButtonOptions.active = false;                      
          this.spinnerButtonOptions.text = 'Iniciar sesión'         
          this.status = 'error';
          this.toasterService.warning('Error: '+this.error, 'Error', {enableHtml: true,closeButton: true, timeOut: 6000 });    
        },
        () => { 
          //console.log('Segundo Login success');
          this._proyectoService.getProyectos(this.token.token, this.identity.dpto).subscribe(
            (response:any) => {
                if (response.status == 'success'){
                  this.proyectos = response.datos;
                  let key = 'proyectos';
                  this._userService.saveStorage(key, this.proyectos);
                  this.spinnerButtonOptions.active = false;                      
                  this.spinnerButtonOptions.text = 'Iniciar sesión'          
                  this.toasterService.success('Acceso: '+this.success, 'Exito', {timeOut: 4000,});
                  this._router.navigate(['dashboard']);  
                }
              },
              (error:any) => {
                this.spinnerButtonOptions.active = false;                      
                this.spinnerButtonOptions.text = 'Iniciar sesión'
                localStorage.removeItem('departamentos');
                localStorage.removeItem('expires_at');
                localStorage.removeItem('fotoprofile');
                localStorage.removeItem('identity');
                localStorage.removeItem('proyectos');
                localStorage.removeItem('token');		    
                this._router.navigate(['/login']);
              },
              () => { 
                //console.log('Complete');
              }
            );   
        }
        
        );


      }
     );

  }


  getPerfilFirebase(response: any){
    if(response){
    }else{

    }
  }

  getPerfilUser(id: any){
    if(id && this.token.token){
      this._userService.getPerfilUser(this.token.token, id).subscribe(
        response => {        
          if(!response){
            return false;        
          }
            if(response.status == 'success'){ 
              this.fotoperfil = response.datos[0]['archivo'];
              if(this.fotoperfil.length > 0){
                let key = 'fotoprofile';
                this._userService.saveStorage(key, this.fotoperfil);  
              }
            }
        },
            error => {
            console.log(<any>error);
            }   
        );      
    }

  }




  logout(){        
    this._route.params.subscribe(params => {
      let logout = +params['sure'];
      if(logout == 1){ 
        
        localStorage.removeItem('departamentos');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('fotoprofile');
        localStorage.removeItem('identity');
        localStorage.removeItem('proyectos');
        localStorage.removeItem('token');      
        this.identity = null;
        this.token = null;
        this.proyectos = null;        
        //this._router.navigate(['']);
        this.authService.logout();
        this._router.navigate(['/login']);
      }

    })
  }



  
}