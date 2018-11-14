import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

firebase.initializeApp({
	apiKey: "AIzaSyAn14sii2Jbvl93mac5p29hWz2FZI0RVJg",
	authDomain: "reactapp-cb5e1.firebaseapp.com",
	databaseURL: "https://reactapp-cb5e1.firebaseio.com",
	projectId: "reactapp-cb5e1",
	storageBucket: "reactapp-cb5e1.appspot.com",
	messagingSenderId: "885210754201"
});

const database = firebase.firestore();
database.settings({
	timestampsInSnapshots: true
});

const provider = new firebase.auth.GoogleAuthProvider();

export { firebase, database, provider };