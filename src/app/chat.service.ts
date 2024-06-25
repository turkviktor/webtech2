import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { env } from '../env';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket = io(env.apiUrl);

  sendMessage(message: { user: string | undefined, message: string }){
    this.socket.emit('new-message', message);
  }

  sendUsername(message: string | undefined){
    this.socket.emit('send-username', message);
  }
  sendUsernameDelete(message: string | undefined){
    this.socket.emit('send-username-delete', message);
  }

  getMessages() {
    let observable = new Observable<{ user: string, message: string }>(observer => {
      this.socket.on('new-message', (data) => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };  
    });
    return observable;
  }

  getUserCount() {
    let observable = new Observable<Number>(observer => {
      this.socket.on('user-count', (data) => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };  
    });
    return observable;
  }
}
