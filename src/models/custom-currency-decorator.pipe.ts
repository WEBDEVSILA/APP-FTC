import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customCurrencyDecorator' })
export class CustomCurrencyDecoratorPipe implements PipeTransform {
  transform(currency: number) {
    if (!currency) { return ''; }
    const value = currency.toString().trim().replace(/[$'.,\s]/g, '');

    if (value.match(/[^0-9]/)) {
      return currency;
    }

    let firstPart, secondPart, thirdPart, fourthPart;
    switch (value.length) {
      case 4:
        firstPart = value.slice(0, 1);
        secondPart = value.slice(1, 4);
        return ('$' + firstPart + '.' + secondPart).trim();
      case 5:
        firstPart = value.slice(0, 2);
        secondPart = value.slice(2, 5);
        return ('$' + firstPart + '.' + secondPart).trim();
      case 6:
        firstPart = value.slice(0, 3);
        secondPart = value.slice(3, 6);
        return ('$' + firstPart + '.' + secondPart).trim();
      case 7:
        firstPart = value.slice(0, 1);
        secondPart = value.slice(1, 4);
        thirdPart = value.slice(4, 7);
        return ('$' + firstPart + "'" + secondPart + '.' + thirdPart).trim();
      case 8:
        firstPart = value.slice(0, 2);
        secondPart = value.slice(2, 5);
        thirdPart = value.slice(5, 8);
        return ('$' + firstPart + "'" + secondPart + '.' + thirdPart).trim();
      case 9:
        firstPart = value.slice(0, 3);
        secondPart = value.slice(3, 6);
        thirdPart = value.slice(6, 9);
        return ('$' + firstPart + "'" + secondPart + '.' + thirdPart).trim();
      case 10:
        firstPart = value.slice(0, 1);
        secondPart = value.slice(1, 4);
        thirdPart = value.slice(4, 7);
        fourthPart = value.slice(7, 10);
        return ('$' + firstPart + '.' + secondPart + "'" + thirdPart + '.' + fourthPart).trim();
      case 11:
        firstPart = value.slice(0, 2);
        secondPart = value.slice(2, 5);
        thirdPart = value.slice(5, 8);
        fourthPart = value.slice(8, 11);
        return ('$' + firstPart + '.' + secondPart + "'" + thirdPart + '.' + fourthPart).trim();
      case 12:
        firstPart = value.slice(0, 3);
        secondPart = value.slice(3, 6);
        thirdPart = value.slice(6, 9);
        fourthPart = value.slice(9, 12);
        return ('$' + firstPart + '.' + secondPart + "'" + thirdPart + '.' + fourthPart).trim();
      default:
        return '$' + value;
    }
  }
}

/**
 * import { Pipe, PipeTransform } from '@angular/core';
import { Properties } from '../properties';

@Pipe({
    name: 'customCurrencyDecorator2'
})
export class CustomCurrencyDecoratorPipe2 implements PipeTransform {

    transform(value: string, args?: any): any {
        if (value) {
            if (value === '$') {
                return '$0';
            } else if (value.toString().includes('$')) {
                return '$' + Properties.currency(parseInt(value.split('$')[1].split(',').join('').split('.').join('').split("'").join(''), 10), 0);
            } else if (value === '0') {
                return '$0';
            } else {
                return '$' + Properties.currency(parseInt(value, 10), 0);
            }
        }
    }
}

 */
