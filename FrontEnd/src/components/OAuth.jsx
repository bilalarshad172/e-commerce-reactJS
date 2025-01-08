import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'

const OAuth = () => {
    
    const HandleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            console.log(result);
            const res = await fetch('/api/auth/google', {
            
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL
                })
            })
            const data = await res.json();
            
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <button onClick={HandleGoogleClick} type='button' className="border rounded-xl w-1/2 py-1 bg-black text-white hover:opacity-80">Continue with Google</button>
  )
}

export default OAuth