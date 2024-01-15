import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  baseURL = 'http://localhost:8081/api/'
  constructor(private http: HttpClient) { }

  sendMessage(receiver: string, text: string): Observable<string> {
    let msg = {
        receiver: receiver,
        content: text
    }
    // return this.http.post<any>(this.baseURL + "nextStep", msg, { responseType :'text'})
    return this.http.post(this.baseURL + 'nextStep', msg, { responseType: 'text', withCredentials:true });
  }
}
