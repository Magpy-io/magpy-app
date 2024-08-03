import { EventArg, EventEmitter } from '@react-navigation/native';
import dgram from 'react-native-udp';
import UdpSocket from 'react-native-udp/lib/types/UdpSocket';
import { isIP, isPort } from 'validator';

import { serverDiscoveryPort } from '~/Config/config';

import { sleep } from './Utilities';

export type DiscoveryResponse = {
  domain: 'magpy-discovery';
  type: 'response';
  name: string;
  ip: string;
  port: string;
};

export type DiscoveryRequest = {
  domain: 'magpy-discovery';
  type: 'request';
};

export type Server = {
  name: string;
  ip: string;
  port: string;
};

const PORT_MIN = 49152;
const PORT_MAX = 65535;

export class ServerDiscovery {
  socket: UdpSocket | null;
  state: 'starting' | 'listening' | 'stopped';

  constructor() {
    this.socket = null;
    this.state = 'stopped';
  }

  async launchDiscovery(onServerDiscovered: (response: Server) => void) {
    console.log('Discovery started');

    if (this.state != 'stopped') {
      console.log('Discovery already running');
      throw new Error('Cannot start new discovery while a discovery is still running.');
    }

    this.state = 'starting';

    try {
      this.socket = dgram.createSocket({ type: 'udp4' });

      this.socket.on('error', e => console.log('ServerDiscovery error:', e));

      this.setOnServerDiscovered(onServerDiscovered);

      await this.bindSocket();

      console.log('Discovery socket binded, listening started');
      if (!this.socket) {
        console.log('Discovery listening aborted');
        return;
      }

      const address = this.socket.address();
      console.log('Discovery UDP socket listening on ' + address.address + ':' + address.port);

      // Should call setBroadcast on socket but I'm not doing it because I'm using a forked version
      // of the react-native-udp package and changed it to setBroadcast by default on socket bind
      // This change was made because of a bug in the package regarding setBroadcast
      // https://github.com/tradle/react-native-udp/issues/82

      //this.socket.setBroadcast(true);

      await this.sendMessage();
    } catch (e) {
      this.socket?.close();
      this.socket = null;
      this.state = 'stopped';
    }

    this.state = 'listening';
  }

  stop() {
    console.log('Discovery stop Called');
    if (this.state == 'starting') {
      console.log('Discovery is stating up, cannot stop yet');
      throw new Error('Cannot stop discovery while starting up discovery.');
    }

    if (this.state == 'stopped') {
      return;
    }

    this.socket?.close();
    this.socket = null;
    this.state = 'stopped';
  }

  private async sendMessage() {
    const request: DiscoveryRequest = { domain: 'magpy-discovery', type: 'request' };
    const message = JSON.stringify(request);

    return new Promise(res => {
      this.socket?.send(
        message,
        0,
        message.length,
        serverDiscoveryPort,
        '255.255.255.255',
        () => {
          res(null);
        },
      );
    });
  }

  private async bindSocket() {
    return new Promise(res => {
      const randomPort = Math.floor(Math.random() * (PORT_MAX - PORT_MIN) + PORT_MIN);
      this.socket?.bind(randomPort, () => {
        res(null);
      });
    });
  }

  private setOnServerDiscovered(fun: (response: Server) => void) {
    if (this.socket != null) {
      this.socket.removeAllListeners('message');
      this.socket.on(
        'message',
        (message: Buffer, remote: { address: string; port: string }) => {
          console.log(
            'Discovery response received from :',
            remote.address,
            '. Message: ',
            message.toString(),
          );

          let response: DiscoveryResponse;
          try {
            response = JSON.parse(message.toString()) as DiscoveryResponse;
          } catch (e) {
            console.log('Invalid discovery response.');
            return;
          }

          if (response.domain != 'magpy-discovery' || response.type != 'response') {
            console.log('Invalid discovery response.');
            return;
          }

          if (
            !isIP(response.ip) ||
            !isPort(response.port) ||
            !(typeof response.name === 'string')
          ) {
            console.log('Invalid discovery response.');
            return;
          }

          const remoteIp = remote.address;

          if (remoteIp != response.ip) {
            console.log(
              'Discovery message, response IP is different than response socket ip.',
            );
          }

          fun({ name: response.name, ip: remoteIp, port: response.port });
        },
      );
    }
  }
}
