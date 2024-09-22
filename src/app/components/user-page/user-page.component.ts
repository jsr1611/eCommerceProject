import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { AuthService } from "src/app/services/AuthService";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { expense } from "src/app/models/expense";
import { Chart } from "chart.js";

@Component({
  selector: "app-user-page",
  templateUrl: "./user-page.component.html",
  styleUrls: ["./user-page.component.css"],
})
export class UserPageComponent implements OnInit {
  protected user: User = {
    username: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    is_activated: false,
    is_superuser: false,
  };
  currentMonth!: string;
  selectedMonth!: string;
  expenses: expense[] = [];
  monthlyTotal = 0;

  // Sample data for monthly expenses
  monthlyExpenses = [
    { month: 'January', total: 450 },
    { month: 'February', total: 380 },
    { month: 'March', total: 560 },
    { month: 'April', total: 420 },
    { month: 'May', total: 510 },
    { month: 'June', total: 470 },
    { month: 'July', total: 490 },
    { month: 'August', total: 430 },
    { month: 'September', total: 520 },
    { month: 'October', total: 600 },
    { month: 'November', total: 540 },
    { month: 'December', total: 580 }
  ];

  public expenseChart: any;

  protected token: string | null = null;
  selectedFile: File | null = null;
  maxSizeInMB = 2;

  constructor(
    private authService: AuthService,
    @Inject(Router) private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.currentMonth = this.datePipe.transform(new Date(), "yyyy-MM")!;
    this.selectedMonth = this.datePipe.transform(new Date(), "MMMM yyyy")!;
    this.viewExpenses(); // Load expenses for the current month by default
    this.token = this.authService.getToken();
    try {
      this.authService.getUserProfile('one').subscribe({
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
    this.createChart();
  }

  createChart() {
    const ctx = document.getElementById('expenseChart') as HTMLCanvasElement;
    this.expenseChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.monthlyExpenses.map(expense => expense.month),
        datasets: [
          {
            label: 'Total Expenses (KRW)',
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

  

  onMonthChange(event: any): void {
    const selectedDate = new Date(event.target.value);
    this.selectedMonth = this.datePipe.transform(selectedDate, "MMMM yyyy")!;
    this.viewExpenses();
  }

  viewExpenses(): void {
    // Logic to fetch and display expenses for the selected month
    // Update this.expenses and this.monthlyTotal based on the selected month
  }

  addExpense(): void {
    // Logic to add a new expense
    // Recalculate monthlyTotal and update expenses list
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
