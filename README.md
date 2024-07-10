# What Is This App Anyway?

This is a straightforward real estate marketplace application that allows users to create listings for properties they want to sell or rent. All listings are stored in a Firestore database, and images are stored in a Firebase storage bucket. The Google Maps API provides geolocation and interactive map services. Users can create an account and log in to the app. Once logged in, users can create, update, and delete their own listings. All listings are visible to the public.

## Setup

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

```javascript
REACT_APP_GOOGLE_API_KEY = supersecret key

REACT_APP_FIREBASE_AUTH_DOMAIN = something

REACT_APP_FIREBASE_PROJECT_ID = something

REACT_APP_FIREBASE_STORAGE_BUCKET = something

REACT_APP_FIREBASE_MESSAGING_SENDER_ID = something

REACT_APP_FIREBASE_APP_ID = something

REACT_APP_FIREBASE_MEASUREMENT_ID = something
```

Make sure to add this file to your .gitignore file so the keys don't push to github.

Now these environmental variable can be called from within firebase.config.ts as follows:

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

In order to be able to do some crud actions, apply the following rules to your new firestore database from within the firebase console:

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

Setup storage in the project, then make a storage bucket other than the default bucket. This non default bucket will hold images for the project. Apply apply the following rules to it:

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

## Google Maps API

To get map functionality, you will need to get a Google Maps API key. You can get one [here](https://developers.google.com/maps/gmp-get-started). Once you have your key, add it to the .env.local file like so:

```javascript
REACT_APP_GOOGLE_API_KEY = supersecret key
//... same as before ...
```

Note that while enabling the Google Maps API, you will need to enable the following APIs:

1. Maps JavaScript API
2. Places API
3. Geocoding API
4. Address Validation API

## Running the App

To run the app, open a terminal from within the project's root directory and run `npm start`
The app will open in your default browser at `http://localhost:3000/` unless you have specified another location.
