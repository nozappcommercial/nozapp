import re

with open('page.tsx', 'r') as f:
    code = f.read()

# 1. Add handleOAuth
handle_oauth_code = """
  const handleOAuth = async (provider: 'google' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (err: unknown) {
      setAlert({ type: 'error', message: err instanceof Error ? err.message : 'Errore OAuth' });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
"""

code = code.replace("  const handleSubmit = async (e: FormEvent) => {", handle_oauth_code)

# 2. Add Icons
icons_code = """function EyeIcon({ off }: { off?: boolean }) {
// ...
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.365 7.733c-.022 3.02 2.64 4.043 2.663 4.053-.024.08-4.22 13.064-9.332 13.064-2.454 0-3.3-1.554-6.023-1.554-2.73 0-3.714 1.51-6.024 1.554C-4.116 24.897-6.2 16.14 0.945 8.164 2.89 6.002 5.405 4.672 7.828 4.672c2.41 0 3.86 1.48 5.768 1.48 2.062 0 3.86-1.63 6.014-1.63 1.94-.038 4.26 1.05 5.516 2.89C23.084 9.49 19.333 11.236 16.365 7.733zM12.72 3.193C11.53 4.63 9.4 5.6 7.425 5.337c.29-2.06 1.487-4.14 2.88-5.337 1.144-1.026 3.16-1.927 5.09-1.927-.245 1.874-.963 3.664-2.677 5.12z" />
    </svg>
  );
}
"""
code = code.replace("function EyeIcon({ off }: { off?: boolean }) {", icons_code)

# 3. Add to UI
old_submit = """                  <button type="submit" className="btn-submit" disabled={loading} style={{ animation: `slideIn 0.4s ease forwards`, animationDelay: view === 'register' ? '400ms' : '200ms', opacity: 0 }}>
                    {loading ? <div className="spinner" /> : view === 'login' ? 'Entra nella Sfera' : 'Crea Account'}
                  </button>"""

new_submit = """                  <button type="submit" className="btn-submit" disabled={loading} style={{ animation: `slideIn 0.4s ease forwards`, animationDelay: view === 'register' ? '400ms' : '200ms', opacity: 0 }}>
                    {loading ? <div className="spinner" /> : view === 'login' ? 'Entra nella Sfera' : 'Crea Account'}
                  </button>
                  
                  <div className="oauth-divider" style={{ animation: `slideIn 0.4s ease forwards`, animationDelay: view === 'register' ? '500ms' : '300ms', opacity: 0 }}>
                    <span>oppure continua con</span>
                  </div>

                  <div className="oauth-buttons" style={{ animation: `slideIn 0.4s ease forwards`, animationDelay: view === 'register' ? '600ms' : '400ms', opacity: 0 }}>
                    <button type="button" className="btn-oauth google" onClick={() => handleOAuth('google')} disabled={loading}>
                      <GoogleIcon /> Google
                    </button>
                    <button type="button" className="btn-oauth apple" onClick={() => handleOAuth('apple')} disabled={loading}>
                      <AppleIcon /> Apple
                    </button>
                  </div>"""

code = code.replace(old_submit, new_submit)

# 4. Add styles
old_css = """.btn-submit:disabled {"""
new_css = """.oauth-divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: var(--cold);
    font-size: 0.8rem;
    margin: 20px 0;
  }
  .oauth-divider::before, .oauth-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }
  .oauth-divider span {
    padding: 0 10px;
  }
  .oauth-buttons {
    display: flex;
    gap: 12px;
  }
  .btn-oauth {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 6px;
    background: white;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .btn-oauth:hover {
    background: #fafafa;
    border-color: rgba(0,0,0,0.2);
  }
  .btn-submit:disabled {"""

code = code.replace(old_css, new_css)

with open('page.tsx', 'w') as f:
    f.write(code)
