import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1><i className="fas fa-quote-left" style={{ marginRight: '0.5em', color: '#f2849e' }}></i>Quote App</h1>
        <p>Discover and vote on inspiring quotes from around the world</p>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <ul className="nav-links">
          <li><a href="/"><i className="fas fa-home" style={{ marginRight: '0.5em' }}></i>Home</a></li>
          <li><a href="/quotes"><i className="fas fa-list" style={{ marginRight: '0.5em' }}></i>Browse Quotes</a></li>
          <li><a href="/quotes?action=add"><i className="fas fa-plus" style={{ marginRight: '0.5em' }}></i>Add Quote</a></li>
          <li><a href="/quotes/top"><i className="fas fa-star" style={{ marginRight: '0.5em' }}></i>Top Quotes</a></li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" style={{ marginRight: '0.5em' }}></i>Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <h2>Welcome to the Ultimate Quote Collection</h2>
        <p>Explore, share, and vote for your favorite quotes.</p>
        <div className="actions">
          <a href="/quotes" className="button primary"><i className="fas fa-list" style={{ marginRight: '0.5em' }}></i>Browse All Quotes</a>
          <a href="/quotes?action=add" className="button"><i className="fas fa-plus" style={{ marginRight: '0.5em' }}></i>Add New Quote</a>
        </div>

        <div className="features">
          <section>
            <h3><i className="fas fa-tachometer-alt" style={{ marginRight: '0.5em', color: '#f2849e' }}></i>Welcome to Your Quote Dashboard</h3>
            <p>
              Start exploring our collection of inspiring quotes. You can browse through quotes, 
              vote on your favorites, and even add your own quotes to the collection.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}