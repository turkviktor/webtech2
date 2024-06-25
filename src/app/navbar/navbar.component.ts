import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  user: string | null = localStorage.getItem('token');

  Logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  Chat() {
    window.location.href = '/';
  }

  Profile() {
    window.location.href = '/profile';
  }

}
