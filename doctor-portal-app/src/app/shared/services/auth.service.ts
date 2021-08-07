import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AUTHLOGIN } from '../APIs/API';
import { UserAuth } from '../models/userAuth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  userSignin(userObj: UserAuth): Observable<UserAuth> {
    return this.httpClient.post<UserAuth>(`${environment.BASE_URL}${AUTHLOGIN}`, userObj);
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
  }

  authService() {
    const user = sessionStorage.getItem('token');
    return !(user === null);
  }

  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
 }

}
