import { AfterViewInit, Component, OnInit } from "@angular/core";
import { SecureService } from "src/app/services/SercureService";
import { Chart, registerables } from "chart.js";
import { User } from "src/app/models/user";
import { AuthService } from "src/app/services/AuthService";
import { HttpErrorResponse } from "@angular/common/http";
Chart.register(...registerables)
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  numWeeks: number = 2;
  visitData: any[] = [];
  visitsByCountry: { [key: string]: number } = {};
  visitsOverTime: { [key: string]: number } = {};
  visitsOverTime2: { [key: string]: number } = {};
  visitsOverTimeColor: { [key: string]: string } = {};
  deviceInfo: { [key: string]: number } = {};

  protected users!: User[];
  protected token: string | null = null;

  constructor(
    private authService: AuthService,
    private secureService: SecureService
  ) {}

  ngAfterViewInit() {
    this.fetchVisitData();
  }

  changeStatus(_t46: number, arg1: string|undefined, arg2: boolean|undefined) {
    alert('Not implemented yet');
  }

  convertImage(img: any) {
    return img && btoa(String.fromCharCode(...new Uint8Array(img)));
  }

  displayDate(data: string|undefined) {
    return data && new Date(data);
  }

  ngOnInit(): void {
    this.token = this.authService.getToken();
    try {
      this.authService.getUserProfile().subscribe({
        next: (data: any) => {
          this.users = data.users;
        },
        error: (err: HttpErrorResponse) => {
          console.log('Error fetching user profile', (err.error ? err.error.message : err.message));
          if (err.status === 401) {
            localStorage.removeItem('token');
            // this.router.navigate(['/login']);
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async fetchVisitData() {
    this.secureService.getVisits(this.numWeeks)
      .subscribe((data) => {
        this.visitData = Array.isArray(data) ? data : [data];
        this.processData();
      });
  }

  getRandomInt(min: number, max:number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return "#" + Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }

  processData() {
    const countryCounts: { [key: string]: number } = {};
    const deviceCounts: { [key: string]: number } = {};
    this.visitsOverTime = {};
    
    this.visitData.forEach(day => {
      const date = new Date(day.date).toLocaleDateString();
      
      let rand = this.getRandomInt(0, 999);

      if (!this.visitsOverTime[date]) {
        this.visitsOverTime[date] = 0;
        this.visitsOverTime2[date] = 0;
        this.visitsOverTimeColor[date] = rand;
      }

      this.visitsOverTime[date] += day.count;
      this.visitsOverTime2[date] += new Set(day.uniqueVisitors).size;
      day.visits.forEach((visit: { location: { country: string; }; device: { type: string; }; }) => {
        const country = visit.location.country || 'Unknown';
        countryCounts[country] = (countryCounts[country] || 0) + 1;
        const device = visit.device.type || 'Unknown';
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });
    });

    this.visitsByCountry = countryCounts;    
    this.deviceInfo = deviceCounts;
    this.drawCharts();
  }

  drawCharts() {
    this.drawPieChart('pieChart1', this.visitsByCountry, 'Visits by Country');
    this.drawBarChart('barChart1', this.visitsOverTime, 'Total Visits Over Time');
    this.drawBarChart('barChart2', this.visitsOverTime2, 'Unique Visits Over Time');
    this.drawPieChart('deviceChart', this.deviceInfo, 'Device Information');
  }


  drawPieChart(element: string, data: any, title: string){
    const chart = new Chart(element, {
      type: 'pie',
      data:{
        labels: Object.keys(data),
        datasets: [
          {
            label: title,
            data: Object.values(data) ,
            backgroundColor: Object.values(this.visitsOverTimeColor),
          }
        ]
      }
    })
  }

  drawBarChart(element: string, data: { [key: string]: number }, title: string){
    const chart = new Chart(element, {
      type: 'bar',
      data:{
        labels: Object.keys(data),
        datasets: [
          {
            label: title,
            data: Object.values(data),
            backgroundColor:  Object.values(this.visitsOverTimeColor),
          }
        ]
      }
    })
  }

}
