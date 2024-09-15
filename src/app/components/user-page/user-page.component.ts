import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/AuthService';

import { DatePipe } from '@angular/common';


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
  protected users!: User[];
  protected token: string | null = null;
  selectedFile: File | null = null;
  maxSizeInMB = 2;

  constructor(private http: HttpClient, 
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.token = this.authService.getToken();
    try {
      this.authService.getUserProfile().subscribe({
        next: (data: any) => {
          this.user = data.user;
          this.users = data.users;
        },
        error: (err: HttpErrorResponse) => {
          console.log('Error fetching user profile', (err.error ? err.error.message : err.message));
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

  changeStatus(_t46: number,arg1: string|undefined,arg2: boolean|undefined) {
    alert('Not implemented yet');
  }

  displayDate(data: string|undefined) {
    return data && new Date(data);
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
        alert(`File is too large. Maximum allowed size is ${this.maxSizeInMB} MB.`);
        this.selectedFile = null; // Clear the selected file
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.user.profilePicture = (reader.result as string).split(',')[1];
      };
      reader.readAsDataURL(this.selectedFile);
      this.uploadProfilePicture();
    }
  }


  uploadProfilePicture(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('profilePicture', this.selectedFile);

      this.authService.uploadPicture(formData).subscribe({
        next: (response: any) => {
          // Handle success
          console.log('Profile picture uploaded successfully');
          console.log(response);
        },
        error: (error: any) => {
          console.error('Error uploading profile picture:', error);
        }
      });
    }
  }

}
