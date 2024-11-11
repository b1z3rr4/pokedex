import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateManagerService {
  private states: Map<string, BehaviorSubject<unknown>> = new Map();

  constructor() {}

  getState<T>(key: string, defaultValue: T): Observable<T> {
    if (!this.states.has(key)) {
      const state = new BehaviorSubject<unknown>(defaultValue);

      this.states.set(key, state);
    }

    return this.states.get(key)!.asObservable() as Observable<T>;
  }

  setState<T>(key: string, value: T): void {
    if (!this.states.has(key)) {
      const state = new BehaviorSubject<unknown>(value);

      this.states.set(key, state);
    } else {
      this.states.get(key)!.next(value);
    }
  }

  getCurrentState<T>(key: string, defaultValue: T): T {
    const subject = this.states.get(key);

    if (!subject) {
      return defaultValue;
    }

    return subject.getValue() as T;
  }
}
