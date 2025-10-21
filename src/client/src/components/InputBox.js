export class InputBox {
  constructor(container, onSend) {
    this.container = container;
    this.onSend = onSend;
    this.inputContainer = null;
    this.input = null;
    this.sendBtn = null;
  }

  render() {
    this.inputContainer = document.createElement('div');
    this.inputContainer.className = 'chatbot-input-container';

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.className = 'chatbot-input';
    this.input.placeholder = '메시지를 입력하세요...';
    this.input.setAttribute('maxlength', '10000');

    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.send();
      }
    });

    this.sendBtn = document.createElement('button');
    this.sendBtn.className = 'chatbot-send-btn';
    this.sendBtn.setAttribute('aria-label', '전송');
    this.sendBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    `;

    this.sendBtn.addEventListener('click', () => this.send());

    this.inputContainer.appendChild(this.input);
    this.inputContainer.appendChild(this.sendBtn);

    this.container.appendChild(this.inputContainer);
    return this.inputContainer;
  }

  send() {
    const message = this.input.value.trim();
    if (message && this.onSend) {
      this.onSend(message);
      this.input.value = '';
    }
  }

  focus() {
    if (this.input) {
      setTimeout(() => {
        this.input.focus();
      }, 100);
    }
  }

  setDisabled(disabled) {
    if (this.input) {
      this.input.disabled = disabled;
    }
    if (this.sendBtn) {
      this.sendBtn.disabled = disabled;
    }
  }
}
