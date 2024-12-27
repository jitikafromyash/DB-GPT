import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiservicesService {
  private apiUrl = 'http://localhost:5000/api/chat'; // Ensure correct API endpoint

  constructor(private http: HttpClient) {}

  sendQuery(query: string, model: string, index: string): Observable<any> {
    return this.http.post(this.apiUrl, { query, model, index }).pipe(
      catchError(this.handleError) // Handle errors
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
