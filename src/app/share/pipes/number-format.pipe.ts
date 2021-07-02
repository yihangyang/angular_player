import { Pipe, PipeTransform } from '@angular/core';
import { round } from 'lodash'

type unitTypes = 'k' | 'm';

interface FormatNumberConfig {
  unit: unitTypes;
  precision: number;
}

enum Exponent {
  'k' = 1000,
  'm' = 100000
}

const defaultConfig: FormatNumberConfig = {
  unit: 'k',
  precision: 1,
}
@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number, config: FormatNumberConfig = defaultConfig): string {
    if (!value || value < Exponent['k']) {
      return value.toString();
    }
    if (value > Exponent['m']) {
      return round(value / Exponent['m'], config.precision) + 'm';
    }
    return round(value / Exponent['k'], config.precision) + 'k';
  }

}
