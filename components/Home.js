import styles from "../styles/Home.module.css";

function Home() {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.imageContainer}>
        <img className={styles.image} src="/images/background-image-twitter.jpg" alt="twitter background" />
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
