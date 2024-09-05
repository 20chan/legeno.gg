import { Server as NetServer, Socket } from 'net';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponse } from 'next';

declare module 'next' {
  export interface NextApiResponseIO extends NextApiResponse {
    socket: Socket & {
      server: NetServer & {
        io: ServerIO;
      }
    }
  }
}