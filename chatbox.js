/**
 * Rexa Music School — AI Chatbox Widget
 * AI: Claude Haiku (Anthropic) via direct fetch — no SDK required
 * Features: Local FAQ instant answers + Claude fallback + live suggestions while typing
 *
 * ➜ To edit FAQ answers, AI instructions, or UI text:
 *   Open chatbox-config.js — no need to touch this file.
 */

import { FAQ, SYSTEM_PROMPT, WHATSAPP_URL, UI, QUICK_REPLIES } from './chatbox-config.js';

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const getApiKey = () => {
    try {
        if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CLAUDE_API_KEY) {
            return import.meta.env.VITE_CLAUDE_API_KEY;
        }
    } catch (e) {}
    return '';
};

const CLAUDE_API_KEY = getApiKey();
const MODEL = 'claude-haiku-4-5-20251001';

const getSheetsUrl = () => {
    try {
        if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SHEETS_LOG_URL) {
            return import.meta.env.VITE_SHEETS_LOG_URL;
        }
    } catch (e) {}
    return '';
};

const SHEETS_LOG_URL = getSheetsUrl();

// Random ID to group messages from the same chat session
const SESSION_ID = Math.random().toString(36).slice(2, 10);

// SYSTEM_PROMPT, FAQ, WHATSAPP_URL, UI, QUICK_REPLIES → imported from chatbox-config.js

// ─── SUGGESTION MATCHING ──────────────────────────────────────────────────────

const getSuggestions = (query) => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase().trim();
    const words = q.split(/\s+/).filter(w => w.length >= 2);

    return FAQ.map(faq => {
        let score = 0;
        for (const kw of faq.keywords) {
            if (q.includes(kw))          score += 3;
            else for (const w of words) {
                if (kw.startsWith(w))    score += 2;
                else if (kw.includes(w) || w.includes(kw)) score += 1;
            }
        }
        return { faq, score };
    })
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map(x => x.faq);
};

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

    :root {
        --rms-red: #8B0000;
        --rms-white: #FFFFFF;
        --rms-bg: #f7f7f7;
        --rms-text: #2a2a2a;
        --rms-muted: #777;
        --rms-shadow: 0 12px 30px rgba(0,0,0,0.18);
        --rms-ease: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    #rms-chat-widget {
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 9999;
        font-family: 'Montserrat', sans-serif;
    }

    /* ── Trigger Button ── */
    #rms-chat-trigger {
        width: 58px;
        height: 58px;
        background-color: var(--rms-red);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: var(--rms-shadow);
        transition: var(--rms-ease);
        position: relative;
        border: none;
    }

    #rms-chat-trigger:hover { transform: scale(1.08); }
    #rms-chat-trigger svg { width: 26px; height: 26px; fill: white; }

    #rms-chat-trigger.pulse::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: var(--rms-red);
        opacity: 0.5;
        z-index: -1;
        animation: rms-pulse 2.2s infinite;
    }

    @keyframes rms-pulse {
        0%   { transform: scale(1);   opacity: 0.5; }
        100% { transform: scale(1.7); opacity: 0; }
    }

    #rms-unread-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #e53e3e;
        color: white;
        font-size: 10px;
        font-weight: 700;
        width: 19px;
        height: 19px;
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
    }

    /* ── Chat Window ── */
    #rms-chat-window {
        position: absolute;
        bottom: 74px;
        right: 0;
        width: 355px;
        height: 530px;
        background: var(--rms-white);
        border-radius: 20px;
        box-shadow: var(--rms-shadow);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: translateY(18px) scale(0.92);
        opacity: 0;
        pointer-events: none;
        transition: var(--rms-ease);
        transform-origin: bottom right;
    }

    #rms-chat-window.active {
        transform: translateY(0) scale(1);
        opacity: 1;
        pointer-events: all;
    }

    /* ── Header ── */
    #rms-chat-header {
        background: var(--rms-red);
        padding: 16px 18px;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
    }

    .rms-header-left { display: flex; align-items: center; gap: 11px; }

    .rms-header-avatar {
        width: 34px;
        height: 34px;
        background: rgba(255,255,255,0.18);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .rms-header-info h3 { margin: 0; font-size: 14px; font-weight: 700; }
    .rms-header-info p  { margin: 2px 0 0; font-size: 11px; opacity: 0.85; }

    .rms-online-dot {
        display: inline-block;
        width: 7px; height: 7px;
        background: #68d391;
        border-radius: 50%;
        margin-right: 4px;
        vertical-align: middle;
    }

    #rms-chat-close {
        background: rgba(255,255,255,0.15);
        border: none;
        color: white;
        cursor: pointer;
        width: 28px; height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--rms-ease);
        flex-shrink: 0;
    }

    #rms-chat-close:hover { background: rgba(255,255,255,0.3); }

    /* ── Messages ── */
    #rms-chat-messages {
        flex: 1;
        padding: 14px 14px 8px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: var(--rms-bg);
        min-height: 0;
        scroll-behavior: smooth;
    }

    #rms-chat-messages::-webkit-scrollbar { width: 3px; }
    #rms-chat-messages::-webkit-scrollbar-track { background: transparent; }
    #rms-chat-messages::-webkit-scrollbar-thumb { background: #d0d0d0; border-radius: 2px; }

    .rms-msg {
        max-width: 83%;
        padding: 9px 13px;
        border-radius: 16px;
        font-size: 13px;
        line-height: 1.55;
        animation: rms-pop 0.18s ease-out;
    }

    @keyframes rms-pop {
        from { transform: scale(0.94); opacity: 0.6; }
        to   { transform: scale(1);    opacity: 1; }
    }

    .rms-msg-bot {
        align-self: flex-start;
        background: white;
        color: var(--rms-text);
        border-bottom-left-radius: 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.07);
    }

    .rms-msg-user {
        align-self: flex-end;
        background: var(--rms-red);
        color: white;
        border-bottom-right-radius: 4px;
    }

    .rms-timestamp {
        font-size: 9.5px;
        color: var(--rms-muted);
        margin-top: 5px;
        display: block;
    }

    .rms-msg-user .rms-timestamp { color: rgba(255,255,255,0.6); text-align: right; }

    /* Typing bubble (appended dynamically inside messages) */
    .rms-typing-bubble {
        align-self: flex-start;
        background: white;
        padding: 10px 14px;
        border-radius: 16px;
        border-bottom-left-radius: 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.07);
    }

    .rms-dots { display: flex; gap: 4px; }

    .rms-dot {
        width: 6px; height: 6px;
        background: #bbb;
        border-radius: 50%;
        animation: rms-bounce 1.3s infinite ease-in-out both;
    }

    .rms-dot:nth-child(1) { animation-delay: -0.32s; }
    .rms-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes rms-bounce {
        0%, 80%, 100% { transform: scale(0); }
        40%           { transform: scale(1); }
    }

    /* CTA button inside bot messages */
    .rms-context-btn {
        display: inline-block;
        margin-top: 9px;
        background: var(--rms-red);
        color: white !important;
        padding: 6px 13px;
        border-radius: 7px;
        font-size: 11.5px;
        font-weight: 700;
        text-decoration: none !important;
        transition: var(--rms-ease);
    }

    .rms-context-btn:hover { opacity: 0.85; transform: translateY(-1px); }

    /* ── Quick Replies ── */
    #rms-quick-replies {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 9px 14px 11px;
        background: var(--rms-bg);
        border-top: 1px solid rgba(0,0,0,0.05);
        flex-shrink: 0;
    }

    .rms-quick-btn {
        background: white;
        border: 1.5px solid var(--rms-red);
        color: var(--rms-red);
        padding: 5px 11px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: var(--rms-ease);
        font-family: inherit;
    }

    .rms-quick-btn:hover { background: var(--rms-red); color: white; }

    /* ── Suggestions Panel ── */
    #rms-suggestions {
        background: white;
        border-top: 1px solid rgba(0,0,0,0.06);
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.22s ease;
        flex-shrink: 0;
    }

    #rms-suggestions.active { max-height: 190px; overflow-y: auto; }

    #rms-suggestions::-webkit-scrollbar { width: 3px; }
    #rms-suggestions::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 2px; }

    .rms-suggest-label {
        padding: 7px 14px 3px;
        font-size: 9.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        color: #aaa;
    }

    .rms-suggest-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        cursor: pointer;
        font-size: 12px;
        color: var(--rms-text);
        border-top: 1px solid rgba(0,0,0,0.04);
        font-family: inherit;
        background: none;
        border-left: none;
        border-right: none;
        border-bottom: none;
        text-align: left;
        width: 100%;
        transition: background 0.12s ease, color 0.12s ease;
    }

    .rms-suggest-item:first-of-type { border-top: none; }
    .rms-suggest-item:hover { background: #fff5f5; color: var(--rms-red); }

    .rms-suggest-item svg { flex-shrink: 0; color: #ccc; transition: color 0.12s ease; }
    .rms-suggest-item:hover svg { color: var(--rms-red); }

    /* ── Input Area ── */
    #rms-chat-input-container {
        padding: 11px 14px;
        border-top: 1px solid rgba(0,0,0,0.07);
        display: flex;
        gap: 8px;
        align-items: flex-end;
        background: white;
        flex-shrink: 0;
    }

    #rms-chat-input {
        flex: 1;
        border: 1.5px solid #e8e8e8;
        border-radius: 18px;
        outline: none;
        font-family: inherit;
        font-size: 12.5px;
        resize: none;
        max-height: 72px;
        padding: 7px 13px;
        line-height: 1.45;
        color: var(--rms-text);
        background: #fafafa;
        transition: border-color 0.2s ease;
    }

    #rms-chat-input:focus { border-color: var(--rms-red); background: white; }
    #rms-chat-input::placeholder { color: #c0c0c0; }

    #rms-chat-send {
        background: var(--rms-red);
        border: none;
        color: white;
        cursor: pointer;
        width: 34px; height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: var(--rms-ease);
    }

    #rms-chat-send:hover   { background: #6a0000; transform: scale(1.06); }
    #rms-chat-send:disabled { opacity: 0.45; cursor: default; transform: none; }
    #rms-chat-send svg { width: 15px; height: 15px; fill: white; }

    /* ── Mobile ── */
    @media (max-width: 768px) {
        #rms-chat-widget { bottom: 18px; right: 16px; }

        #rms-chat-window {
            position: fixed;
            bottom: 0; right: 0; left: 0;
            width: 100%;
            height: 91dvh;
            border-radius: 20px 20px 0 0;
            transform: translateY(100%);
        }

        #rms-chat-window.active { transform: translateY(0); }
    }
`;

// ─── HTML ─────────────────────────────────────────────────────────────────────

const quickReplyHTML = QUICK_REPLIES.map(r =>
    `<button class="rms-quick-btn" data-faq="${r.faqId}">${r.label}</button>`
).join('\n            ');

const widgetHTML = `
    <button id="rms-chat-trigger" class="pulse" aria-label="Buka chat RMS">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        <div id="rms-unread-badge" aria-hidden="true">1</div>
    </button>

    <div id="rms-chat-window" role="dialog" aria-label="Rexa Music School Chat">
        <div id="rms-chat-header">
            <div class="rms-header-left">
                <div class="rms-header-avatar" aria-hidden="true">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
                        <path d="M9 18V5l12-2v13M6 21a2 2 0 100-4 2 2 0 000 4zm12-2a2 2 0 100-4 2 2 0 000 4z"/>
                    </svg>
                </div>
                <div class="rms-header-info">
                    <h3>${UI.headerTitle}</h3>
                    <p><span class="rms-online-dot" aria-hidden="true"></span>${UI.headerSubtitle}</p>
                </div>
            </div>
            <button id="rms-chat-close" aria-label="Tutup chat">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>

        <div id="rms-chat-messages" aria-live="polite" aria-relevant="additions"></div>

        <div id="rms-quick-replies" aria-label="Pertanyaan populer">
            ${quickReplyHTML}
        </div>

        <div id="rms-suggestions" role="listbox" aria-label="${UI.suggestionsLabel}"></div>

        <div id="rms-chat-input-container">
            <textarea
                id="rms-chat-input"
                placeholder="${UI.inputPlaceholder}"
                rows="1"
                aria-label="Ketik pesan"
                autocomplete="off"
            ></textarea>
            <button id="rms-chat-send" aria-label="Kirim pesan">
                <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
        </div>
    </div>
`;

// ─── INJECT ───────────────────────────────────────────────────────────────────

const widgetEl = document.createElement('div');
widgetEl.id = 'rms-chat-widget';
widgetEl.innerHTML = widgetHTML;
document.body.appendChild(widgetEl);

const styleEl = document.createElement('style');
styleEl.textContent = styles;
document.head.appendChild(styleEl);

// ─── DOM REFS ─────────────────────────────────────────────────────────────────

const triggerEl     = document.getElementById('rms-chat-trigger');
const windowEl      = document.getElementById('rms-chat-window');
const closeBtn      = document.getElementById('rms-chat-close');
const messagesEl    = document.getElementById('rms-chat-messages');
const quickReplies  = document.getElementById('rms-quick-replies');
const suggestionsEl = document.getElementById('rms-suggestions');
const inputEl       = document.getElementById('rms-chat-input');
const sendBtn       = document.getElementById('rms-chat-send');
const badge         = document.getElementById('rms-unread-badge');

// ─── STATE ────────────────────────────────────────────────────────────────────

let isOpen           = false;
let firstInteraction = false;
let chatHistory      = []; // Claude format: [{role: "user"|"assistant", content: "..."}]
let typingBubble     = null;
let suggestTimer     = null;

// ─── UTILITIES ────────────────────────────────────────────────────────────────

const now = () => new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const escHtml = (str) =>
    String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');

const scrollBottom = () => {
    messagesEl.scrollTop = messagesEl.scrollHeight;
};

const trimHistory = () => {
    // Keep last 10 messages (5 turns). Always trim from the front in pairs.
    while (chatHistory.length > 10) chatHistory.splice(0, 2);
};

// ─── SHEETS LOGGER ────────────────────────────────────────────────────────────

/**
 * Fire-and-forget: logs a single message row to Google Sheets via Apps Script.
 * Uses a GET request with no-cors so it never blocks the UI and needs no CORS config.
 * @param {'user'|'bot'} role
 * @param {string} message
 * @param {'faq'|'claude'} source
 */
const logToSheets = (role, message, source = 'claude') => {
    if (!SHEETS_LOG_URL) return;
    try {
        const params = new URLSearchParams({
            ts:      new Date().toISOString(),
            session: SESSION_ID,
            role,
            message,
            source,
            page:    window.location.href,
        });
        // Use an Image pixel instead of fetch.
        // Image requests bypass CORS entirely, follow Apps Script redirects automatically,
        // and preserve all query params — works reliably from any deployed domain.
        const img = new Image();
        img.src = `${SHEETS_LOG_URL}?${params}`;
    } catch (e) {
        // logging must never break the chat
    }
};

// ─── MESSAGE RENDERING ────────────────────────────────────────────────────────

const addUserMessage = (text) => {
    const el = document.createElement('div');
    el.className = 'rms-msg rms-msg-user';
    el.innerHTML = `${escHtml(text)}<span class="rms-timestamp">${now()}</span>`;
    messagesEl.appendChild(el);
    scrollBottom();

    logToSheets('user', text);

    if (!firstInteraction) {
        quickReplies.style.display = 'none';
        firstInteraction = true;
    }
};

const addBotMessage = (text, cta = null) => {
    // Remove typing bubble if present
    if (typingBubble) { typingBubble.remove(); typingBubble = null; }

    const el = document.createElement('div');
    el.className = 'rms-msg rms-msg-bot';

    // Determine CTA button
    let ctaHtml = '';
    if (cta) {
        ctaHtml = `<br><a href="${cta.href}" class="rms-context-btn" target="_blank" rel="noopener">${escHtml(cta.label)} →</a>`;
    } else if (/free trial|daftar sekarang|booking/i.test(text)) {
        ctaHtml = `<br><a href="${WHATSAPP_URL}" class="rms-context-btn" target="_blank" rel="noopener">Book Free Trial →</a>`;
    }

    el.innerHTML = `${escHtml(text)}${ctaHtml}<span class="rms-timestamp">${now()}</span>`;
    messagesEl.appendChild(el);
    scrollBottom();
};

const showTyping = () => {
    if (typingBubble) return;
    typingBubble = document.createElement('div');
    typingBubble.className = 'rms-typing-bubble';
    typingBubble.innerHTML = `<div class="rms-dots">
        <div class="rms-dot"></div>
        <div class="rms-dot"></div>
        <div class="rms-dot"></div>
    </div>`;
    messagesEl.appendChild(typingBubble);
    scrollBottom();
};

const hideTyping = () => {
    if (typingBubble) { typingBubble.remove(); typingBubble = null; }
};

// ─── SUGGESTIONS ─────────────────────────────────────────────────────────────

const renderSuggestions = (items) => {
    if (!items.length) { hideSuggestions(); return; }

    suggestionsEl.innerHTML =
        `<div class="rms-suggest-label">${UI.suggestionsLabel}</div>` +
        items.map(f => `
            <button class="rms-suggest-item" data-faq-id="${f.id}" role="option">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                ${escHtml(f.question)}
            </button>
        `).join('');

    suggestionsEl.classList.add('active');

    suggestionsEl.querySelectorAll('.rms-suggest-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const faq = FAQ.find(f => f.id === btn.dataset.faqId);
            if (faq) instantAnswer(faq);
        });
    });
};

const hideSuggestions = () => {
    suggestionsEl.classList.remove('active');
    clearTimeout(suggestTimer);
};

// ─── INSTANT ANSWER (local FAQ — no API call) ─────────────────────────────────

const instantAnswer = (faq) => {
    inputEl.value = '';
    inputEl.style.height = 'auto';
    hideSuggestions();

    addUserMessage(faq.question);
    chatHistory.push({ role: 'user', content: faq.question });

    showTyping();
    setTimeout(() => {
        addBotMessage(faq.answer, faq.cta);
        chatHistory.push({ role: 'assistant', content: faq.answer });
        trimHistory();
        logToSheets('bot', faq.answer, 'faq');
    }, 320);
};

// ─── CLAUDE API ───────────────────────────────────────────────────────────────

const callClaude = async (userMsg) => {
    chatHistory.push({ role: 'user', content: userMsg });
    trimHistory();

    showTyping();
    sendBtn.disabled = true;

    // No API key configured — fall back to closest FAQ or default message
    if (!CLAUDE_API_KEY) {
        setTimeout(() => {
            const matches = getSuggestions(userMsg);
            if (matches.length) {
                addBotMessage(matches[0].answer, matches[0].cta);
                chatHistory.push({ role: 'assistant', content: matches[0].answer });
            } else {
                const fallback = 'Untuk info lebih lanjut, tim kami siap membantu via WhatsApp ya! 📱';
                addBotMessage(fallback, { label: 'Chat WhatsApp', href: 'https://wa.me/628123456789' });
                chatHistory.push({ role: 'assistant', content: fallback });
            }
            sendBtn.disabled = false;
        }, 300);
        return;
    }

    try {
        const resp = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 300,
                system: SYSTEM_PROMPT,
                messages: chatHistory,
            }),
        });

        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.error?.message || `HTTP ${resp.status}`);
        }

        const data = await resp.json();
        const text = data.content?.[0]?.text?.trim();

        if (text) {
            addBotMessage(text);
            chatHistory.push({ role: 'assistant', content: text });
            logToSheets('bot', text, 'claude');
        } else {
            throw new Error('Empty response');
        }
    } catch (e) {
        console.error('[RMS Chat] Claude error:', e);
        chatHistory.pop(); // remove unresponded user message
        if (/rate.?limit|overload/i.test(e.message)) {
            addBotMessage('Kami sedang ramai! Coba lagi dalam beberapa detik ya 😊');
        } else {
            addBotMessage(
                'Maaf, ada gangguan teknis. Hubungi kami langsung via WhatsApp ya! 🙏',
                { label: 'Chat WhatsApp', href: WHATSAPP_URL }
            );
        }
    } finally {
        hideTyping();
        sendBtn.disabled = false;
    }
};

// ─── SEND ─────────────────────────────────────────────────────────────────────

const handleSend = () => {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    inputEl.style.height = 'auto';
    hideSuggestions();
    addUserMessage(text);
    callClaude(text);
};

// ─── TOGGLE ───────────────────────────────────────────────────────────────────

const toggleChat = () => {
    isOpen = !isOpen;
    windowEl.classList.toggle('active', isOpen);

    if (isOpen) {
        badge.style.display = 'none';
        triggerEl.classList.remove('pulse');
        inputEl.focus();

        if (messagesEl.children.length === 0) {
            addBotMessage(UI.welcomeMessage);
            chatHistory.push({ role: 'assistant', content: UI.welcomeMessage });
        }
    } else {
        hideSuggestions();
    }
};

// ─── EVENTS ───────────────────────────────────────────────────────────────────

triggerEl.addEventListener('click', toggleChat);
closeBtn.addEventListener('click', toggleChat);
sendBtn.addEventListener('click', handleSend);

inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    if (e.key === 'Escape') hideSuggestions();
});

inputEl.addEventListener('input', () => {
    // Auto-resize textarea
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 72) + 'px';

    // Debounced suggestion lookup (pure local — no API call)
    clearTimeout(suggestTimer);
    const val = inputEl.value.trim();
    if (val.length < 2) { hideSuggestions(); return; }
    suggestTimer = setTimeout(() => renderSuggestions(getSuggestions(val)), 140);
});

// Quick reply buttons → instant local answers
document.querySelectorAll('.rms-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const faq = FAQ.find(f => f.id === btn.dataset.faq);
        if (faq) {
            instantAnswer(faq);
        } else {
            const text = btn.textContent.trim();
            if (!firstInteraction) { quickReplies.style.display = 'none'; firstInteraction = true; }
            addUserMessage(text);
            callClaude(text);
        }
    });
});

// Show badge after 3 s to attract attention
setTimeout(() => { if (!isOpen) badge.style.display = 'flex'; }, 3000);
