export class Header {
  constructor(container, options) {
    this.container = container;
    this.options = options;
    this.header = null;
    this.backBtn = null;
    this.menuBtn = null;
    this.showBackButton = false;
  }

  render() {
    this.header = document.createElement('div');
    this.header.className = 'chatbot-header';

    // Left actions (back button)
    const leftActions = document.createElement('div');
    leftActions.className = 'chatbot-header-actions';

    this.backBtn = document.createElement('button');
    this.backBtn.className = 'chatbot-header-back';
    this.backBtn.setAttribute('aria-label', '뒤로가기');
    this.backBtn.style.display = 'none';
    this.backBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
    `;

    this.backBtn.addEventListener('click', () => {
      if (this.options.onBack) {
        this.options.onBack();
      }
    });

    leftActions.appendChild(this.backBtn);
    this.header.appendChild(leftActions);

    // Info section
    const info = document.createElement('div');
    info.className = 'chatbot-header-info';

    const title = document.createElement('h3');
    title.className = 'chatbot-header-title';
    title.textContent = this.options.title || '고객센터';

    const subtitle = document.createElement('p');
    subtitle.className = 'chatbot-header-subtitle';
    subtitle.textContent = this.options.subtitle || '무엇을 도와드릴까요?';

    info.appendChild(title);
    info.appendChild(subtitle);
    this.header.appendChild(info);

    // Right actions (menu and close buttons)
    const rightActions = document.createElement('div');
    rightActions.className = 'chatbot-header-actions';

    this.menuBtn = document.createElement('button');
    this.menuBtn.className = 'chatbot-header-menu';
    this.menuBtn.setAttribute('aria-label', '채팅방 목록');
    this.menuBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    `;

    this.menuBtn.addEventListener('click', () => {
      if (this.options.onMenu) {
        this.options.onMenu();
      }
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'chatbot-header-close';
    closeBtn.setAttribute('aria-label', '닫기');
    closeBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;

    closeBtn.addEventListener('click', () => {
      if (this.options.onClose) {
        this.options.onClose();
      }
    });

    rightActions.appendChild(this.menuBtn);
    rightActions.appendChild(closeBtn);
    this.header.appendChild(rightActions);

    this.container.appendChild(this.header);
    return this.header;
  }

  setBackButton(visible) {
    if (this.backBtn) {
      this.backBtn.style.display = visible ? 'flex' : 'none';
    }
    if (this.menuBtn) {
      this.menuBtn.style.display = visible ? 'none' : 'flex';
    }
  }
}
