// Once signed in, a page reload will cause the components to load before firebase returns the auth details; this causes an error that reads:
// Uncaught TypeError: Cannot read properties of null (reading 'displayName').
// To fix this issue we must create the following custom hook.

// ------ Implementing protected routes in react router v6 --------
// https://stackoverflow.com/questions/65505665/protected-route-with-firebase

// ------ Fix memory leak warning ------------
// https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks

import { useEffect, useState, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
// https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#onauthstatechanged

export const useAuthStatus = () => {
  const [signedIn, setSignedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const isMounted = useRef(true)

  useEffect(() => {
    // Get the current auth instance
    const auth = getAuth()

    // Prevent memory leaks by checking if mounted
    if (isMounted) {
      // If the current auth instance has a signed in user, set signedIn to true, set user data, and setCheckingStatus to false
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setSignedIn(true)
          setUser({
            name: user.displayName,
            email: user.email,
            uid: user.uid,
          })
          setCheckingStatus(false)
        } else {
          setUser(null)
          setCheckingStatus(false)
        }
      })
    }

    return () => {
      isMounted.current = false
    }
  }, [isMounted])

  return { signedIn, user, checkingStatus }
}
