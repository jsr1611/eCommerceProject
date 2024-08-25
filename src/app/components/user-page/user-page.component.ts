import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/AuthService';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  protected user: User = {
    username: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    is_activated: false,
    is_superuser: false,
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Fetch user profile data from the backend if needed
    // This is just a placeholder
    this.authService.getUserProfile().subscribe({
      next: (data: any) => {
        this.user = data.user;
        console.log("Data retrieved: ", data.user);
        
      },
      error: (err) => console.log('Error fetching user profile', err)
    });
  }
}
