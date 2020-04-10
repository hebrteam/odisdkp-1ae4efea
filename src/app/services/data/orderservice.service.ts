import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, share, shareReplay, map } from 'rxjs/operators';

// CACHE
import { Cacheable } from 'ngx-cacheable';

// MODELS
import {  Order, Priority, ServiceEstatus } from 'src/app/models/types';

// GLOBAL
import { GLOBAL } from '../global';

// ERROR
import { ErrorsHandler } from 'src/app/providers/error/error-handler';


@Injectable()
    export class OrderserviceService {

    url: string;
    dialogData: any;
    error: boolean;
    responseCache = new Map();

    constructor(
        private _handleError: ErrorsHandler,
        public _http: HttpClient,
    ) {
        this.url = GLOBAL.url;
        this.error = false;
    }


  getDialogData() {
      return this.dialogData;
  }

  getQuery( query: string, token: string | string[] ): Observable<any> {
    if (!token || !query) {
       return;
    }

        const url = this.url + query;
        const headers = new HttpHeaders({'Content-Type': 'application/json' });
        return this._http.get(url, {headers: headers})
                         .pipe(
                           share(),
                           catchError(this._handleError.handleError)
                         );

  }

  getOrderDetail(orderid: number, token: any) {
    if (!orderid || !token) {
      return;
    }

    return this.getOrderData('orderdetail/' + orderid, token);
  }


  async getServiceOrder(filter: string, fieldValue: string, columnValue: string, fieldValueDate: string, columnDateDesdeValue: string, columnDateHastaValue: string, fieldValueRegion: string, columnValueRegion: string, fieldValueUsuario: string, columnValueUsuario: string, sort: string, order: string, pageSize: number, page: number, id: number, token: any, userid: number, grant?: number ) {
    let query = '';
    if (!token) {
      return;
    }
    // console.log(sort);
    if (!fieldValue) {
      fieldValue = '';
    }

    if (!order) {
      order = 'desc';
    }
    if (!sort) {
      sort = 'create_at';
    }

    const url = this.url;
    const paginate = `?filter=${filter}&fieldValue=${fieldValue}&columnValue=${columnValue}&fieldValueDate=${fieldValueDate}&columnDateDesdeValue=${columnDateDesdeValue}&columnDateHastaValue=${columnDateHastaValue}&fieldValueRegion=${fieldValueRegion}&columnValueRegion=${columnValueRegion}&fieldValueUsuario=${fieldValueUsuario}&columnValueUsuario=${columnValueUsuario}&sort=${sort}&order=${order}&limit=${pageSize}&page=${page + 1}`;

    // console.log(paginate);

    if (grant === 1) {
      query = 'service/' + id + '/order' + paginate;
    } else {
      query = 'service/' + id + '/user/' + userid + '/order' + paginate;
    }
    const href = url + query;
    const requestUrl = href;
    // const headers = new HttpHeaders().set('Content-Type', 'application/json');


    const httpOptions = {
      headers: new HttpHeaders({
        'Cache-Control': 'public, max-age=300, s-maxage=600',
        'Content-Type':  'application/json'
      })
    };


    if (!requestUrl || !token) {
        return;
    }

    try {
        return await this._http.get<any>(requestUrl, {headers: httpOptions.headers})
        .pipe(
          shareReplay(1)
          )
        .toPromise()
        .then()
        .catch((error) => { this._handleError.handleError (error); }
        );
   } catch (err) {
        console.log(err);
   }

    // console.log(paginate);
    // const paginate = `?page=${page + 1}`;
    // return this.getOrderData('service/' + id + '/order' + paginate, token);
  }



  getProjectShareOrder(filter: string, fieldValue: string, columnValue: string, fieldValueDate: string, columnDateDesdeValue: string, columnDateHastaValue: string, fieldValueRegion: string, columnValueRegion: string, fieldValueUsuario: string, columnValueUsuario: string, fieldValueEstatus: string, columnValueEstatus: string, columnTimeFromValue: any, columnTimeUntilValue: any, columnValueZona: number, idservicetype: number, sort: string, order: string, pageSize: number, page: number, id: number, idservice: number, token: any, event: number) {

    if (!fieldValue) {
      fieldValue = '';
    }

    if (!order) {
      order = 'desc';
    }
    if (!sort) {
      sort = 'create_at';
    }

    const paginate = `?filter=${filter}&fieldValue=${fieldValue}&columnValue=${columnValue}&fieldValueDate=${fieldValueDate}&columnDateDesdeValue=${columnDateDesdeValue}&columnDateHastaValue=${columnDateHastaValue}&fieldValueRegion=${fieldValueRegion}&columnValueRegion=${columnValueRegion}&fieldValueUsuario=${fieldValueUsuario}&columnValueUsuario=${columnValueUsuario}&fieldValueEstatus=${fieldValueEstatus}&columnValueEstatus=${columnValueEstatus}&columnTimeFromValue=${columnTimeFromValue}&columnTimeUntilValue=${columnTimeUntilValue}&columnValueZona=${columnValueZona}&idservicetype=${idservicetype}&event=${event}&sort=${sort}&order=${order}&limit=${pageSize}&page=${page + 1}`;
    // console.log('-----------------------------');
    // console.log(paginate);
    // console.log(id);
    // console.log(idservice);
    // const paginate = `?page=${page + 1}`;
    return this.getOrderData('projectservice/' + id + '/service/' + idservice + '/share' + paginate, token);
  }


    async getOrderData(query: string, token: any) {

        if (!token || !query) {
          return;
        }

        try {
            const url = this.url;
            const href = url + query;
            const requestUrl = href;
            const headers = new HttpHeaders({'Content-Type': 'application/json'});

            if (!requestUrl) {
              return;
            }

            return await new Promise((resolve, reject) => {
            if (token === '') {
                reject('Sin Token');
            }

            if (query === '') {
                reject('Sin Query Consulta');
            }

            console.log(requestUrl);

            resolve(
              this._http.get<Order>(requestUrl, {headers: headers})
                        .pipe(
                          share(),
                          catchError(this._handleError.handleError)
                        )
            );
            });

        } catch (err) {
          console.log(err);
       }
    }

    /*
    getOrderService(token: any, id: string): Observable<any> {
       return this.getQuery('service/' + id + '/order', token);
    }*/



    @Cacheable({
        maxCacheCount: 2,
        maxAge: 30000,
    })
    /*
    @Cacheable({
      cacheBusterObserver: cacheBuster$
    })*/
    getShowOrderService(token: any, id: number, orderid: number): Observable<any> {
      if (!token) {
        return;
      }

      /*
      const query = 'service/' + id + '/order/' + orderid;
      const url = this.url + query;
      const urlFromCache = this.responseCache.get(url);
      if (urlFromCache) {
        return of(urlFromCache);
      }
      const httpOptions = {
        headers: new HttpHeaders({
          'Cache-Control': 'public, max-age=300, s-maxage=600',
          'Content-Type':  'application/json'
        })
      };
      const response = this._http.get(url, {headers: httpOptions.headers}).map((res: any) => res);
      response.subscribe(res => this.responseCache.set(url, res));
      return response;*/

      const query = 'service/' + id + '/order/' + orderid;
      const url = this.url + query;

      const httpOptions = {
        headers: new HttpHeaders({
          'Cache-Control': 'public, max-age=300, s-maxage=600',
          'Content-Type':  'application/json'
        })
      };
      return this._http.get(url, {headers: httpOptions.headers})
                 .pipe(
                   map((res: any) => res),
                   catchError(this._handleError.handleError)
                  );

      /*const headers = new HttpHeaders({'Content-Type': 'application/json' });
      return this.getQuery('service/' + id + '/order/' + orderid, token);*/
    }


    getDetailOrderService(token: any, id: number, orderid: number): Observable<any> {
      if (!token) {
        return;
      }

      const query = 'service/' + id + '/order/' + orderid;
      const url = this.url + query;

      const httpOptions = {
        headers: new HttpHeaders({
          'Cache-Control': 'public, max-age=300, s-maxage=600',
          'Content-Type':  'application/json'
        })
      };
      return this._http.get(url, {headers: httpOptions.headers}).map((res: any) => res);

    }


    getFirmaImageOrder(token: any, id: string): Observable<any> {
        return this.getQuery('order/' + id + '/firmaimage', token);
    }

    getListAudioOrder(token: any, id: number): Observable<any> {
        return this.getQuery('order/' + id + '/audio', token);
    }


    @Cacheable({
      maxCacheCount: 2,
      maxAge: 30000,
    })
    getListImageOrder(token: any, id: number): Observable<any> {
        if (!token) {
          return;
        }

        // return this.getQuery('order/' + id + '/listimage', token);
        const query = 'order/' + id + '/listimage';
        const url = this.url + query;
        const headers = new HttpHeaders({'Content-Type': 'application/json' });
        return this._http.get(url, {headers: headers})
                         .pipe(
                          shareReplay(1),
                          catchError(this._handleError.handleError)
                         );

    }

    getImageOrder(token: any, id: string): Observable<any> {
        return this.getQuery('order/' + id + '/getimage', token);
    }


    getShowImageOrder(token: any, id: string): Observable<any> {
        return this.getQuery('image/' + id, token);
    }


    getService(token: any, id: string | number): Observable <any> {
        return this.getQuery('service/' + id, token);
    }

    getAtributoServiceType (token: any, id: string): Observable<any> {
        return this.getQuery('servicetype/' + id + '/atributo', token);
    }


    getServiceType (token: any, id: string | number): Observable<any> {
        return this.getQuery('service/' + id + '/servicetype', token);
    }

    getServiceEstatus (token: any, id: string | number): Observable<any> {
        return this.getQuery('service/' + id + '/estatus', token);
    }

    getCustomer(token: any, termino: string, id: number): Observable<any> {
        return this.getQuery('search/' + termino + '/' + id, token);
    }

    gettUserOrdenes(token: any, id: number, sort: string, order: string, pageSize: number, page: number) {
        if (!token) {
           return;
        }

        if (!order) {
           order = 'desc';
        }

        if (!sort) {
           sort = 'create_at';
        }

        const paginate = `?sort=${sort}&order=${order}&limit=${pageSize}&page=${page + 1}`;
        return this.getProjectOrderData('user/' + id + '/order' + paginate, token);
    }




    async getProjectOrderData(query: string, token: any) {
    if (!token) {
       return;
    }
      const url = this.url;
      const href = url + query;
      const requestUrl = href;
      const headers = new HttpHeaders({'Content-Type': 'application/json'});

      return await new Promise((resolve, reject) => {
        if (token === '') {
          reject();
        }

        if (query === '') {
          reject();
        }

        resolve(this._http.get<Order>(requestUrl, {headers: headers}));
        });
    }


    add(token: any, order: Order, id: number): Observable<any> {
        if (!token) {
            return;
        }
        const json = JSON.stringify(order);
        const params = 'json=' + json;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'project' + '/' + id + '/' + 'order', params, {headers: headers})
                         .pipe(
                           map( (resp: any) => resp),
                           share(),
                           catchError(this._handleError.handleError)
                           );
    }

    addEstatus(token: any, data: ServiceEstatus, id: number): Observable<any> {
    if (!token) {
       return;
    }

    const json = JSON.stringify(data);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.post(this.url + 'service/' + id + '/estatus/', params, {headers: headers}).map( (resp: any) => resp);
  }

  addPriority(token: any, id: number, data: Priority): Observable<any> {
    if (!token) {
       return;
    }

    const json = JSON.stringify(data);
    const params = 'json=' + json;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.post(this.url + 'service/' + id + '/priority', params, {headers: headers}).map( (resp: any) => resp);
 }


  async update(token: any, orderid: number, order: Order, id: number) {
    if (!token) {
      return;
    }

    try {
      const json = JSON.stringify(order);
      const params = 'json=' + json;
      const href = this.url + 'project/' + id + '/order/' + orderid;
      const requestUrl = href;
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return await this._http.put(requestUrl, params, {headers: headers}).toPromise()
      .then()
      .catch((error) => { this._handleError.handleError (error); }
      );
    } catch (err) {
      throw new Error(`Error HTTP `);
    }

  }

  updateEstatus(token: any, data: ServiceEstatus, id: number): Observable<any> {
    if (!token) {
      return;
    }

    const json = JSON.stringify(data);
    const params = 'json=' + json;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.post(this.url + 'estatus/' + id, params, {headers: headers}).map( (resp: any) => resp);
  }

  updateMass(token: any, data: any, id: number, paramset: string, paramvalue: number): Observable<any> {
    if (!token) {
      return;
    }

    const json = JSON.stringify(data);
    const params = 'json=' + json;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const Url = this.url + 'service/' + id + '/orderupdatemass/' + paramset + '/value/' + paramvalue;


    return this._http.post(Url, params, {headers: headers}).map( (resp: any) => resp );
  }

  updatePriority(token: any, id: number, data: Priority, data_id: number): Observable<any> {
    if (!token) {
       return;
    }

    const json = JSON.stringify(data);
    const params = 'json=' + json;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.put(this.url + 'service/' + id + '/priority/' + data_id, params, {headers: headers}).map( (resp: any) => resp);
 }



  deleteMass(token: any, data: any, id: number): Observable<any> {
    if (!token) {
      return;
    }

    const json = JSON.stringify(data);
    const params = 'json=' + json;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const Url = this.url + 'service/' + id + '/deletemass';


    return this._http.post(Url, params, {headers: headers}).map( (resp: any) => resp);
  }


  deleteEstatus(token: any, id: number): Observable<any> {

    if (!token) {
       return;
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.delete(this.url + 'estatus/' + id, {headers: headers}).map( (resp: any) => resp);
  }


  delete(token: any, orderid: number, id: number): Observable <any> {
    if (!token || !orderid || !id) {
       return;
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.delete(this.url + 'project' + '/' + id + '/' + 'order/' + orderid, {headers: headers});

  }

  deleteotedp(token: any, orderid: number, id: number): Observable<any> {
    if (!token) {
       return;
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.delete(this.url + 'project' + '/' + id + '/' + 'order/' + orderid + '/deleteotedp', {headers: headers}).map( (resp: any) => resp );
  }

  deletePriority(token: any, id: number, data_id: number): Observable<any> {
    if (!token || !id || !data_id) {
        return;
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.delete(this.url + 'service/' + id + '/priority/' + data_id, {headers: headers}).map( (resp: any) => resp);
 }



  important(token: any, id: number, orderid: number, label: number): void {
    if (!token) {
      return;
    }
      const json = JSON.stringify(label);
      const params = 'json=' + json;
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      this._http.post(this.url + 'project' + '/' + id + '/' + 'order/' + orderid + '/importantorder/' + label, params, {headers: headers}).subscribe(
            _data => {
              },
              (err: HttpErrorResponse) => {
              this.error = err.error.message;
      });
  }


}
