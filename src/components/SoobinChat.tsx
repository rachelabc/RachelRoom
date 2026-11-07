import React, { useEffect, useId, useRef, useState } from 'react';
import { Send, X, Heart, PawPrint } from 'lucide-react';
import { useDialog } from '../utils/useDialog';

const GREETING = 'Meow meow! I am Soobin. Chat with me to learn more about Rachel!';
const STORAGE_KEY = 'rachel_soobin_chat_v1';
type Message = { role: 'user' | 'assistant'; content: string };

function readHistory(): Message[] {
  try {
    const value = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(value) || value.length > 40 || value.length % 2 !== 0) return [];
    if (!value.every((m, i) => m?.role === (i % 2 ? 'assistant' : 'user') && typeof m.content === 'string' && m.content.length <= (i % 2 ? 2000 : 1000))) return [];
    return value;
  } catch { return []; }
}

export function SoobinFace() {
  return <svg viewBox="0 0 32 32" className="soobin-face" shapeRendering="crispEdges" aria-hidden="true">
    <path fill="#201b29" d="M4 3h6v3h12V3h6v8h2v14h-3v3H5v-3H2V11h2z" />
    <path fill="#edb5c8" d="M6 5h2v5H6zm18 0h2v5h-2z" />
    <path fill="#fbf7ee" d="M14 11h4v7h3v5h4v3H7v-3h4v-5h3z" />
    <path fill="#a3d977" d="M7 13h5v3H7zm13 0h5v3h-5z" />
    <path fill="#201b29" d="M9 13h2v3H9zm12 0h2v3h-2z" />
    <path fill="#ee9fbc" d="M14 18h4v2h-4z" />
    <path fill="#201b29" d="M15 20h2v2h-2zm-3 2h3v1h-3zm5 0h3v1h-3z" />
    <path fill="#d8c6dd" d="M1 18h8v1H1zm22 0h8v1h-8zM2 21h7v1H2zm21 0h7v1h-7z" />
  </svg>;
}

function MobileDialog({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  const ref = useDialog(onClose);
  const [viewport, setViewport] = useState({ top: 0, height: window.visualViewport?.height ?? window.innerHeight });
  useEffect(() => {
    const update = () => setViewport({ top: window.visualViewport?.offsetTop ?? 0, height: window.visualViewport?.height ?? window.innerHeight });
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
    update();
    return () => {
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
    };
  }, []);
  return <div className="soobin-mobile-backdrop" style={{ top: viewport.top, height: viewport.height }} onClick={onClose}>
    <div ref={ref} role="dialog" aria-modal="true" aria-label="Chat with Soobin" tabIndex={-1} className={`soobin-mobile-dialog ${viewport.height < 500 ? 'is-compact' : ''}`} onClick={e => e.stopPropagation()}>{children}</div>
  </div>;
}

export function SoobinChat({ open, onOpen, onClose, onPetAndFeed, obscured }: {
  open: boolean; onOpen: () => void; onClose: () => void; onPetAndFeed: () => void; obscured: boolean;
}) {
  const [mobile, setMobile] = useState(() => !window.matchMedia('(min-width: 1100px)').matches);
  const [messages, setMessages] = useState<Message[]>(readHistory);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const logRef = useRef<HTMLDivElement>(null);
  const reopenRef = useRef<HTMLButtonElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const pendingRef = useRef(false);
  const titleId = useId();
  const errorId = useId();
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1100px)');
    const update = () => setMobile(!media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => () => controllerRef.current?.abort(), []);
  useEffect(() => {
    if (mobile || !open || obscured) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); onClose(); }
    };
    window.addEventListener('keydown', closeOnEscape, true);
    return () => window.removeEventListener('keydown', closeOnEscape, true);
  }, [mobile, open, obscured, onClose]);
  useEffect(() => { if (!open && !mobile) reopenRef.current?.focus({ preventScroll: true }); }, [open, mobile]);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, busy, open, mobile]);

  const send = async (question = draft) => {
    const content = question.trim();
    if (pendingRef.current || !content || content.length > 1000) return;
    pendingRef.current = true;
    setBusy(true); setError(''); setDraft('');
    const next: Message[] = [...messages, { role: 'user', content }];
    setMessages(next);
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 25_000);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-11) }), signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || typeof result.reply !== 'string') throw new Error(result.error || 'My whiskers lost the connection. Please try again.');
      const completed: Message[] = [...next, { role: 'assistant' as const, content: result.reply }].slice(-40);
      setMessages(completed);
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(completed)); } catch { /* Chat still works if storage is unavailable. */ }
    } catch (error) {
      setMessages(messages);
      setDraft(content);
      setError(error instanceof Error && error.name !== 'AbortError' ? error.message : 'My reply took too long. Your question is ready to send again.');
    } finally {
      window.clearTimeout(timeout);
      setBusy(false); pendingRef.current = false;
    }
  };

  const panel = <section className="soobin-panel pixel-box" aria-labelledby={titleId} onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } }}>
    <header className="soobin-header">
      <SoobinFace />
      <div className="min-w-0"><h2 id={titleId} className="font-pixel">Soobin's corner</h2><p>Your AI cat guide · meow!</p></div>
      <button type="button" onClick={onClose} aria-label="Close Soobin chat" className="soobin-close"><X size={18} /></button>
    </header>
    <div className="soobin-chat-actions">
      <button type="button" onClick={onPetAndFeed}><Heart size={14} /> Pet & feed</button>
      <button type="button" disabled={busy || !messages.length} onClick={() => { setMessages([]); setError(''); try { sessionStorage.removeItem(STORAGE_KEY); } catch {} }}>New chat</button>
    </div>
    <div ref={logRef} className="soobin-messages" role="log" aria-label="Conversation with Soobin" aria-live="polite" aria-relevant="additions" tabIndex={0}>
      <div className="soobin-message assistant"><span className="soobin-speaker">Soobin</span><p>{GREETING}</p></div>
      {messages.map((m, i) => <div key={i} className={`soobin-message ${m.role}`}><span className="soobin-speaker">{m.role === 'user' ? 'You' : 'Soobin'}</span><p>{m.content}</p></div>)}
      {busy && <p role="status" className="soobin-thinking">Paws on keyboard…</p>}
    </div>
    {!messages.length && !busy && <div className="soobin-suggestions">
      {['What does Rachel design?', 'What’s her favorite boba?'].map(q => <button type="button" key={q} onClick={() => send(q)}>{q}</button>)}
    </div>}
    <form className="soobin-composer" onSubmit={e => { e.preventDefault(); send(); }}>
      {error && <p id={errorId} role="alert" className="soobin-error">{error} Your question is below; send it again to retry.</p>}
      <label htmlFor="soobin-question" className="font-pixel">Ask Soobin</label>
      <div className="soobin-input-row">
        <textarea id="soobin-question" value={draft} maxLength={1000} rows={2} placeholder="Ask about Rachel…" disabled={busy} aria-describedby={error ? errorId : undefined}
          onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }} />
        <button type="submit" className="pixel-wood-button" disabled={busy || !draft.trim()} aria-label="Send message"><Send size={18} /></button>
      </div>
      <p className="soobin-disclosure">AI replies can make mistakes. Chats go to Google Gemini. Please avoid sharing private information.</p>
    </form>
  </section>;

  if (mobile) return <>
    {!obscured && !open && <button type="button" className="soobin-bubble" onClick={onOpen} aria-label="Chat with Soobin" title="Chat with Soobin"><SoobinFace /><span aria-hidden="true">♥</span><span className="soobin-chat-hint" aria-hidden="true">Chat!</span></button>}
    {!obscured && open && <MobileDialog onClose={onClose}>{panel}</MobileDialog>}
  </>;
  return <aside className={`soobin-desktop ${open ? '' : 'is-closed'}`} aria-label="Soobin chat">
    {open ? panel : <button ref={reopenRef} type="button" className="soobin-reopen pixel-wood-button" onClick={onOpen}><SoobinFace /><PawPrint size={16} /> Chat with Soobin</button>}
  </aside>;
}
