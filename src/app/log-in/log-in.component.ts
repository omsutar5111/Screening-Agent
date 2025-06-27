import { Component } from '@angular/core';
import { AuthService } from '../auth-services/auth.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';
  constructor(private authService:AuthService,private router:Router){

  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/hr-agent']); // Redirect to analysis page after login
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}
