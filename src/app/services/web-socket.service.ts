/**
 * @author Jose Daniel Bermudez Salamanca
 */
//importaciones necesarias
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
//servicio para emitir y escuchar eventos
export class WebSocketService {
  //atributo con el estado de la conexión con la base de datos
  public socketStatus = false;


  constructor(
    //inicializacion del socket
    private socket: Socket
  ) {
    //llamamos a la función para validar el estatus de la conexion
    this.checkStatus();
  }
  //funcion para validar el estatus de la conexion
  checkStatus() {
    //escuchar el evento de conexion
    this.socket.on('connect', () => {
      console.log('Conectado con el servidor');
      this.socketStatus = true;
    });
    //escuchar el evento de desconexion
    this.socket.on('disconnect', () => {
      console.log('desconectado con el servidor');
      this.socketStatus = true;
    })
  }
  /**
   * emitir eventos
   * funcion propia 
   * emit('evento',payload,callback)
   * socket 
   * this.socket.emit(evento,payload,callback);
   * si emitimos un evento en el cliente se debe crear una funcion en el 
   * back para escucharlo
   */
  //funcion para emitir eventos
  emit(evento: string, payload?: any, callback?: Function) {
    this.socket.emit(evento, payload, callback);
  }
  //funcion para escuchar eventos
  listen( evento:string){
    return this.socket.fromEvent(evento);
  }

}
