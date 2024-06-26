import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [{ email: 'test@example.com', password: 'password123' }];

  constructor(private router: Router) {}

  register(email: string, password: string): void {
    this.users.push({ email, password });
    console.log(`User registered: email=${email}`);
  }

  login(email: string, password: string): boolean {
    console.log(`Attempting login with email: ${email}, password: ${password}`);
    const user = this.users.find(user => user.email === email && user.password === password);
    if (user) {
      console.log('Login successful');
      localStorage.setItem('authToken', 'my-secret-token');
      return true;
    }
    console.log('Login failed');
    return false;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('authToken') !== null;
  }
}
