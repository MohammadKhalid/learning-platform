import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'timeformat'
})
export class TimeformatPipe implements PipeTransform {
  transform(value: any, args?: any): any {  
    return value ? moment(value,'YYYY-MM-DD hh:mm:ss').format('MM/DD/YYYY') : null;
  }
}
