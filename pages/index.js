import styles from "../styles/Home.module.css";
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.homeContainer}>
      <div className={styles.imageContainer}>
        <Image
          src="/background-image-twitter.jpg"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      
      <div className={styles.welcome}>
        <h1>See what's happening</h1>
        <h3>Join Hackatweet today</h3>
        <button 
          className={styles.signupButton} 
          onClick={() => router.push('/signup')}
        >
          Sign Up
        </button>
        <p>Already have an account?</p>
        <button 
          className={styles.signinButton} 
          onClick={() => router.push('/signin')}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}