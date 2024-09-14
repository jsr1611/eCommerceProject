import { Injectable } from "@angular/core";
import { AuthService } from "./AuthService";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SecureService extends AuthService {
  private url = environment.baseUrl + "/api";

  getVisits(weeks: number | null) {
    return this.http.get(this.url + `/visits/data/${weeks}`, {
      headers: this.getHeaders(),
    });
  }
}
