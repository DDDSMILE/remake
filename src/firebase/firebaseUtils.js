import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"

// Firebase Configuration Object
const firebaseConfig = {
    apiKey: "AIzaSyC0vgMSm4v2sr8HkkX66TqSw2RiP2uv5OA",
    authDomain: "sbmr-1e2b1.firebaseapp.com",
    projectId: "sbmr-1e2b1",
    storageBucket: "sbmr-1e2b1.appspot.com",
    messagingSenderId: "671421696153",
    appId: "1:671421696153:web:a6a77a91cebfbf2dba1008",
    measurementId: "G-DDL0WR3G9L"
}
export const deleteUser = id => {
    return firestore.doc(`users/${id}`);
}
export const deleteLike = id => {
    return firestore.doc(`like/${id}`);
}
export const deleteDisLike = id => {
    return firestore.doc(`dislike/${id}`);
}
export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;
    const userRef = firestore.doc(`users/${userAuth.uid}`);
    const snapShot = await userRef.get();
    if (!snapShot.exists) {
        const { displayName, email, photoURL, role } = userAuth;
        const createdAt = new Date();
        try {
            await userRef.set({
                displayName,
                email,
                photoURL,
                createdAt,
                role: role ? role : "CUSTOMER",
                ...additionalData,
            });
        } catch (error) {
            console.log("error creating user", error.message);
        }
    }

    return userRef;
};


export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(userAuth => {
            unsubscribe();
            resolve(userAuth);
        }, reject);
    });
}

firebase.initializeApp(firebaseConfig);
firebase.firestore().enablePersistence({ experimentalForceOwningTab: true })
firebase.firestore.setLogLevel("debug");
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const db = firebase.firestore()
// Sign in With Google Setup with popup
export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebase;
