import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Registration failed' }));
        
        // Check if backend sends specific field errors
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else if (errorData.message) {
          // If it's a general error message
          setErrors({ general: errorData.message });
        } else {
          setErrors({ general: 'Registration failed. Please try again.' });
        }
      }
    } catch (error) {
      setErrors({ general: 'Network error occurred. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f8f8f8'
    }}>
      <div className="form-container" style={{ 
        background: '#ffffff', 
        borderRadius: '4px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
        padding: '3em', 
        minWidth: '400px', 
        maxWidth: '500px', 
        width: '90%',
        border: '1px solid #e0e0e0'
      }}>
        <header className="header" style={{ marginBottom: '2em' }}>
          <h1><i className="fas fa-user-plus" style={{ marginRight: '0.5em', color: '#f2849e' }}></i>Join Us</h1>
          <p>Create an account to start collecting quotes</p>
        </header>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><i className="fas fa-envelope" style={{ marginRight: '0.5em' }}></i>Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="Enter your email..."
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {errors.email && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.9em',
                marginTop: '0.5em',
                padding: '0.5em',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '4px'
              }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.3em' }}></i>
                {errors.email}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label><i className="fas fa-lock" style={{ marginRight: '0.5em' }}></i>Password</label>
            <input
              className="input"
              type="password"
              placeholder="Create a password..."
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {errors.password && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.9em',
                marginTop: '0.5em',
                padding: '0.5em',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '4px'
              }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.3em' }}></i>
                {errors.password}
              </div>
            )}
          </div>

          {/* General error message */}
          {errors.general && (
            <div style={{
              color: '#ef4444',
              fontSize: '0.9em',
              marginBottom: '1em',
              padding: '0.5em',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.3em' }}></i>
              {errors.general}
            </div>
          )}
          
          <div className="actions">
            <button 
              className="button primary" 
              type="submit" 
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5em' }}></i>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus" style={{ marginRight: '0.5em' }}></i>
                  Create Account
                </>
              )}
            </button>
          </div>
          
          <div style={{ 
            marginTop: '2em', 
            textAlign: 'center', 
            fontSize: '1em',
            color: '#585858'
          }}>
            Already have an account?{' '}
            <a href="/login" style={{ 
              color: '#f2849e', 
              textDecoration: 'none',
              borderBottom: '1px dotted #f2849e'
            }}>
              <i className="fas fa-sign-in-alt" style={{ marginRight: '0.3em' }}></i>Sign in here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}