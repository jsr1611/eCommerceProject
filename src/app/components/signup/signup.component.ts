import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/AuthService';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  
  protected user: User = {
    username: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
  }
 
  errorMessage: string = '';

  constructor(private authService: AuthService, @Inject(Router) private router: Router) {}

  signup(): void {
    console.log("user : ", this.user);
    
    if (this.user.username === '') return;
    this.authService.signup(this.user).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = `${err.error ? err.error.message : err.message}`;
      },
    });
  }
}