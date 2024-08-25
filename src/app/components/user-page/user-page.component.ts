import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/AuthService';


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  profileImage: string | ArrayBuffer | null = null;
  protected user: User = {
    username: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    is_activated: false,
    is_superuser: false,
  }
  selectedFile: File | null = null;
  maxSizeInMB = 2;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    // Fetch user profile data from the backend if needed
    // This is just a placeholder
    try{
    this.authService.getUserProfile().subscribe({
      next: (data: any) => {
        this.user = data.user;
        console.log("Data retrieved: ", data.user);
        // Convert the stored binary data to a displayable format
        if (this.user.profilePicture) {
          this.profileImage = 'data:image/jpeg;base64,' + this.user.profilePicture;
        }
        
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error fetching user profile', (err.error ? err.error.message : err.message));
        if(err.status === 401){
          localStorage.removeItem('token');
        }
        }
    });   
  }catch(err){
    console.error(err);
  }
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

    if (this.selectedFile && this.selectedFile.size > maxSizeInBytes) {
      alert(`File is too large. Maximum allowed size is ${this.maxSizeInMB} MB.`);
      this.selectedFile = null; // Clear the selected file
      return;
    }

      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;  // For image preview
      };
      reader.readAsDataURL(this.selectedFile);
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
