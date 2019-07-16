import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private afDB: AngularFirestore, private authService: AuthService) { }

  crearIngresoEgreso(IngresoEgreso: IngresoEgreso){
    return this.afDB.doc(`${this.authService.getUsuario().uid}/ingreso-egresos`)
    .collection('items').add({ ...IngresoEgreso });
  }

}
