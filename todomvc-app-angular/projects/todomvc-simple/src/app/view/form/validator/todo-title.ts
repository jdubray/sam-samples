import { AbstractControl, ValidatorFn } from '@angular/forms';
import { isValidTodoTitle } from '../../../domain/todo';

export const todoTitleValidator: ValidatorFn = (control: AbstractControl) =>
  isValidTodoTitle(control.value)
    ? null
    : {
        emptyString: true,
      };
