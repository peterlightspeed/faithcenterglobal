/*
  TFCG Ministry Assistant
  ------------------------------------------------------------
  Frontend-only assistant backed by a local JSON knowledge base
  (js/church-data.json). Matches visitor questions against a
  keyword-tagged FAQ list and surfaces the church's own content.

  TODO: To upgrade this assistant with a real AI backend, replace
  the matchAnswer() function below with a call to your API of
  choice (for example an OpenAI or Anthropic endpoint proxied
  through a server route). Keep the same input/output contract:
  matchAnswer(query) should resolve to { answer, page, linkText }
  so the rest of the widget UI requires no changes.
*/

(function () {
  let knowledgeBase = null;

  function loadKnowledgeBase() {
    if (knowledgeBase) return Promise.resolve(knowledgeBase);
    return fetch('js/church-data.json')
      .then((response) => response.json())
      .then((data) => {
        knowledgeBase = data;
        return data;
      })
      .catch(() => null);
  }

  function buildWidget() {
    const toggle = document.createElement('button');
    toggle.className = 'assistant-toggle';
    toggle.id = 'assistantToggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Open Ministry Assistant');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<i class="bi bi-chat-dots" aria-hidden="true"></i><span class="assistant-badge" aria-hidden="true"></span>';

    const panel = document.createElement('div');
    panel.className = 'assistant-panel';
    panel.id = 'assistantPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'TFCG Ministry Assistant');
    panel.innerHTML = `
      <div class="assistant-header">
        <div class="assistant-header-info">
          <span class="assistant-avatar" aria-hidden="true"><i class="bi bi-cross"></i></span>
          <div>
            <div class="assistant-name">TFCG Ministry Assistant</div>
            <div class="assistant-status">Online</div>
          </div>
        </div>
        <button type="button" class="assistant-close" id="assistantClose" aria-label="Close Ministry Assistant">
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      </div>
      <div class="assistant-messages" id="assistantMessages" role="log" aria-live="polite"></div>
      <div class="assistant-input-wrap">
        <input type="text" class="assistant-input" id="assistantInput" placeholder="Ask a question..." aria-label="Type your question">
        <button type="button" class="assistant-send" id="assistantSend" aria-label="Send message">
          <i class="bi bi-send-fill" aria-hidden="true"></i>
        </button>
      </div>
    `;

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    return { toggle, panel };
  }

  function addMessage(container, text, sender) {
    const msg = document.createElement('div');
    msg.className = 'msg ' + sender;
    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
    return msg;
  }

  function addQuickReplies(container, replies, onSelect) {
    const wrap = document.createElement('div');
    wrap.className = 'quick-replies';
    replies.forEach((label) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quick-reply-btn';
      btn.textContent = label;
      btn.addEventListener('click', () => onSelect(label));
      wrap.appendChild(btn);
    });
    container.appendChild(wrap);
    container.scrollTop = container.scrollHeight;
  }

  function addAnswerLink(container, page, linkText) {
    if (!page || !linkText) return;
    const link = document.createElement('a');
    link.href = page;
    link.className = 'quick-reply-btn';
    link.style.display = 'inline-block';
    link.style.marginTop = '0.5rem';
    link.textContent = linkText;
    container.appendChild(link);
    container.scrollTop = container.scrollHeight;
  }

  function matchAnswer(query, data) {
    const normalized = query.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    data.faq.forEach((entry) => {
      let score = 0;
      entry.keywords.forEach((keyword) => {
        if (normalized.includes(keyword.toLowerCase())) {
          score += keyword.length;
        }
      });
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    });

    if (bestMatch) {
      return { answer: bestMatch.answer, page: bestMatch.page, linkText: bestMatch.linkText };
    }
    return { answer: data.fallback, page: null, linkText: null };
  }

  function handleUserQuery(query, data, messagesEl) {
    addMessage(messagesEl, query, 'user');
    const result = matchAnswer(query, data);
    setTimeout(() => {
      addMessage(messagesEl, result.answer, 'bot');
      if (result.page) {
        addAnswerLink(messagesEl, result.page, result.linkText);
      }
    }, 350);
  }

  function initAssistant() {
    const { toggle, panel } = buildWidget();
    const closeBtn = panel.querySelector('#assistantClose');
    const messagesEl = panel.querySelector('#assistantMessages');
    const inputEl = panel.querySelector('#assistantInput');
    const sendBtn = panel.querySelector('#assistantSend');

    let initialized = false;

    function openPanel() {
      panel.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      if (!initialized) {
        initialized = true;
        loadKnowledgeBase().then((data) => {
          if (!data) {
            addMessage(messagesEl, 'The assistant is temporarily unavailable. Please contact us directly for help.', 'bot');
            return;
          }
          addMessage(messagesEl, data.greeting, 'bot');
          addQuickReplies(messagesEl, data.quickReplies, (label) => {
            handleUserQuery(label, data, messagesEl);
          });
        });
      }
      inputEl.focus();
    }

    function closePanel() {
      panel.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', () => {
      if (panel.classList.contains('open')) {
        closePanel();
      } else {
        openPanel();
      }
    });

    closeBtn.addEventListener('click', closePanel);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        closePanel();
        toggle.focus();
      }
    });

    function submitQuery() {
      const value = inputEl.value.trim();
      if (!value) return;
      loadKnowledgeBase().then((data) => {
        if (!data) return;
        handleUserQuery(value, data, messagesEl);
      });
      inputEl.value = '';
    }

    sendBtn.addEventListener('click', submitQuery);
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitQuery();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAssistant);
  } else {
    initAssistant();
  }
})();
