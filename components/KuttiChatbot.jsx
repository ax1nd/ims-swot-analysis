import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCRtsNYGzdgxBJCa1AWhEs0m5EV6cGSLDU';
// Models that are available for your API key (from ListModels)
const GEMINI_CONFIGS = [
  { version: 'v1beta', model: 'gemini-2.5-flash' },
  { version: 'v1beta', model: 'gemini-2.0-flash' },
  { version: 'v1beta', model: 'gemini-1.5-flash' }
];
function getGeminiUrl(version, model) {
  return `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
}

const KUTTI_SYSTEM_PROMPT = `You are KUTTI, a friendly and helpful chatbot for the RIT IMS (Institute Management System) student portal. Your role is to help new students understand and use the portal.

**Portal overview**
- RIT IMS is the student portal where students can view their academic info, timetable, attendance, fees, and more.

**Main sections (students access these from the left sidebar):**
1. **Dashboard** – Overview: CGPA, arrears, attendance summary, leaves. Quick view of today's schedule and stats.
2. **SWOT Analysis** – View your AI-generated SWOT (Strengths, Weaknesses, Opportunities, Threats) based on your CAT marks. Helps you understand where you stand.
3. **My Timetable** – Weekly class schedule: subjects, timings, and faculty. You can export it as PDF.
4. **Leave / OD** – Apply for leave or On-Duty (OD). Track leave balance and history.
5. **Attendance** – Check your attendance percentage and subject-wise attendance.
6. **CAT Mark** – Continuous Assessment Test marks. View your internal assessment scores.
7. **LAB Mark** – Lab assessment marks and grades.
8. **Academic Fee** – Fee structure, payment status, and due amounts.

**How to help**
- Answer in a warm, clear, and concise way. Use simple language.
- When explaining a feature, tell them which menu item to click (e.g. "Click **My Timetable** in the left sidebar").
- If they ask how to do something (e.g. "How do I see my attendance?"), give step-by-step instructions.
- For general portal questions, explain the purpose of each section and how to navigate.
- If the question is not about the portal (e.g. unrelated topics), politely say you're here to help with the RIT IMS portal and suggest they ask about Dashboard, Timetable, Attendance, Fees, etc.
- Keep replies focused and not too long unless they ask for detail.`;

export default function KuttiChatbot({ currentTheme, darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "Hi! I'm KUTTI, your RIT IMS portal assistant. I can help you find your way around—Dashboard, Timetable, Attendance, Fees, SWOT Analysis, and more. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendToGemini = async (userText, history) => {
    const contents = [
      { role: 'user', parts: [{ text: `${KUTTI_SYSTEM_PROMPT}\n\n---\nThe student is now asking you something. Reply as KUTTI based on the instructions above.` }] },
      { role: 'model', parts: [{ text: "Understood! I'm KUTTI, ready to help with the RIT IMS portal. What would you like to know?" }] },
      ...history.map((m) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      })),
      { role: 'user', parts: [{ text: userText }] },
    ];

    const body = {
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    };

    let lastError;
    // Iterate through models. Stop completely if the API key is leaked or permission denied.
    for (const { version, model } of GEMINI_CONFIGS) {
      const url = getGeminiUrl(version, model);
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          const errMsg = err?.error?.message || `API error: ${res.status}`;

          // If the error is an API key issue, stop the loop immediately and throw it!
          if (res.status === 403 || res.status === 400) {
            if (errMsg.toLowerCase().includes("key") || errMsg.toLowerCase().includes("permission")) {
              throw new Error(errMsg);
            }
          }

          lastError = new Error(errMsg);
          continue; // Try next model if it's just a 404 (model not found)
        }

        const data = await res.json();
        const candidate = data?.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text?.trim();
        if (text) return text;
      } catch (e) {
        if (e.message.toLowerCase().includes("key") || e.message.toLowerCase().includes("permission")) {
          throw e; // immediately rethrow fatal API key errors
        }
        lastError = e;
      }
    }
    throw lastError || new Error('No model available. Check your API key at aistudio.google.com.');
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const history = [...messages, { role: 'user', text }];
      const reply = await sendToGemini(text, messages);
      setMessages((prev) => [...prev, { role: 'model', text: reply }]);
    } catch (err) {
      console.error("KUTTI Chatbot Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: "Oops! I'm taking a short break or experiencing network issues. Please try asking me again in a moment! 🤖",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95
          ${currentTheme.card} ${currentTheme.neoBorder} border-2
          ${darkMode ? 'shadow-blue-500/20 hover:shadow-blue-500/30' : 'shadow-slate-300'}`}
        title="Chat with KUTTI"
        aria-label="Open KUTTI chatbot"
      >
        <Bot className={`w-7 h-7 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} strokeWidth={2.5} />
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col
            ${currentTheme.card} ${currentTheme.neoBorder} border-2
            ${darkMode ? 'shadow-blue-500/10' : 'shadow-slate-300'}`}
          style={{ height: 'min(70vh, 520px)' }}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-4 py-3 border-b ${currentTheme.neoBorder} ${currentTheme.bg}`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}
              >
                <Bot className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h3 className={`font-bold ${currentTheme.textPrimary}`}>KUTTI</h3>
                <p className={`text-xs ${currentTheme.textSecondary}`}>Portal assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 ${currentTheme.textSecondary}`}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                    ${msg.role === 'user' ? (darkMode ? 'bg-slate-600' : 'bg-slate-200') : (darkMode ? 'bg-blue-500/20' : 'bg-blue-100')}`}
                >
                  {msg.role === 'user' ? (
                    <User size={16} className={darkMode ? 'text-slate-300' : 'text-slate-600'} />
                  ) : (
                    <Bot size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                  )}
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm
                    ${msg.role === 'user'
                      ? `rounded-tr-md ${darkMode ? 'bg-blue-500/30 text-slate-100' : 'bg-blue-500 text-white'}`
                      : `${currentTheme.card} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`}`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}
                >
                  <Bot size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <div className={`rounded-2xl px-4 py-2.5 ${currentTheme.card} ${currentTheme.neoBorder}`}>
                  <span className="inline-flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-3 border-t ${currentTheme.neoBorder} ${currentTheme.bg}`}>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the portal..."
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary} placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className={`p-2.5 rounded-xl flex items-center justify-center transition-all
                  ${input.trim() && !loading
                    ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25'
                    : `${currentTheme.textSecondary} bg-black/5 dark:bg-white/5 cursor-not-allowed`}`}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
