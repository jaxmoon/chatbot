import { MessageBubble } from './MessageBubble.js';

export class MessageList {
  constructor(container) {
    this.container = container;
    this.list = null;
    this.messages = [];
    this.typingIndicator = null;
  }

  render() {
    this.list = document.createElement('div');
    this.list.className = 'chatbot-message-list';

    this.container.appendChild(this.list);
    return this.list;
  }

  addMessage(message) {
    const bubble = new MessageBubble(this.list, message);
    bubble.render();
    this.messages.push(bubble);

    // Auto scroll to bottom
    this.scrollToBottom();
  }

  showTypingIndicator() {
    if (this.typingIndicator) return;

    this.typingIndicator = document.createElement('div');
    this.typingIndicator.className = 'chatbot-typing-indicator';
    this.typingIndicator.innerHTML = `
      <div class="chatbot-bubble assistant">
        <div class="chatbot-typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;

    this.list.appendChild(this.typingIndicator);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.remove();
      this.typingIndicator = null;
    }
  }

  scrollToBottom() {
    if (this.list) {
      setTimeout(() => {
        this.list.scrollTop = this.list.scrollHeight;
      }, 100);
    }
  }

  clear() {
    if (this.list) {
      this.list.innerHTML = '';
      this.messages = [];
    }
  }
}
