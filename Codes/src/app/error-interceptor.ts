import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      // map((event: HttpEvent<any>) => {
      //   let successMessage = 'Successfully completed';
      //   let titleMessage = 'Success';
      //   if (event instanceof HttpResponse) {
      //     if (event.body.title) {
      //       titleMessage = event.body.title;
      //     }
      //     if (event.body.message) {
      //       successMessage = event.body.message;
      //     }
      //     this.dialog.open(ErrorComponent, {
      //       data: { title: titleMessage, message: successMessage }
      //     });
      //   }
      //   return event;
      // }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        let titleMessage = 'Error';
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        if (error.error.title) {
          titleMessage = error.error.title;
        }
        this.dialog.open(ErrorComponent, {
          data: { title: titleMessage, message: errorMessage }
        });
        return throwError(error);
      })
    );
  }
}
