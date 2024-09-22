import { Injectable } from "@angular/core";
import { AuthService } from "./AuthService";
import { environment } from "src/environments/environment";
import { Expense } from "../models/expense";
import { HttpParams } from "@angular/common/http";

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
  saveExpense(todaysExpense: Expense) {
    return this.http.post(this.url + `/expenses`, {
      headers: this.getHeaders(),
      todaysExpense
    });
  }

  getExpense(monthYear: string, all: string) {
    let params = new HttpParams().set('all', (all === 'all').toString());
    if(all !== 'all'){
      const monthYearArr = (monthYear != undefined && monthYear.length > 5) ? monthYear?.split(',') : [];
      if(monthYearArr?.length === 2){
        params = params.set('month', monthYearArr[0].toString());
        params = params.set('ýear', monthYearArr[1].toString());
      }
    }
    return this.http.get(this.url + `/expenses`, {
      headers: this.getHeaders(),
      params: params,
    });
  }
}
