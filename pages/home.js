import { useState } from 'react';
import styles from '../styles/Home.module.css';
import Image from 'next/image';

export default function Home() {
  const [tweetContent, setTweetContent] = useState('');
  const [tweets, setTweets] = useState([
    {
      username: 'John',
      handle: '@JohnCena',
      timestamp: 'a few seconds',
      content: "YOU CAN'T SEE ME ! #cenation",
      likes: 1,
      id: 1,
    },
    {
      username: 'Antoine',
      handle: '@AntoineLePrOf',
      timestamp: '5 hours',
      content: 'Welcome to #hackatweet guys 😎',
      likes: 0,
      id: 2,
    },
    {
      username: 'Antoine',
      handle: '@AntoineLePrOf',
      timestamp: '5 hours',
      content: 'First! #hackatweet #first',
      likes: 1,
      id: 3,
    }
  ]);

  const [trends] = useState([
    { hashtag: '#hackatweet', count: 2 },
    { hashtag: '#first', count: 1 },
    { hashtag: '#cenation', count: 1 }
  ]);

  const handleTweet = () => {
    if (tweetContent.trim()) {
      // Add tweet logic here
      setTweetContent('');
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
        </div>
        <div className={styles.userInfo}>
          <h3>John</h3>
          <p>@JohnCena</p>
          <button onClick={() => {/* Logout logic */}} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <h1>Home</h1>
        <div className={styles.tweetInput}>
          <textarea
            placeholder="What's up?"
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
            maxLength={280}
          />
          <div className={styles.tweetActions}>
            <span>{280 - tweetContent.length}</span>
            <button onClick={handleTweet} className={styles.tweetButton}>
              Tweet
            </button>
          </div>
        </div>

        {/* Tweet List */}
        <div className={styles.tweetList}>
          {tweets.map((tweet) => (
            <div key={tweet.id} className={styles.tweet}>
              <div className={styles.tweetHeader}>
                <Image src="/avatar.png" alt="Avatar" width={40} height={40} className={styles.avatar} />
                <span className={styles.username}>{tweet.username}</span>
                <span className={styles.handle}>{tweet.handle}</span>
                <span className={styles.timestamp}>{tweet.timestamp}</span>
              </div>
              <p className={styles.tweetContent}>{tweet.content}</p>
              <div className={styles.tweetFooter}>
                <button className={styles.likeButton}>
                  ❤️ {tweet.likes}
                </button>
                <button className={styles.deleteButton}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar - Trends */}
      <div className={styles.trendsSection}>
        <h2>Trends</h2>
        {trends.map((trend) => (
          <div key={trend.hashtag} className={styles.trend}>
            <p className={styles.hashtag}>{trend.hashtag}</p>
            <p className={styles.tweetCount}>{trend.count} Tweet{trend.count !== 1 ? 's' : ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
}