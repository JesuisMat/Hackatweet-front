import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setToken, setUser, logout } from "../reducers/user";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Home() {
  const [tweetContent, setTweetContent] = useState("");
  const [tweets, setTweets] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loadingTweets, setLoadingTweets] = useState({});
  const [filteredTweets, setFilteredTweets] = useState([]);
  const [activeHashtag, setActiveHashtag] = useState(null);

  const username = useSelector((state) => state.user.username);
  const token = useSelector((state) => state.user.token);

  const router = useRouter();
  const dispatch = useDispatch();

  const BACKEND_URL = "https://hackatweet-backend-six-swart.vercel.app";

  const extractHashtags = (text) => {
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    return text.match(hashtagRegex) || [];
  };

  const calculateTrends = (tweets) => {
    const hashtagCounts = {};

    tweets.forEach((tweet) => {
      const hashtags = extractHashtags(tweet.content);
      hashtags.forEach((tag) => {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
      });
    });

    
    const trends = Object.entries(hashtagCounts)
      .map(([hashtag, count]) => ({ hashtag, count }))
      .sort((a, b) => b.count - a.count);

    return trends;
  };

  const handleHashtagClick = (hashtag) => {
    setActiveHashtag(hashtag);
    if (hashtag) {
      const filtered = tweets.filter((tweet) =>
        extractHashtags(tweet.content).includes(hashtag)
      );
      setFilteredTweets(filtered);
    } else {
      setFilteredTweets([]);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffSeconds = Math.floor(diffTime / 1000);

    if (diffDays > 0) {
      return `${diffDays}d`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m`;
    } else {
      return `${diffSeconds}s`;
    }
  };

  const fetchTweets = async (currentToken) => {
    if (!currentToken) return;

    try {
      const response = await fetch(`${BACKEND_URL}/tweet/all/${currentToken}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.result) {
        const sortedTweets = data.tweets.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTweets(sortedTweets);
        const newTrends = calculateTrends(sortedTweets);
        setTrends(newTrends);

        if (activeHashtag) {
          const filtered = sortedTweets.filter((tweet) =>
            extractHashtags(tweet.content).includes(activeHashtag)
          );
          setFilteredTweets(filtered);
        }
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };


  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("userToken");

    if (!tokenFromStorage) {
      router.push("/");
      return;
    }

    if (!token) {
      dispatch(setToken(tokenFromStorage));
    }

    const loadInitialData = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/tweet/all/${tokenFromStorage}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.result) {
          const sortedTweets = data.tweets.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setTweets(sortedTweets);
          const initialTrends = calculateTrends(sortedTweets);
          setTrends(initialTrends);
        }
      } catch (error) {
        console.error("Error loading initial tweets:", error);
      }
    };

    loadInitialData();
  }, [dispatch, router, token]);

  const handleTweet = async () => {
    if (!tweetContent.trim()) return;

    try {
      const response = await fetch(`${BACKEND_URL}/tweet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          content: tweetContent,
        }),
      });

      const data = await response.json();
      if (data.result) {
        setTweetContent("");
        fetchTweets(token);
      
      }
    } catch (error) {
      console.error("Error posting tweet:", error);
    }
  };

  const handleLike = async (tweetId) => {
    setLoadingTweets((prev) => ({ ...prev, [tweetId]: true }));
    try {
      const response = await fetch(`${BACKEND_URL}/tweet/${tweetId}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      if (data.result) {
        await fetchTweets(token);
      }
    } catch (error) {
      console.error("Error liking tweet:", error);
    } finally {
      setLoadingTweets((prev) => ({ ...prev, [tweetId]: false }));
    }
  };

  const handleDelete = async (tweetId) => {
    setLoadingTweets((prev) => ({ ...prev, [tweetId]: true }));
    try {
      const response = await fetch(`${BACKEND_URL}/tweet/${tweetId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      if (data.result) {
        await fetchTweets(token);
      }
    } catch (error) {
      console.error("Error deleting tweet:", error);
    } finally {
      setLoadingTweets((prev) => ({ ...prev, [tweetId]: false }));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("userToken");
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <Image
            src="/images/Logo_of_Twitter.svg"
            alt="Logo"
            width={50}
            height={50}
          />
        </div>
        <div className={styles.userInfo}>
          <h3>{username}</h3>
          <p>@{username?.toLowerCase()}</p>
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
  {tweets && tweets.length > 0 ? (
    (activeHashtag ? filteredTweets : tweets).map((tweet) => (
      <div key={tweet._id} className={styles.tweet}>
        <div className={styles.tweetHeader}>
          <Image
            src="/images/avatar.webp"
            alt="Avatar"
            width={40}
            height={40}
            className={styles.avatar}
          />
          <span className={styles.username}>
            {tweet.author.username}
          </span>
          <span className={styles.handle}>
            @{tweet.author.username.toLowerCase()}
          </span>
          <span className={styles.timestamp}>
            {formatTimeAgo(tweet.createdAt)}
          </span>
        </div>
        <p className={styles.tweetContent}>
          {tweet.content.split(" ").map((word, index) =>
            word.startsWith("#") ? (
              <span
                key={index}
                className={styles.hashtag}
                onClick={() => handleHashtagClick(word)}
              >
                {word}{" "}
              </span>
            ) : (
              word + " "
            )
          )}
        </p>
        <div className={styles.tweetFooter}>
          <button
            className={styles.likeButton}
            onClick={() => handleLike(tweet._id)}
            disabled={loadingTweets[tweet._id]}
          >
            {loadingTweets[tweet._id] ? "..." : "❤️"}{" "}
            {tweet.likes?.length || 0}
          </button>
          {tweet.author.username === username && (
            <button
              className={styles.deleteButton}
              onClick={() => handleDelete(tweet._id)}
              disabled={loadingTweets[tweet._id]}
            >
              {loadingTweets[tweet._id] ? "..." : "🗑️"}
            </button>
          )}
        </div>
      </div>
    ))
  ) : (
    <p>No tweets yet</p>
  )}
</div>
      </div>

      <div className={styles.trendsSection}>
        <h2>Trends</h2>
        {trends.map((trend) => (
          <div
            key={trend.hashtag}
            className={`${styles.trend} ${
              activeHashtag === trend.hashtag ? styles.activeTrend : ""
            }`}
            onClick={() => handleHashtagClick(trend.hashtag)}
          >
            <p className={styles.hashtag}>{trend.hashtag}</p>
            <p className={styles.tweetCount}>
              {trend.count} Tweet{trend.count !== 1 ? "s" : ""}
            </p>
          </div>
        ))}
        {activeHashtag && (
          <button
            className={styles.clearFilter}
            onClick={() => handleHashtagClick(null)}
          >
            Clear filter
          </button>
        )}
      </div>
    </div>
  );
}
