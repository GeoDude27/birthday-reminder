import { Component } from '@angular/core';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'birthday-reminder';

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
