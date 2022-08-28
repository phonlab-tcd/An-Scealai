import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SingletonService {
  age = new BehaviorSubject<"under16"|"over16">(undefined);
}
