import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { env } from '../../env';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  formData: any = {};
  password2: string = '';
  private apiUrl = env.apiUrl;

  constructor(private http: HttpClient) {}

  Register() {
    if (this.formData.password !== this.password2) {
      alert('Passwords do not match');
      return;
    }

    this.http.post<any>(`${this.apiUrl}/register`, this.formData).subscribe(
      (response) => {
        alert('Registered successfully');
        window.location.href = '/login';
      },
      (error) => {
        alert('Error registering');
      }
    );
  }
}
