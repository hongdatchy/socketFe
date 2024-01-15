import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
providedIn: 'root'
})
export class WebSocketService {
    webSocketEndPoint: string = 'http://localhost:8081/ws-chat/';
    // webSocketEndPoint: string = 'http://localhost:8080/ws-chat/';
    destination: string = "/user/queue/messages";
    // destination: string = "/queue/messages";

    private stompClient: Stomp.Client = null;
    // private sessionId

    messageSubject :  Subject<any> = new Subject<any>();
    connectedSubject: Subject<any> = new Subject<any>();

    constructor() {
        window['webSocketService'] = this;
    }
    
    private disconnectCallBack(username): void {
        this.connectedSubject.next(false);
        setTimeout(() => {
            this._connect(username);
        }, 3000);
    }
    
    _connect(username: string) {
        if(this.stompClient == null){
            let ws = new SockJS(this.webSocketEndPoint)
        
            this.stompClient = Stomp.over(ws)
            // this.stompClient.debug = null
            const _this = this
            this.stompClient.connect(
                {username: username}, 
                function (frame) {
                    // _this.sessionId = /\/([^\/]+)\/websocket/.exec(ws._transport.url)[1]
                    _this.connectedSubject.next(true);
                    _this.stompClient.subscribe(_this.destination, function (sdkEvent: any) {
                        _this.messageSubject.next(JSON.parse(sdkEvent.body))
                    }, {});
                }, 
                function() {
                    _this.disconnectCallBack(username);
                }
            )
        }
    };

    

    _disconnect() {
        if (this.stompClient !== null) {
        this.stompClient.disconnect(()=>{
            this.connectedSubject.next(false);
            this.stompClient = null
        });
        }
    }

    _send(message, receiver) {
        let msg = {
            receiver: receiver,
            content: message
        }
        this.stompClient.send("/app/hello", {}, JSON.stringify(msg));
    }

}