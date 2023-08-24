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
}
