import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
// เพิ่ม import สำหรับ chart
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Quote {
  id: string;
  text: string;
  author: string;
  votes: { id: string }[];
}

export default function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState('');
  const [author, setAuthor] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [modalQuote, setModalQuote] = useState<Quote | null>(null);
  const [formText, setFormText] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [voteErrors, setVoteErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const openCreateModal = useCallback(() => {
    setModalType('create');
    setFormText('');
    setFormAuthor('');
    setModalQuote(null);
    setShowModal(true);
  }, []);

  // โหลด quotes ตาม page, search, filter, sort
  const fetchQuotes = async (reset = false) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({
      search,
      author,
      sort,
      skip: String((reset ? 0 : (page - 1) * 10)),
      take: '10',
    });
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/quotes?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: Quote[] = await res.json();
    if (reset) {
      setQuotes(data);
      setPage(2);
    } else {
      setQuotes(prev => [...prev, ...data]);
      setPage(p => p + 1);
    }
    setHasMore(data.length === 10);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotes(true);
    // eslint-disable-next-line
  }, [search, author, sort]);

  useEffect(() => {
    if (router.isReady && router.query.action === 'add') {
      openCreateModal();
      router.replace('/quotes', undefined, { shallow: true });
    }
  }, [router.isReady, router.query, openCreateModal, router]);

  // โหวต
  const handleVote = async (quoteId: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/quotes/${quoteId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        // อัปเดตหน้าใหม่อีกครั้ง (หรือปรับ state เพิ่ม vote)
        setQuotes(quotes.map(q =>
          q.id === quoteId
            ? { ...q, votes: [...q.votes, { id: 'temp' }] }
            : q
        ));
        // ลบ error message ถ้ามี
        setVoteErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[quoteId];
          return newErrors;
        });
      } else {
        // ถ้า response ไม่ใช่ 200 ให้ดึง error message
        const errorData = await res.json().catch(() => ({ message: 'Vote failed' }));
        setVoteErrors(prev => ({
          ...prev,
          [quoteId]: errorData.message || 'Vote failed'
        }));
      }
    } catch (error) {
      // ถ้าเกิด network error
      setVoteErrors(prev => ({
        ...prev,
        [quoteId]: 'Network error occurred'
      }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const openEditModal = (quote: Quote) => {
    setModalType('edit');
    setFormText(quote.text);
    setFormAuthor(quote.author);
    setModalQuote(quote);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setModalQuote(null);
    setFormText('');
    setFormAuthor('');
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (modalType === 'create') {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: formText, author: formAuthor }),
      });
      if (res.ok) {
        closeModal();
        fetchQuotes(true);
      } else {
        alert('Create failed');
      }
    } else if (modalType === 'edit' && modalQuote) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/quotes/${modalQuote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: formText, author: formAuthor }),
      });
      if (res.ok) {
        closeModal();
        fetchQuotes(true);
      } else {
        alert('Edit failed');
      }
    }
  };
  const handleDelete = async (quote: Quote) => {
    if (!window.confirm('Delete this quote?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/quotes/${quote.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchQuotes(true);
    else alert('Delete failed');
  };

  // เตรียมข้อมูลสำหรับ chart
  const chartData = quotes.map(q => ({ name: q.text.slice(0, 10) + '...', votes: q.votes.length }));

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1><i className="fas fa-quote-left" style={{ marginRight: '0.5em', color: '#f2849e' }}></i>Quotes Collection</h1>
        <p>Discover and vote on funny quotes from around the world</p>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <ul className="nav-links">
          <li><a href="/"><i className="fas fa-home" style={{ marginRight: '0.5em' }}></i>Home</a></li>
          <li><a href="/quotes"><i className="fas fa-list" style={{ marginRight: '0.5em' }}></i>Browse Quotes</a></li>
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); openCreateModal(); }} style={{ cursor: 'pointer' }}>
              <i className="fas fa-plus" style={{ marginRight: '0.5em' }}></i>Add Quote
            </a>
          </li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" style={{ marginRight: '0.5em' }}></i>Logout
        </button>
      </nav>

      {/* Search and Filter */}
      <div className="search-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <i className="fas fa-search" style={{ 
            position: 'absolute', 
            left: '0.5em', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#c9c9c9' 
          }}></i>
          <input 
            className="input" 
            placeholder="Search quotes..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2em' }}
          />
        </div>
        <div style={{ position: 'relative', flex: 1 }}>
          <i className="fas fa-user" style={{ 
            position: 'absolute', 
            left: '0.5em', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#c9c9c9' 
          }}></i>
          <input 
            className="input" 
            placeholder="Filter by author..." 
            value={author} 
            onChange={e => setAuthor(e.target.value)}
            style={{ paddingLeft: '2em' }}
          />
        </div>
        <select 
          className="input" 
          value={sort} 
          onChange={e => setSort(e.target.value as 'asc' | 'desc')}
          style={{ minWidth: '120px' }}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
        <button className="button primary" onClick={openCreateModal}>
          <i className="fas fa-plus" style={{ marginRight: '0.5em' }}></i>Add Quote
        </button>
      </div>

      {/* Quotes Grid */}
      <div className="quotes-grid">
        {quotes.map(q => (
          <div key={q.id} className="quote-card">
            <p className="quote-text">
              <i className="fas fa-quote-left" style={{ 
                marginRight: '0.5em', 
                color: '#f2849e',
                fontSize: '0.8em' 
              }}></i>
              "{q.text}"
            </p>
            <div className="quote-meta">
              <span className="author">
                <i className="fas fa-user" style={{ marginRight: '0.3em' }}></i>
                — {q.author}
              </span>
              <span className="votes">
                <i className="fas fa-thumbs-up" style={{ marginRight: '0.3em' }}></i>
                {q.votes.length}
              </span>
            </div>
            <div className="actions">
              <button className="button" onClick={() => handleVote(q.id)}>
                <i className="fas fa-thumbs-up" style={{ marginRight: '0.5em' }}></i>Vote
              </button>
              {q.votes.length === 0 && (
                <>
                  <button 
                    className="button" 
                    onClick={() => openEditModal(q)}
                    style={{ background: '#f2849e', color: '#ffffff' }}
                  >
                    <i className="fas fa-edit" style={{ marginRight: '0.5em' }}></i>Edit
                  </button>
                  <button 
                    className="button" 
                    onClick={() => handleDelete(q)}
                    style={{ background: '#585858', color: '#ffffff' }}
                  >
                    <i className="fas fa-trash" style={{ marginRight: '0.5em' }}></i>Delete
                  </button>
                </>
              )}
            </div>
            {/* Error message display */}
            {voteErrors[q.id] && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.9em',
                marginTop: '0.5em',
                padding: '0.5em',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.3em' }}></i>
                {voteErrors[q.id]}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <button 
          className="loadmore-btn" 
          onClick={() => fetchQuotes(false)} 
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5em' }}></i>
              Loading...
            </>
          ) : (
            <>
              <i className="fas fa-plus" style={{ marginRight: '0.5em' }}></i>
              Load More Quotes
            </>
          )}
        </button>
      )}

      {/* Chart Section */}
      <h2 className="chart-title">
        <i className="fas fa-chart-bar" style={{ marginRight: '0.5em', color: '#f2849e' }}></i>
        Vote Statistics
      </h2>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="votes" fill="#f2849e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Modal ฟอร์มสร้าง/แก้ไข quote */}
      {showModal && (
        <div style={{
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          background: 'rgba(0,0,0,0.5)', 
          zIndex: 1000,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
        }}>
          <div className="form-container" style={{ 
            background: '#ffffff', 
            borderRadius: '4px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)', 
            padding: '2em', 
            minWidth: '400px', 
            maxWidth: '800px', 
            width: '90%' 
          }}>
            <h2 style={{ marginBottom: '1.5em', textAlign: 'center' }}>
              <i className="fas fa-quote-left" style={{ marginRight: '0.5em', color: '#f2849e' }}></i>
              {modalType === 'create' ? 'Add New Quote' : 'Edit Quote'}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label><i className="fas fa-quote-left" style={{ marginRight: '0.5em' }}></i>Quote Text</label>
                <textarea
                  className="input"
                  placeholder="Enter the quote text..."
                  required
                  value={formText}
                  onChange={e => setFormText(e.target.value)}
                  style={{ minHeight: '100px' }}
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-user" style={{ marginRight: '0.5em' }}></i>Author</label>
                <input
                  className="input"
                  placeholder="Enter the author name..."
                  value={formAuthor}
                  onChange={e => setFormAuthor(e.target.value)}
                />
              </div>
              <div className="actions">
                <button className="button primary" type="submit" style={{ fontSize: '0.7em', textTransform: 'uppercase' }}>
                  <i className="fas fa-save" style={{ marginRight: '0.5em' }}></i>
                  {modalType === 'create' ? 'Add Quote' : 'Save Changes'}
                </button>
                <button 
                  className="button" 
                  type="button" 
                  onClick={closeModal}
                  style={{ fontSize: '0.7em', textTransform: 'uppercase' }}
                >
                  <i className="fas fa-times" style={{ marginRight: '0.5em' }}></i>Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
