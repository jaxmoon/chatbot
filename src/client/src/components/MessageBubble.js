export class MessageBubble {
  constructor(container, message) {
    this.container = container;
    this.message = message;
    this.bubble = null;
  }

  render() {
    this.bubble = document.createElement('div');
    this.bubble.className = `chatbot-bubble ${this.message.role.toLowerCase()}`;

    const content = document.createElement('div');
    content.className = 'chatbot-bubble-content';
    content.textContent = this.message.content;

    // Convert markdown-like formatting
    content.innerHTML = this.formatContent(this.message.content);

    const time = document.createElement('div');
    time.className = 'chatbot-bubble-time';
    time.textContent = this.formatTime(this.message.createdAt || new Date());

    this.bubble.appendChild(content);
    this.bubble.appendChild(time);

    this.container.appendChild(this.bubble);
    return this.bubble;
  }

  formatContent(text) {
    // Simple markdown formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  formatTime(date) {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
