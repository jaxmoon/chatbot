export class QuickReplies {
  constructor(container, onClick) {
    this.container = container;
    this.onClick = onClick;
    this.repliesContainer = null;
    this.replies = [];
  }

  render() {
    this.repliesContainer = document.createElement('div');
    this.repliesContainer.className = 'chatbot-quick-replies';
    this.repliesContainer.style.display = 'none';

    this.container.appendChild(this.repliesContainer);
    return this.repliesContainer;
  }

  setReplies(replies) {
    if (!this.repliesContainer) return;

    this.replies = replies || [];
    this.repliesContainer.innerHTML = '';

    if (this.replies.length === 0) {
      this.repliesContainer.style.display = 'none';
      return;
    }

    this.repliesContainer.style.display = 'flex';

    this.replies.forEach((reply) => {
      const button = document.createElement('button');
      button.className = 'chatbot-quick-reply-btn';

      if (reply.icon) {
        const icon = document.createElement('span');
        icon.className = 'chatbot-quick-reply-icon';
        icon.textContent = reply.icon;
        button.appendChild(icon);
      }

      const label = document.createElement('span');
      label.textContent = reply.label;
      button.appendChild(label);

      button.addEventListener('click', () => {
        if (this.onClick) {
          this.onClick(reply.value);
        }
        // Hide quick replies after click
        this.repliesContainer.style.display = 'none';
      });

      this.repliesContainer.appendChild(button);
    });
  }
}
