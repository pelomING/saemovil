import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {

  private eventosaeSelectedSource = new Subject<number>();

  eventosaeSelected$ = this.eventosaeSelectedSource.asObservable();

  selectEventosae(eventosaeId: number) {
    this.eventosaeSelectedSource.next(eventosaeId);
  }

  private updateListSource = new Subject<void>();
  updateList$ = this.updateListSource.asObservable();
  triggerUpdateList() {
    this.updateListSource.next();
  }


  private updatecargarEventos = new Subject<void>();
  updateCargarEventos$ = this.updatecargarEventos.asObservable();
  triggerUpdateCargarEventos() {
    this.updatecargarEventos.next();
  }

  
  private updatecargarTurno = new Subject<void>();
  updateCargarTurno$ = this.updatecargarTurno.asObservable();
  triggerUpdateCargarTurno() {
    this.updatecargarTurno.next();
  }


}
