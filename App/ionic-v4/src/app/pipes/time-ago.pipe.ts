import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    // return value ? moment(value, 'YYYY-MM-DD HH:mm:ss').toNow() : null
    // return value ? moment(value, 'YYYY-MM-DD HH:mm:ss').fromNow() : null
      if (moment(value, 'YYYY-MM-DD HH:mm:ss').calendar().split(' ')[0] == 'Today') {
      return value ? moment(value, 'YYYY-MM-DD HH:mm:ss').calendar().split(' ')[0] : null
    }
    else {
      return value ? moment(value, 'YYYY-MM-DD HH:mm:ss').fromNow() : null
    }
  }
}
