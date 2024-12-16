import styles from "../styles/Home.module.css";
import Image from 'next/image';

function Home() {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.imageContainer}>
        <Image
          src="/background-image-twitter.jpg"  // Make sure the image exists in the public folder
          alt="Background"
          fill  // replaces layout="fill"
          style={{ objectFit: "cover" }}  // replaces objectFit prop
          priority
        />
      </div>
      <div className={styles.welcome}>
        <h1>See what's happening</h1>
        <h3>Join Hackatweet today</h3>
        <button>Sign Up</button>
        <p>Already have an account?</p>
        <button>Sign In</button>
      </div>
    </div>
  );
}

export default Home;