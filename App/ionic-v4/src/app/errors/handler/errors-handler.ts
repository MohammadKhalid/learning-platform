
import { ErrorHandler, Injectable, Injector} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorsService } from '../../services/errors/errors.service';
import { NotificationService } from '../../services/notification/notification.service';

import * as StackTraceParser from 'error-stack-parser';

@Injectable()
export class ErrorsHandler implements ErrorHandler {
  constructor(
    private injector: Injector
  ) {}

  handleError(error: Error | HttpErrorResponse) {
    const notificationService = this.injector.get(NotificationService);
    const errorsService = this.injector.get(ErrorsService);

    if (error instanceof HttpErrorResponse) {
      // Server error happened      
      if (!navigator.onLine) {
        // No Internet connection
        return notificationService.showMsg('No Internet Connection');
      }
      // Http Error
      // Send the error to the server
      errorsService.log(error).subscribe();
      
      // Show notification to the user
      // return notificationService.notify(`${error.status} - ${error.message}`);

      let notificationMsg: string = 'Error! ';
      switch (error.status) {
        case 0:
          notificationMsg += 'Cannot connect to server';
          break;
        case 401:
          notificationMsg = error.error;
          break;
        default:
          notificationMsg += error.message;
          break;
      }

      return notificationService.showMsg(notificationMsg);
    } else {
      // Client Error Happend
      // Send the error to the server and then
      errorsService.log(error)
    }
  }
}