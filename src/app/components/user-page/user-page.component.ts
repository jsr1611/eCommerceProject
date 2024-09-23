import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { User } from "src/app/models/user";
import { AuthService } from "src/app/services/AuthService";
import { DatePipe } from "@angular/common";
import { Expense } from "src/app/models/expense";
import { Chart } from "chart.js";
import { SecureService } from "src/app/services/SercureService";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import { MonthpickerDateAdapter } from "src/app/mappings/monthdatepicker-date-adapter";
import { Platform } from "@angular/cdk/platform";
import { Router } from "@angular/router";



@Component({
  selector: "app-user-page",
  templateUrl: "./user-page.component.html",
  styleUrls: ["./user-page.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MonthpickerDateAdapter,
      deps: [MAT_DATE_LOCALE, Platform],
    },
  ],
})
export class UserPageComponent implements OnInit, AfterViewInit {
  protected user: User = {
    username: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    is_activated: false,
    is_superuser: false,
  };
  protected expenseChart: any;
  protected token: string | null = null;
  @Input()
  protected monthAndYear: Date = new Date();
  @Output()
  protected monthAndYearChange = new EventEmitter<Date | null>();
  selectedFile: File | null = null;
  maxSizeInMB = 2;
  displayInput:boolean = false;
  selectedMonthStr!: string;
  selectedYear:number = new Date().getFullYear();
  today: Date = new Date();
  monthlyTotal = 0;
  protected readonly ONE: string = 'one';
  protected readonly ALL: string = 'all';
  todaysExpense: Expense = {
    date: new Date().toISOString().split('T')[0], // Set today's date
    category: '',
    amount: 0,
    description: ''
  };
  monthlyExpenses:{
    month: string,
    total: string,
  }[] = [];
  currentMonthExpenses: Expense[] = [];
  popularCurrencies = [
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'UZS', name: 'Uzbek Som', symbol: 'soʻm' },
    { code: 'KZT', name: 'Kazakh Tenge', symbol: '₸' },
    { code: 'TJS', name: 'Tajik Somoni', symbol: 'SM' }, 
    { code: 'KGS', name: 'Kyrgyz Som', symbol: 'с' }, 
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: 'ج.م' },
    { code: 'AED', name: 'United Arab Emirates Dirham', symbol: 'د.إ' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    // Add more currencies as needed
  ];

  selectedCurrency: string = 'KRW';

  constructor(
    private authService: AuthService,
    @Inject(Router) private router: Router,
    @Inject(DatePipe) private datePipe: DatePipe,
    private secureService: SecureService,
  ) { }

  ngAfterViewInit(): void {
    this.viewExpenses(this.ONE); 
    this.viewExpenses(this.ALL);
  }

  ngOnInit(): void {
    let savedCurrency = localStorage.getItem('currency');
    if(savedCurrency){
      this.selectedCurrency = savedCurrency;
    }
    this.selectedMonthStr = this.datePipe.transform(new Date(this.monthAndYear), "MMMM yyyy")!;    
    this.token = this.authService.getToken();
    try {
      this.authService.getUserProfile(this.ONE).subscribe({
        next: (data: any) => {
          this.user = data.user;
        },
        error: (err: HttpErrorResponse) => {
          console.log(
            "Error fetching user profile",
            err.error ? err.error.message : err.message
          );
          if (err.status === 401) {
            localStorage.removeItem("token");
            this.router.navigate(["/login"]);
          }
        },
      });
    } catch (err) {
      console.error(err);
    }
    // this.createChart();
  }

  onAmountChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9.-]+/g, ''); 
    this.todaysExpense.amount = value ? parseFloat(value) : 0; 
  }

  onCurrencyChange(currencyCode: string){
    localStorage.setItem('currency', currencyCode);
    if(this.expenseChart && this.expenseChart.data && this.expenseChart.data.datasets){
      const dataset = this.expenseChart.data.datasets[0];
      dataset.label = `Total monthly expenses for ${this.selectedYear} in ${this.selectedCurrency}`; 
      this.expenseChart.update();
    }
  }

  calculateMonthlyTotal(){
    this.monthlyTotal = 0;
    this.currentMonthExpenses.map(item => {
      this.monthlyTotal += item.amount;
  });
  }


  createChart() {
    if (this.expenseChart) {
      this.expenseChart.destroy();
    }
    const ctx = document.getElementById('expenseChart') as HTMLCanvasElement;
    this.expenseChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.monthlyExpenses.map(expense => expense.month),
        datasets: [
          {
            label: `Total monthly expenses for ${this.selectedYear} in ${this.selectedCurrency}`,
            data: this.monthlyExpenses.map(expense => expense.total),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  public emitDateChange(event: MatDatepickerInputEvent<Date | null, unknown>): void {
    this.monthAndYearChange.emit(event.value);
  }
  public monthChanged(value: any, widget: any): void {
    this.monthAndYear = value;
    this.selectedYear = value.getFullYear();
    let currentYear = new Date().getFullYear()

    this.selectedMonthStr = this.datePipe.transform(new Date(value), "MMMM yyyy")!;
    this.viewExpenses(this.ONE);
    if(currentYear !== this.selectedYear){
      this.viewExpenses(this.ALL);
    }
    widget.close();
  }
  
  viewExpenses(all: string): void {
    try {
      const monthYearStr = `${this.monthAndYear.getMonth()},${this.monthAndYear.getFullYear()}`;
      this.secureService.getExpense(monthYearStr, all).subscribe({
        next: (data: any) => {
          if(all === 'all'){
            this.monthlyExpenses = data.expenses;
            this.createChart();
          }else{
            this.currentMonthExpenses = data.expenses;
            this.calculateMonthlyTotal();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log('Error fetching expense data', (err.error ? err.error.message : err.message));
          if (err.status === 401) {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
  showAddNewExpense(){
    this.displayInput = !this.displayInput;
  }

  addExpense(): void {
    this.secureService.saveExpense(this.todaysExpense).subscribe({
      next: (response: any) => {
        // Handle success
        console.log("Expense saved successfully");
        console.log(response);
        this.currentMonthExpenses.push(this.todaysExpense);
        this.monthlyTotal += this.todaysExpense.amount;
      },
      error: (error: any) => {
        console.error("Error saving expense data:", error);
      },
    });
  }

  convertImage(img: any) {
    return img && btoa(String.fromCharCode(...new Uint8Array(img)));
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      // Convert the max size from MB to bytes
      const maxSizeInBytes = this.maxSizeInMB * 1024 * 1024;

      if (this.selectedFile.size > maxSizeInBytes) {
        alert(
          `File is too large. Maximum allowed size is ${this.maxSizeInMB} MB.`
        );
        this.selectedFile = null; // Clear the selected file
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.user.profilePicture = (reader.result as string).split(",")[1];
      };
      reader.readAsDataURL(this.selectedFile);
      this.uploadProfilePicture();
    }
  }

  uploadProfilePicture(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append("profilePicture", this.selectedFile);

      this.authService.uploadPicture(formData).subscribe({
        next: (response: any) => {
          // Handle success
          console.log("Profile picture uploaded successfully");
          console.log(response);
        },
        error: (error: any) => {
          console.error("Error uploading profile picture:", error);
        },
      });
    }
  }
}
