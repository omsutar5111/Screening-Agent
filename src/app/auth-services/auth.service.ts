import { Injectable, isDevMode } from '@angular/core';

const users = [
  { username: 'admin', password: 'admin1234' },
  { username: 'user', password: 'user456' },
];

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

  constructor() {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    }
  }


  login(username: string, password: string): boolean {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      this.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAuthenticated', 'true');
      }
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticated = false;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
    }
  }

  isLoggedIn(): boolean {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      return this.isAuthenticated || localStorage.getItem('isAuthenticated') === 'true';
    } else {
      // For non-browser environments, just return the in-memory state
      return this.isAuthenticated;
    }
  }

  
}