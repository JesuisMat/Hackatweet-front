import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from "../styles/SignUp.module.css";
import { useRouter } from 'next/router';
import { setToken, setUser } from '../reducers/user';
import Image from 'next/image';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch(); 

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://hackatweet-backend-six-swart.vercel.app/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.result) {
        localStorage.setItem('userToken', data.token);
        
        dispatch(setToken(data.token));
        dispatch(setUser({ username }));
        
        router.push('/home');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <Image
          src="/background-image-twitter.jpg"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      <div className={styles.rightSection}>
        <div className={styles.formContainer}>
          <h2>Create your Hackatweet account</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSignUp}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Sign Up
            </button>
          </form>
          <button 
            onClick={() => router.push('/')} 
            className={styles.backButton}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}