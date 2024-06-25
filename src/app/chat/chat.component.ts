import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserDetails } from '../models/DTO';
import { env } from '../../env';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  UserDetails: UserDetails = new UserDetails();

  message: { user: string | undefined, message: string } = { user: this.UserDetails.username, message: '' };
  messages: { user: string, message: string }[] = [];

  apiUrl = env.apiUrl;

  userCount!: Number;
  headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token')}`
  );

  
  
  constructor(private chatService: ChatService, private http: HttpClient) { }

  ngOnInit() {
    if (localStorage.getItem('token') == null) {
      window.location.href = '/login';
    };
    this.fetchData();
    this.chatService.getMessages().subscribe((message: { user: string, message: string }) => {
      this.messages.push(message);
    });
    this.chatService.getUserCount().subscribe((userCount: Number) => {
      this.userCount = userCount;
    });
  }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message.message = '';
  }

  fetchData() {
    this.http.get<UserDetails>(`${this.apiUrl}/user`, { headers: this.headers }).subscribe((data) => {
      this.UserDetails = data;
      this.message.user = this.UserDetails.username;
      console.log(this.UserDetails);
    });
  }


}
