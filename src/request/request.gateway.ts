import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway()
export class RequestGateway {
  @WebSocketServer() server;
}
