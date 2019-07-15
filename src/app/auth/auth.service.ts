import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.accions';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription = new Subscription();

  constructor(private afAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore, private store: Store<AppState>
    ) { }

  crearUsuario(nombre: string, email: string, pass: string){
    //
    this.store.dispatch(new ActivarLoadingAction());
    //
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
        //
        this.store.dispatch(new DesactivarLoadingAction());
        //
        this.router.navigate(['/']);
      })
    })
    .catch( error => {
      //console.error(error.message);
      //
      this.store.dispatch(new DesactivarLoadingAction());
      //
      Swal.fire('Error!', error.message, 'error');
    })
  }

  login(email: string, pass: string){
    //
    this.store.dispatch(new ActivarLoadingAction());
    //
    this.afAuth.auth.signInWithEmailAndPassword(email, pass)
    .then( resp => {
      //console.log(resp);
      //
      this.store.dispatch(new DesactivarLoadingAction());
      //
      this.router.navigate(['/']);
    })
    .catch( error => {
      //console.error(error.message);
      //
      this.store.dispatch(new DesactivarLoadingAction());
      //
      Swal.fire('Error!', error.message, 'error');
    })
  }

  logout(){
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  initAuthListener(){
    this.afAuth.authState.subscribe( (fbUser: firebase.User) => {
      if(fbUser){
        this.userSubscription = this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges()
        .subscribe((userObj: any) => {
            console.log(userObj)
            this.store.dispatch(new SetUserAction(userObj));
        })
      }else{
        this.userSubscription.unsubscribe();
      }
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
