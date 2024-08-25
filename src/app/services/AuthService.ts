import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseUrl + "/api/auth"; 

  constructor(private http: HttpClient) {}

  uploadPicture(fromData: FormData) {
    return this.http.post(this.baseUrl + '/profile/upload-picture', fromData);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/signin`, { username, password });
  }

  signup(user: User): Observable<any> {
    console.log("user info sent: ", user);
    
    return this.http.post(`${this.baseUrl}/signup`, { user });
  }

  getUserProfile(): Observable<User>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    return this.http.get<User>(`${this.baseUrl}/profile`, { headers});
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  // Optionally, add a method to store and retrieve the JWT token
  setToken(token: string): void {
    console.log("Setting token to local storage...");
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    console.log("Getting token from local storage..");
    
    return localStorage.getItem('token');
  }

  logout(): void {
    try{
        localStorage.removeItem('token');
        console.log("logged out successfully");
    }catch(err){
        console.error("Error logging out: ", err);
    }
  }
}
