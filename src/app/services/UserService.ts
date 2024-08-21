import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Visit } from '../models/visit';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    apiUrl = environment.baseUrl + "/api/users/warm-up";
    visitsApiUrl = environment.baseUrl + "/api/visits";

    constructor(private http: HttpClient) {
        this.startWarmup();
    }

    startWarmup() {
        const interval = 15 * 60 * 1000; // 15 minutes in milliseconds
        console.log("warm up call method initialized...");
        setInterval(() => {
            console.log("warm up call to backend...");
            this.http.get(this.apiUrl).subscribe(
                response => console.log('Backend warmed up successfully', response),
                error => console.error('Failed to warm up backend', error)
            );
        }, interval);
    }

    recordVisit(): Observable<any>{
        return this.http.post(this.visitsApiUrl, {});
    }

    getVisitsCount(): Observable<any>{
        return this.http.get(this.visitsApiUrl);
    }
}
