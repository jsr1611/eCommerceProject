import { AfterViewInit, Component } from "@angular/core";
import { SecureService } from "src/app/services/SercureService";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables)
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements AfterViewInit {
  numWeeks: number = 2;
  visitData: any[] = [];
  visitsByCountry: { [key: string]: number } = {};
  visitsOverTime: { [key: string]: number } = {};
  visitsOverTime2: { [key: string]: number } = {};
  visitsOverTimeColor: { [key: string]: string } = {};
  deviceInfo: { [key: string]: number } = {};

  constructor(private secureService: SecureService) {}

  ngAfterViewInit() {
    this.fetchVisitData();
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
