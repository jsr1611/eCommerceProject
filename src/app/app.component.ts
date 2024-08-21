import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { UserService } from './services/UserService';
import { Visit } from './models/visit';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Arabic Course';
  dailyVisitData!: Visit;
  dailyVisitCount: number = 0;
  
  constructor(
    private userService: UserService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let localCount = localStorage.getItem("uniqueVisitors");
    if(localCount && Number(localCount) > this.dailyVisitCount){
      this.dailyVisitCount = Number(localCount);
    }
    this.userService.recordVisit().subscribe({
      next: response => console.log('Tashrif muvaffaqiyatli qayd etildi. Tashrifingiz uchun rahmat!'),
      error: error => console.error('Tashrif qayd etishda xatolik bo`ldi', error)
    });

    this.userService.getVisitsCount().subscribe({
      next: (visitData: Visit) => {
        this.dailyVisitData = visitData;
        if(visitData.uniqueVisitors > this.dailyVisitCount){
          this.dailyVisitCount = visitData.uniqueVisitors;
          this.cdRef.detectChanges();
        }
        localStorage.setItem("uniqueVisitors", `${this.dailyVisitCount}`)
      },
      error: (error: any) => console.error('Tashriflar ma`lumotini yuklashda xatolik bo`ldi', error)
    });
  }
}
