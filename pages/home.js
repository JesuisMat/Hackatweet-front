import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const [tweetContent, setTweetContent] = useState('');
  const [tweets, setTweets] = useState([]);
  const [trends, setTrends] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const fetchUserInfo = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
  
    try {
      const response = await fetch('https://hackatweet-backend-six-swart.vercel.app/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.result) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };
  // Fetch user info and tweets on component mount
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/');
      return;
    }

    // Fetch all tweets
    fetchTweets();
    // Fetch trends
    fetchTrends();
    // Fetch User Info
    fetchUserInfo();
  }, []);

  // Fetch tweets from backend
  const fetchTweets = async () => {
    try {
      const response = await fetch('https://hackatweet-backend-six-swart.vercel.app/users/tweets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      const data = await response.json();
      if (data.result) {
        setTweets(data.tweets);
      }
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };

  // Fetch trending hashtags
  const fetchTrends = async () => {
    try {
      const response = await fetch('https://hackatweet-backend-six-swart.vercel.app/users/trends', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      const data = await response.json();
      if (data.result) {
        setTrends(data.trends);
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
    }
  };

  // Post new tweet
  const handleTweet = async () => {
    if (!tweetContent.trim()) return;

    try {
      const response = await fetch('http://localhost:3000/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({ content: tweetContent })
      });

      const data = await response.json();
      if (data.result) {
        setTweetContent('');
        // Refresh tweets and trends after posting
        fetchTweets();
        fetchTrends();
      }
    } catch (error) {
      console.error('Error posting tweet:', error);
    }
  };

  // Like/Unlike tweet
  const handleLike = async (tweetId) => {
    try {
      const response = await fetch(`http://localhost:3000/tweets/${tweetId}/like`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      const data = await response.json();
      if (data.result) {
        // Update tweets state with new like count
        setTweets(tweets.map(tweet => {
          if (tweet._id === tweetId) {
            return { ...tweet, likes: data.likes };
          }
          return tweet;
        }));
      }
    } catch (error) {
      console.error('Error liking tweet:', error);
    }
  };

  // Delete tweet
  const handleDelete = async (tweetId) => {
    try {
      const response = await fetch(`http://localhost:3000/tweets/${tweetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      const data = await response.json();
      if (data.result) {
        // Remove tweet from state
        setTweets(tweets.filter(tweet => tweet._id !== tweetId));
        // Refresh trends after deletion
        fetchTrends();
      }
    } catch (error) {
      console.error('Error deleting tweet:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    router.push('/');
  };

  return (
    <div className={styles.container}>
      {/* Left Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <Image src="/images/Logo_of_Twitter.svg" alt="Logo" width={50} height={50} />
        </div>
        <div className={styles.userInfo}>
          <h3>{user?.username}</h3>
          <p>@{user?.username.toLowerCase()}</p>
          <button onClick={handleLogout} className={styles.logoutButton}>
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
            <div key={tweet._id} className={styles.tweet}>
              <div className={styles.tweetHeader}>
                <Image src="/avatar.png" alt="Avatar" width={40} height={40} className={styles.avatar} />
                <span className={styles.username}>{tweet.author.username}</span>
                <span className={styles.handle}>@{tweet.author.username.toLowerCase()}</span>
                <span className={styles.timestamp}>{new Date(tweet.createdAt).toLocaleTimeString()}</span>
              </div>
              <p className={styles.tweetContent}>{tweet.content}</p>
              <div className={styles.tweetFooter}>
                <button 
                  className={styles.likeButton}
                  onClick={() => handleLike(tweet._id)}
                >
                  ❤️ {tweet.likes.length}
                </button>
                {tweet.author._id === user?._id && (
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDelete(tweet._id)}
                  >
                    🗑️
                  </button>
                )}
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