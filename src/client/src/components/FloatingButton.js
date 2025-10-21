export class FloatingButton {
  constructor(container, onClick) {
    this.container = container;
    this.onClick = onClick;
    this.button = null;
  }

  render() {
    this.button = document.createElement('button');
    this.button.className = 'chatbot-floating-btn';
    this.button.setAttribute('aria-label', '채팅 열기');
    this.button.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;

    this.button.addEventListener('click', () => {
      this.onClick();
    });

    this.container.appendChild(this.button);
    return this.button;
  }

  hide() {
    if (this.button) {
      this.button.style.display = 'none';
    }
  }

  show() {
    if (this.button) {
      this.button.style.display = 'flex';
    }
  }
}
