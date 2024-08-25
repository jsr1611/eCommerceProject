import { Component } from '@angular/core';
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
  
  // firstname:string = '';
  // lastname:string = '';
  // username: string = '';
  // email: string = '';
  // password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signup(): void {
    console.log("user : ", this.user);
    
    if (this.user.username === '') return;
    this.authService.signup(this.user).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.errorMessage = 'Failed to sign up';
      },
    });
  }
}