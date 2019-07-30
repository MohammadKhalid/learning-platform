import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderByDate'
})
export class OrderByDatePipe implements PipeTransform {

  transform(array: Array<string>, args: string): Array<string> {
    if (!array || array === undefined || array.length === 0) return null;

    array.sort((a: any, b: any) => {
      if (new Date(a.createdAt) < new Date(b.createdAt)) {
        return -1;
      } else if (new Date(a.createdAt) > new Date(b.createdAt)) {
        return 1;
      } else {
        return 0;
      }
    });

      return array;
  }

}
