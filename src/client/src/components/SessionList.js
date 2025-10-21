export class SessionList {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this.list = null;
    this.sessions = [];
    this.currentSessionToken = null;
    this.onSessionSelect = options.onSessionSelect || null;
    this.onNewChat = options.onNewChat || null;
  }

  render() {
    this.list = document.createElement('div');
    this.list.className = 'chatbot-session-list';

    // Header
    const header = document.createElement('div');
    header.className = 'chatbot-session-list-header';

    const title = document.createElement('h3');
    title.textContent = '대화 목록';
    header.appendChild(title);

    // New chat button
    const newChatBtn = document.createElement('button');
    newChatBtn.className = 'chatbot-session-new-btn';
    newChatBtn.setAttribute('aria-label', '새 대화 시작');
    newChatBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    `;
    newChatBtn.addEventListener('click', () => {
      if (this.onNewChat) {
        this.onNewChat();
      }
    });
    header.appendChild(newChatBtn);

    this.list.appendChild(header);

    // Sessions container
    const sessionsContainer = document.createElement('div');
    sessionsContainer.className = 'chatbot-session-list-container';
    this.list.appendChild(sessionsContainer);

    this.container.appendChild(this.list);
    return this.list;
  }

  setSessions(sessions) {
    this.sessions = sessions;
    this.renderSessions();
  }

  setCurrentSession(sessionToken) {
    this.currentSessionToken = sessionToken;
    this.renderSessions();
  }

  renderSessions() {
    const container = this.list.querySelector('.chatbot-session-list-container');
    if (!container) return;

    container.innerHTML = '';

    if (this.sessions.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'chatbot-session-list-empty';
      empty.textContent = '대화 내역이 없습니다';
      container.appendChild(empty);
      return;
    }

    this.sessions.forEach((session) => {
      const item = document.createElement('div');
      item.className = 'chatbot-session-item';
      if (session.sessionToken === this.currentSessionToken) {
        item.classList.add('active');
      }

      const title = document.createElement('div');
      title.className = 'chatbot-session-title';
      title.textContent = session.title || '새 대화';

      const preview = document.createElement('div');
      preview.className = 'chatbot-session-preview';
      preview.textContent = session.lastMessagePreview || '';

      const meta = document.createElement('div');
      meta.className = 'chatbot-session-meta';

      const count = document.createElement('span');
      count.className = 'chatbot-session-count';
      count.textContent = `${session.messageCount}개`;

      const time = document.createElement('span');
      time.className = 'chatbot-session-time';
      time.textContent = this.formatTime(session.lastMessageAt);

      meta.appendChild(count);
      meta.appendChild(time);

      item.appendChild(title);
      item.appendChild(preview);
      item.appendChild(meta);

      item.addEventListener('click', () => {
        if (this.onSessionSelect) {
          this.onSessionSelect(session.sessionToken);
        }
      });

      container.appendChild(item);
    });
  }

  formatTime(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  }

  show() {
    if (this.list) {
      this.list.style.display = 'flex';
    }
  }

  hide() {
    if (this.list) {
      this.list.style.display = 'none';
    }
  }
}
