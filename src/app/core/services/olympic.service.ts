import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { map, filter } from 'rxjs/operators';
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
  
  getOlympicById(id: number): Observable<Olympic | undefined> {
    return this.getOlympics().pipe(
      filter((olympics): olympics is Olympic[] => Array.isArray(olympics)),
      map((olympics) => olympics.find((country) => country.id === id))
    );
  }
  
}
