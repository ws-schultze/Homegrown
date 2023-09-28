# Setup

Start by cloning this repo to a location of your choosing.

Open a terminal from within the project's root directory and run `npm install`

## Firestore Database

Setup a firestore database that has two collections:

1. listings
2. users

Don't worry about defining all the possible fields from within firestore, the app will create the fields when listings and users are created.

Make a file "firebase.config.ts" in the src directory of the project.

Creating a firebase project and [registering](https://firebase.google.com/docs/web/setup#access-firebase) your app will provide you with a SDK config file similar to this:

```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "something",
  authDomain: "something.firebaseapp.com",
  projectId: "something",
  storageBucket: "something.appspot.com",
  messagingSenderId: "something",
  appId: "something",
  measurementId: "something",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

In the project's root, create a new dot file .env.local and in it, create an environmental variable for each of the firebaseConfig key/value pairs like so:

```
REACT_APP_GOOGLE_API_KEY = supersecret key

REACT_APP_FIREBASE_AUTH_DOMAIN = something

REACT_APP_FIREBASE_PROJECT_ID = something

REACT_APP_FIREBASE_STORAGE_BUCKET = something

REACT_APP_FIREBASE_MESSAGING_SENDER_ID = something

REACT_APP_FIREBASE_APP_ID = something

REACT_APP_FIREBASE_MEASUREMENT_ID = something
```

Now these environmental variable can be called from within firebase.config.ts

```javascript
// ... same as before ...

const firebaseConfig = {
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// ... same as before ...
```

In order to be able to do some crud actions, apply the following rules to your new firestore database:

```javascript
rules_version = '2';

service cloud.firestore {

    match /databases/{database}/documents {
    // Listings
    match /listings/{listing} {
      allow read;
      allow create: if request.auth != null && request.resource.data.uploads.images.value.size() <= 30;
      allow update: if resource.data.userRef.uid == request.auth.uid;
      allow delete: if resource.data.userRef.uid == request.auth.uid;
    }

    // Users
    match /users/{user} {
      allow read;
      allow create;
      allow update: if request.auth.uid == user
    }
  }

}
```

## Storage

Setup storage in the project, then make a storage bucket, other than the default bucket, that will hold images for the project and apply the following rules to it:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if
      request.auth != null &&
      request.resource.size < 2 * 1024 * 1024 && //2MB
      request.resource.contentType.matches('image/.*')
      allow delete: if
      request.auth != null
    }
  }
}
```
