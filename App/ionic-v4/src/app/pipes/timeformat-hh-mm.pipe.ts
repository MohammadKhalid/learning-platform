import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
  name: 'timeformatHhMm'
})
export class TimeformatHhMmPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value? moment(value,'YYYY-MM-DD HH:mm:ss').format('hh:mm a'): null
  }

}
