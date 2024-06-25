import { Component } from '@angular/core';
import { env } from '../../env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserDetails } from '../models/DTO';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private apiUrl = env.apiUrl;

  UserDetails: UserDetails = new UserDetails();
  username: string = '';
  headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );
  editMode : boolean = false;
  formData: any = {};
  

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    if (localStorage.getItem('token') == null) {
      window.location.href = '/login';
    }
    this.route.paramMap.subscribe((params) => {
      this.username = params.get('username') || '';
    });
    this.fetchData();
  }

  ngAfterViewInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get<UserDetails>(`${this.apiUrl}/user`, { headers: this.headers }).subscribe((data) => {
      this.UserDetails = data;
      console.log(this.UserDetails);
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  saveData() {
    console.log(this.formData);
    const data = {
      username: this.formData.username || this.UserDetails.username,
      password: this.UserDetails.password,
      description: this.formData.description || this.UserDetails.description,
      twitterhandle: this.formData.twitterhandle || this.UserDetails.twitterhandle,
      linkedinhandle: this.formData.linkedinhandle || this.UserDetails.linkedinhandle,
      githubhandle: this.formData.githubhandle || this.UserDetails.githubhandle,
    };
    this.http.put(`${this.apiUrl}/user`, data, { headers: this.headers }).subscribe((data) => {
      window.location.reload();
      console.log(data);
    });
  }
}
