import { Component, OnInit } from '@angular/core';
import { UserService } from './services/UserService';
import { Visit } from './models/visit';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Arabic Course';
  dailyVisitData!: Visit;
  dailyVisitCount: number = 0;
  UNIQUE_VISITORS: string = "uniqueVisitors";
  CURRENT_DATE: string = "currentDate";

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    let localCount = localStorage.getItem(this.UNIQUE_VISITORS);
    let currentDate = localStorage.getItem(this.CURRENT_DATE);
    if (localCount && currentDate) {
      if (this.formatDate(new Date()) == currentDate && Number(localCount) > this.dailyVisitCount) {
        this.dailyVisitCount = Number(localCount);
      }
    }
    this.userService.recordVisit().subscribe({
      next: () => console.log('Tashrif muvaffaqiyatli qayd etildi. Tashrifingiz uchun rahmat!'),
      error: error => console.error('Tashrif qayd etishda xatolik bo`ldi', error)
    });

    setTimeout(() => {
      this.userService.getVisitsCount().subscribe({
        next: (visitData: Visit) => {
          this.dailyVisitData = visitData;
          if (visitData.uniqueVisitors > this.dailyVisitCount) {
            this.dailyVisitCount = visitData.uniqueVisitors;
          }
          localStorage.setItem(this.UNIQUE_VISITORS, `${this.dailyVisitCount}`);
          localStorage.setItem(this.CURRENT_DATE, `${this.formatDate(new Date())}`);
        },
        error: (error: any) => console.error('Tashriflar ma`lumotini yuklashda xatolik bo`ldi', error)
      });
    }, 1000);
  }

  formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

}
