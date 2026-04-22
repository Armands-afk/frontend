import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UserLoginModel } from '../user-login/user-login-model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
// Atbild par visiem HTTP pieprasījumiem, kas saistīti ar reģistrāciju un pieslēgšanos. 
export class UserRegService {
  http = inject(HttpClient); 

  baseUrl: string = environment.api.baseUrl;

  //POST /api/v1/saveuser
  public saveUser(userLogin: UserLoginModel): Observable<HttpResponse<number>> {
    return this.http.post<number>(`${this.baseUrl}/api/v1/saveuser`, userLogin, {
      observe: 'response',
    });
  }

  //GET /api/v1/checkemail/{email}
  public checkEmailExists(email: string): Observable<HttpResponse<boolean>> {
    return this.http.get<boolean>(`${this.baseUrl}/api/v1/checkemail/${encodeURIComponent(email)}`, {
      observe: 'response',
    });
  }

  //POST /api/v1/signin
  public signInUser(userLogin: UserLoginModel): Observable<HttpResponse<number>> {
    return this.http.post<number>(`${this.baseUrl}/api/v1/signin`, userLogin, {
      observe: 'response',
    });
  }


}