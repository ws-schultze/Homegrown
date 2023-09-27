# Getting the app setup

Start by cloning the repo to a location of your choosing.

Open a terminal from within the project's root directory and run `npm install`

## Firestore database

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
  apiKey: "something", // This value gets moved to .env.local in the root
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

Copy the contents of the config file into the firebase.config.ts file you just made.

In order to have the firebase API key in only one location, write this:

```javascript
// ... same as before ...

const firebaseConfig = {
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  // ... same as before ...
};

// ... same as before ...
```

Later we will make a place to store environmental variables.

Now add the following rules to your new firestore database:

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

## Local environmental variables

From the SDK config file, copy the apiKey's value (without the parenthesis)

In the root directory create a ".env.local" file and paste the API key into it:

```-
REACT_APP_GOOGLE_API_KEY = The API key found in the SDK config
```

The reason for moving the API key is because a number of components need to access it, and using process.env.REACT_APP_GOOGLE_API_KEY seems like a clean way to achieve that.

## Storage

Setup a storage bucket storage that will hold images for the firebase project and apply the following rules to it:

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
