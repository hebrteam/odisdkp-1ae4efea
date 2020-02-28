import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { shareReplay, tap } from 'rxjs/operators';

// MODELS
import { AtributoFirma, Order, OrderAtributoFirma, User } from 'src/app/models/types';

// SERVICES
import { OrderserviceService, SettingsService,  UserService, CustomformService, CustomerService} from 'src/app/services/service.index';

// PDF
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit, OnDestroy {

  atributo = [];
  atributofirma: AtributoFirma[] = [];
  counter;
  identity: any;
  imageRows = [];
  imageRowOne = [];
  isloading: boolean;
  isImageLoading: boolean;
  listimageorder = [];
  order: Order[] = [];
  order_id: number;
  orderatributo = [];
  orderatributofirma: OrderAtributoFirma[] = [];
  rotationAmount = 0;
  show: Boolean = true;
  service_id: number;
  sign: Boolean = false;
  sub: any;
  subscription: Subscription;
  token: any;
  usercreate: User[];
  userupdate: User[];

  projectformdata = [];
  projectformfield = [];
  estructuraDatos: [];

  proyectos: any;
  project_id = 0;
  clientInfo: object;
  client_loading = false;

  constructor(
    private _orderService: OrderserviceService,
    private _route: ActivatedRoute,
    public _userService: UserService,
    private _customerService: CustomerService,
    public _customForm: CustomformService,
    public label: SettingsService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.show = true;
    this.sub = this._route.params.subscribe(params => {
      this.service_id = +params.serviceid;
      this.order_id = params.orderid;
    });

    this.proyectos = this._userService.getProyectos();
    this.label.getDataRoute().subscribe(_data => {
      // console.log(data);
    });
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    // console.log('La página se va a cerrar');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  moreClient(cc_id: number) {
    if (this.clientInfo == null) {
      this.client_loading = true;

      if (this.project_id > 0) {
        this._customerService.getProjectCustomerDetail(this.token.token, this.project_id, cc_id).subscribe(
          response => {
            if (response.status === 'success') {
              const customer: any = response.datos;

              // console.log(response);

                  for (let i = 0; i < customer.length; i++) {
                     if (customer) {
                       this.clientInfo = {
                        name_table: customer[i]['name_table'],
                        cc_number: customer[i]['cc_number'],
                        nombrecc: customer[i]['nombrecc'],
                        ruta: customer[i]['ruta'],
                        calle: customer[i]['calle'],
                        numero: customer[i]['numero'],
                        block: customer[i]['block'],
                        depto: customer[i]['depto'],
                        latitud: customer[i]['latitud'],
                        longitud: customer[i]['longitud'],
                        medidor: customer[i]['medidor'],
                        modelo_medidor: customer[i]['modelo_medidor'],
                        id_tarifa: customer[i]['id_tarifa'],
                        id_constante: customer[i]['id_constante'],
                        id_giro: customer[i]['id_giro'],
                        id_sector: customer[i]['id_sector'],
                        id_zona: customer[i]['id_zona'],
                        id_mercado: customer[i]['id_mercado'],
                        tarifa: customer[i]['tarifa'],
                        constante: customer[i]['constante'],
                        giro: customer[i]['giro'],
                        sector: customer[i]['sector'],
                        zona: customer[i]['zona'],
                        mercado: customer[i]['mercado'],
                        id_region: customer[i]['id_region'],
                        id_provincia: customer[i]['id_provincia'],
                        id_comuna: customer[i]['id_comuna'],
                        region: customer[i]['region'],
                        provincia: customer[i]['province'],
                        comuna: customer[i]['comuna'],
                        observacion: customer[i]['observacion'],
                        marca_id: customer[i]['marca_id'],
                        modelo_id: customer[i]['modelo_id'],
                        description: customer[i]['description'],
                        color_id: customer[i]['color_id'],
                        marca: customer[i]['marca'],
                        modelo: customer[i]['modelo'],
                        color: customer[i]['color'],
                        patio: customer[i]['patio'],
                        espiga: customer[i]['espiga'],
                        posicion: customer[i]['posicion'],
                        set: customer[i]['set'],
                        alimentador: customer[i]['alimentador'],
                        sed: customer[i]['sed'],
                        llave_circuito: customer[i]['llave_circuito'],
                        fase: customer[i]['fase'],
                        clavelectura: customer[i]['clavelectura'],
                        factor: customer[i]['factor'],
                        fecha_ultima_lectura: customer[i]['fecha_ultima_lectura'],
                        fecha_ultima_deteccion: customer[i]['fecha_ultima_deteccion'],
                        falta_ultimo_cnr: customer[i]['falta_ultimo_cnr'],
                       };

                       // console.log(this.clientInfo);

                       this.client_loading = false;
                       break;
                     }
                  }

             } else {
              if (response.status === 'error') {
                this.client_loading = false;
                // console.log(response);
              }
            }
          },
              error => {
                this.client_loading = false;
                console.log(<any>error);
              }
          );
        }

    } else {
      this.clientInfo = null;
    }
  }

  public loadData() {
    if (this.service_id > 0 && this.order_id > 0) {
      this.isloading = true;
      this.getListImage();
      this.project_id = this.filterProjectByService();
      this.cargarProjectForm(this.project_id);
      this.subscription = this._orderService.getShowOrderService(this.token.token, this.service_id, this.order_id)
      .pipe(
        tap(),
        shareReplay()
      )
      .subscribe(
      response => {
        if (!response) {
          this.isloading = false;
          return;
        }
          this.order = response.datos;
          // console.log(this.order);
        if (this.order.length > 0) {
              this.atributo = response.atributo;
              this.orderatributo = response.orderatributo;
              if (this.order[0].sign && this.order[0].sign > 0) {
                this.sign = true;
                if (this.order[0].usercreate_id && this.order[0].usercreate_id > 0 ) {
                  this.usercreate = this.order[0].usercreate_id;
                }
                if (this.order[0].userupdate_id && this.order[0].userupdate_id > 0 ) {
                  this.userupdate = this.order[0].userupdate_id;
                }
              }
              if (this.order[0].orderatributofirma.length > 0) {
                this.orderatributofirma = this.order[0].orderatributofirma;
              }
              if (this.order[0].atributo_firma.length > 0) {
                this.atributofirma = this.order[0].atributo_firma;
              }
                this.isloading = false;
          } else {
                this.isloading = false;
          }
      },
      error => {
        this.isloading = false;
        console.log(<any>error);
        }
      );
    }
  }

  async cargarProjectForm (id: number) {
    if (id && id > 0) {
      this.projectformdata = [];
      const data: any = await this._customForm.getProjectForm(this.token.token, id);

      const arraylistForm = data.datos;
      for (let i = 0; i < arraylistForm.length; i++) {
        const listform: any = arraylistForm[i];
        const formid = listform.id;

        const response: any = await this._customForm.getFormResource(this.token.token, this.order_id, formid);
        const arrayForm: Array<object> = [];

        if (response && response.status === 'success' && response.datos.length > 0) {
          const form: any = await this._customForm.getProjectFormField(this.token.token, id, formid);
          const res = response.datos;

          const arraydata: Array<Array<object>> = [];

          let num = 0;

          for (let x = 0; x < res.length; x++) {
            const element: any = res[x];

            if (arraydata.length === 0) {
              arraydata[num] = [element];
            } else {

              if (arraydata[num] && element.order_by === num) {
                const arr = arraydata[num];
                arr.push(element);
                arraydata[num] = arr;
              } else {
                num = num + 1;
                arraydata[num] = [element];
              }

            }

          }

          if (form && form.datos.length > 0 && arraydata.length > 0) {
            const datos: [] = form.datos;
            for (let y = 0; y < arraydata.length; y++) {
              const registro = arraydata[y];
              arrayForm.push(this.getEstructuraAndForm(datos, registro));
            }
          }

          this.projectformfield.push({'description': listform, 'form': arrayForm});
        }

      }

    }
  }

  getEstructuraAndForm(data: Array<Object>, registro: Array<Object>): Array<Object> {

    if (data && data.length > 0) {

      const arr: Array<Object> = [];

      for (let i = 0; i < data.length; i++) {
        const element: any = data[i];
        let boovalidate = false;
        for (let x = 0; x < registro.length; x++) {
          const reg: any = registro[x];
          if (reg.de_form_id === element.id) {
            boovalidate = true;
            const estructura: Object = {
              orderid: this.order_id,
              description: element.description,
              form_id: element.form_id,
              id: element.id,
              name: element.name,
              order_by: element.order_by,
              predetermined: element.predetermined,
              required: element.required,
              rol: element.rol,
              type: element.type,
              type_id: element.type_id,
              value: reg.valor,
            };

            arr.push(estructura);
          }

        }

        if (!boovalidate) {
          const estructura: Object = {
            orderid: this.order_id,
            description: element.description,
            form_id: element.form_id,
            id: element.id,
            name: element.name,
            order_by: element.order_by,
            predetermined: element.predetermined,
            required: element.required,
            rol: element.rol,
            type: element.type,
            type_id: element.type_id,
            value: '',
          };
          arr.push(estructura);
        }


      }

      return arr;

    }

  }

  filterProjectByService() {
    for (let i = 0; i < this.proyectos.length; i += 1) {
      const result = this.proyectos[i];
      if (result && result.service) {
        for (let y = 0; y < result.service.length; y += 1) {
          const response = result.service[y];
          if (response && response.id === this.service_id) {
            return result.id;
          }
        }
      }
    }
  }

  rotateImage(direction, image) {
    this.rotationAmount += direction === 'left' ? -45 : 45;
    document.getElementById(image).style.transform = `rotate(${this.rotationAmount}deg)`;
  }

  seeImage(image) {
    const url = 'data:image/jpg;base64,' + image;
    const newTab = window.open();
    newTab.document.body.innerHTML = '<img src="' + url + '">';
    newTab.document.title = 'OCA Global - ODIS Image';

    const timer = setInterval(function() {
      if (newTab.closed) {
          clearInterval(timer);
          alert('Closed');
      }
      }, 1000);
  }

  submit() {
  // emppty stuff
  }

  public getListImage() {

    if (this.token.token && this.order_id) {
      this.isImageLoading = true;
      this.subscription = this._orderService.getListImageOrder(this.token.token, this.order_id).subscribe(
      response => {
        if (!response) {
          this.isImageLoading = false;
          return;
        }
          if (response.status === 'success') {
            this.listimageorder = response.datos;
            if (this.listimageorder.length > 0) {
              const imageOne = [];
              const imageCero = [];
              for (let i = 0; i < this.listimageorder.length; i++) {
                if (Number(this.listimageorder[i]['tipo']) === 1) {
                  imageOne.push(this.listimageorder[i]);
                }
                if (this.listimageorder[i]['tipo'] === null || Number(this.listimageorder[i]['tipo']) === 0) {
                  imageCero.push(this.listimageorder[i]);
                }
              }

              if (imageCero.length > 0) {
                this.imageRows = this.getSplitArray(imageCero, 2);
                // console.log(this.imageRows);
              }
              if (imageOne.length > 0) {
                this.imageRowOne = this.getSplitArray(imageOne, 2);
                // console.log(this.imageRowOne);
              }

            }
            this.counter = this.listimageorder.length;
          }
            this.isImageLoading = false;
      },
          error => {
          this.isImageLoading = false;
          console.log(<any>error);
          }
      );
    }
  }

  public getSplitArray (list, columns): Array<Object> {
    const array = list;
    if (array.length <= columns) {
      array.length = 2;
        // return [array];
    }

    const rowsNum = Math.ceil(array.length / columns);
    const rowsArray = new Array(rowsNum);

    for (let i = 0; i < rowsNum; i++) {
      const columnsArray = new Array(columns);
        for (let j = 0; j < columns; j++) {
          const index = i * columns + j;

          if (index < array.length) {
              columnsArray[j] = array[index];
          } else {
              break;
          }
        }
        rowsArray[i] = columnsArray;
    }

    return rowsArray.reverse();

    // return rowsArray;
    // console.log(this.imageRows)
  }

  public print(divName: any) {
    const innerContents = document.getElementById(divName).innerHTML;
    const popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('<html><head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" /></head><body onload="window.print()">' + innerContents + '</html>');
    // popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="./show.component.css" /></head><body onload="window.print()">' + innerContents + '</html>');
    popupWinindow.document.close();
  }

  public downloadPDF(divName: any) {

    // OUR IMPLEMENTATION
    const data = document.getElementById(divName);
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 201;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      // pdfConf = { pagesplit: false, background: '#fff' };

      let position = 4;
      pdf.addImage(contentDataURL, 'PNG', 4, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;


      while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(contentDataURL, 'PNG', 4, position + 14, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
      pdf.setFont('times', 'italic');
      pdf.setFontType('normal');
      pdf.setFontSize(28);
      pdf.save('Orden.pdf'); // Generated PDF
    });

  }


  toggle() {
    this.show = !this.show;
    if (this.show) {
      this.getListImage();
    }
  }

}
