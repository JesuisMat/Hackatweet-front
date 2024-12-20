import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../reducers/user'; 
import styles from "../styles/SignIn.module.css";
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://hackatweet-backend-six-swart.vercel.app/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('Sign in response:', data);

      if (data.result) {
        // Le token est dans data.user.token, pas dans data.token
        if (!data.user?.token) {
          console.error('No token in response');
          setError('Authentication error: No token received');
          return;
        }

        // Utiliser data.user.token
        localStorage.setItem('userToken', data.user.token);
        console.log('Token saved:', localStorage.getItem('userToken'));

        // Dispatch avec le bon token
        dispatch(setToken(data.user.token));
        dispatch(setUser({ username: data.user.username }));

        router.push('/home');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Signin error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  // Le reste du composant reste inchangé
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
          <h2>Connect to Hackatweet</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSignIn}>
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
              Sign In
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