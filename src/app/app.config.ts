import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBAxBHV9btSNxLufnBEEemG4Yt87ghpL3A",
  authDomain: "fake-neptun-b4ef8.firebaseapp.com",
  projectId: "fake-neptun-b4ef8",
  storageBucket: "fake-neptun-b4ef8.firebasestorage.app",
  messagingSenderId: "445100120244",
  appId: "1:445100120244:web:6fbc46200f729bf99f9fe1",
  measurementId: "G-M3WBCJX8FE"
};



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()) 
  ]
};

provideFirestore(() => {
  const firestore = getFirestore();
  console.log('Firestore inicializálva:', firestore);
  return firestore;
});

