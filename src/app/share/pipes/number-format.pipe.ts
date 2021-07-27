import { Pipe, PipeTransform } from '@angular/core';
import { round } from 'lodash'

type unitTypes = 'k' | 'm';

enum Exponent {
  'k' = 1000,
  'm' = 100000
}

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number, precision: 1): string {
    if (!value || value < Exponent['k']) {
      return value.toString();
    }
    if (value > Exponent['m']) {
      return round(value / Exponent['m'], precision) + 'm';
    }
    return round(value / Exponent['k'], precision) + 'k';
  }

}
