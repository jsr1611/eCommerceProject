import { NativeDateAdapter } from "@angular/material/core";

export class MonthpickerDateAdapter extends NativeDateAdapter {
    constructor(matDateLocale: string) {
      super(matDateLocale);
    }
  
    override parse(value: string): Date | null {
      const monthAndYearRegex = /(10|11|12|0\d|\d)\/[\d]{4}/;
      if (value?.match(monthAndYearRegex)) {
        const parts = value.split('/');
        const month = Number(parts[0]);
        const year = Number(parts[1]);
        if (month > 0 && month <= 12) {
          return new Date(year, month - 1);
        }
      }
      return null;
    }
  
    override format(date: Date, displayFormat: any): string {
      const options = { year: 'numeric', month: 'long' } as const;
      return new Intl.DateTimeFormat('en-US', options).format(date);
    }    
  }