import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore) { }

  crearUsuario(nombre: string, email: string, pass: string){
    this.afAuth.auth.createUserWithEmailAndPassword(email, pass)
    .then( resp => {
      //console.log(resp);
      let user: any = {
        nombre: nombre,
        email: email,
        uid: resp.user.uid
      }
      this.afDB.doc(`${user.uid}/usuario`)
      .set(user)
      .then( () => {
        this.router.navigate(['/']);
      })
    })
    .catch( error => {
      //console.error(error.message);
      Swal.fire('Error!', error.message, 'error');
    })
  }

  login(email: string, pass: string){
    this.afAuth.auth.signInWithEmailAndPassword(email, pass)
    .then( resp => {
      //console.log(resp);
      this.router.navigate(['/']);
    })
    .catch( error => {
      //console.error(error.message);
      Swal.fire('Error!', error.message, 'error');
    })
  }

  logout(){
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  initAuthListener(){
    this.afAuth.authState.subscribe( (fbUser: firebase.User) => {
      console.log(fbUser);
    })
  }

  isAuth(){
    return this.afAuth.authState.pipe(map( fbUser => {

      if(fbUser == null){
        this.router.navigate(['/login']);
      }

      return fbUser != null;
    }));
  }

}
