import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  [x: string]: any;
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);


  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((data) => this.olympics$.next(data)),
      catchError((error) => {
        console.error(error);
        this.olympics$.next(null);
        return [];
      })
    );
  }
  
  

  getOlympics() {
    return this.olympics$.asObservable();
  }
}
