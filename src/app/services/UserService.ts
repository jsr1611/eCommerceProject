import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    visitsApiUrl = environment.baseUrl + "/api/visits";

    constructor(private http: HttpClient) {}

    recordVisit(): Observable<any>{
        return this.http.post(this.visitsApiUrl, {});
    }

    getVisitsCount(): Observable<any>{
        return this.http.get(this.visitsApiUrl);
    }
}
