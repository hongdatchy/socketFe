import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from './WebSocketService';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  
  username : string = ""
  receiver : string = ""
  isStartChat = false
  items: any[] = []

  name: string;

  
  constructor(private service: AppService, private webSocketService: WebSocketService){}

  ngOnInit() {
    this.webSocketService.messageSubject.subscribe(message=>{
      this.items.push(message)
    })
    this.webSocketService.connectedSubject.subscribe(message =>{
      this.connected = message
    })
  }

  connected = false

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  startChat(){
    this.isStartChat = true
    this.connect(this.username)
  }

  chat(event: any){
    // this.items.push(event.target.value)
    this.sendMessage(event.target.value)
  }

  connect(username: string){
    this.webSocketService._connect(username);
  }

  disconnect(){
    this.webSocketService._disconnect();
  }

  sendMessage = (msgText) => {
    this.webSocketService._send(msgText, this.receiver)
  }

}
