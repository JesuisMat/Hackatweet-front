import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  // États locaux
  const [tweetContent, setTweetContent] = useState('');
  const [tweets, setTweets] = useState([]);
  const [trends, setTrends] = useState([]);
  
 
  const user = useSelector(state => state.users.user); 
  const token = useSelector(state => state.users.token); 
  
  const router = useRouter();
  const dispatch = useDispatch();

  const BACKEND_URL = 'https://hackatweet-backend-six-swart.vercel.app';

  const fetchUserInfo = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${BACKEND_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.result) {
        
        dispatch({ type: 'SET_USER', payload: data.user });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('userToken');
    
    if (!tokenFromStorage) {
      router.push('/');
      return;
    }
  
    // Dispatch le token depuis localStorage si nécessaire
    if (!token) {
      dispatch({ type: 'SET_TOKEN', payload: tokenFromStorage });
    }
  
    // Utilisez le token de localStorage pour le premier chargement
    const loadInitialData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/tweet/all/${tokenFromStorage}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log('Tweets data:', data); // Debug log
        if (data.result) {
          setTweets(data.tweets);
        }
      } catch (error) {
        console.error('Error loading initial tweets:', error);
      }
    };
  
    loadInitialData();
    fetchUserInfo();
    fetchTrends();
  }, []);
  
  // Modifiez fetchTweets pour utiliser aussi le token de localStorage comme fallback
  const fetchTweets = async () => {
    try {
      const currentToken = token || localStorage.getItem('userToken');
      if (!currentToken) return;
  
      const response = await fetch(`${BACKEND_URL}/tweet/all/${currentToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Debug logs
      console.log('Fetch response status:', response.status);
      const data = await response.json();
      console.log('Fetch response data:', data);
      
      if (data.result) {
        setTweets(data.tweets);
      }
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };

  const fetchTrends = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${BACKEND_URL}/users/trends`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
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

  const handleTweet = async () => {
    if (!tweetContent.trim()) return;
  
    try {
      const response = await fetch(`${BACKEND_URL}/tweet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          token, // token dans le body pour la création
          content: tweetContent 
        })
      });
  
      const data = await response.json();
      if (data.result) {
        setTweetContent('');
        fetchTweets();
        fetchTrends();
      }
    } catch (error) {
      console.error('Error posting tweet:', error);
    }
  };

  const handleLike = async (tweetId) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${BACKEND_URL}/tweet/${tweetId}/like`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.result) {
        fetchTweets(); // Refresh all tweets to get updated likes
      }
    } catch (error) {
      console.error('Error liking tweet:', error);
    }
  };

  const handleDelete = async (tweetId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/tweet/${tweetId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token }) // token dans le body pour la suppression
      });
  
      const data = await response.json();
      if (data.result) {
        fetchTweets();
        fetchTrends();
      }
    } catch (error) {
      console.error('Error deleting tweet:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <Image src="/images/Logo_of_Twitter.svg" alt="Logo" width={50} height={50} />
        </div>
        <div className={styles.userInfo}>
          <h3>{user?.username}</h3>
          <p>@{user?.username?.toLowerCase()}</p>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

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

        <div className={styles.tweetList}>
          {tweets.map((tweet) => (
            <div key={tweet._id} className={styles.tweet}>
              <div className={styles.tweetHeader}>
                <Image 
                  src="/images/avatar.png" 
                  alt="Avatar" 
                  width={40} 
                  height={40} 
                  className={styles.avatar}
                />
                <span className={styles.username}>{tweet.author.username}</span>
                <span className={styles.handle}>@{tweet.author.username.toLowerCase()}</span>
                <span className={styles.timestamp}>
                  {new Date(tweet.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p className={styles.tweetContent}>{tweet.content}</p>
              <div className={styles.tweetFooter}>
                <button 
                  className={styles.likeButton}
                  onClick={() => handleLike(tweet._id)}
                >
                  ❤️ {tweet.likes?.length || 0}
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

      <div className={styles.trendsSection}>
        <h2>Trends</h2>
        {trends.map((trend) => (
          <div key={trend.hashtag} className={styles.trend}>
            <p className={styles.hashtag}>{trend.hashtag}</p>
            <p className={styles.tweetCount}>
              {trend.count} Tweet{trend.count !== 1 ? 's' : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}