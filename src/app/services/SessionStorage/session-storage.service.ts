import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }
  setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  getItem(key: string): any {
    const data = sessionStorage.getItem(key)
    if (data !== null) {
      return JSON.parse(data)
    }
  }
  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }
}
