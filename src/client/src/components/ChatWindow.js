import { Header } from './Header.js';
import { MessageList } from './MessageList.js';
import { QuickReplies } from './QuickReplies.js';
import { InputBox } from './InputBox.js';
import { SessionList } from './SessionList.js';

export class ChatWindow {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.window = null;
    this.header = null;
    this.sessionList = null;
    this.messageContainer = null;
    this.messageList = null;
    this.quickReplies = null;
    this.inputBox = null;
    this.isVisible = false;
    this.currentView = 'chat'; // 'chat' or 'sessions'
    this.onClose = null;
    this.onSendMessage = null;
    this.onSessionSelect = null;
    this.onNewChat = null;
  }

  render() {
    this.window = document.createElement('div');
    this.window.className = 'chatbot-window';
    this.window.style.display = 'none';

    // Header
    this.header = new Header(this.window, {
      title: this.config.title || '고객센터',
      subtitle: this.config.subtitle || '무엇을 도와드릴까요?',
      onClose: () => this.close(),
      onMenu: () => this.showSessionList(),
      onBack: () => this.showChat(),
    });
    this.header.render();

    // Session list
    this.sessionList = new SessionList(this.window, {
      onSessionSelect: (sessionToken) => {
        if (this.onSessionSelect) {
          this.onSessionSelect(sessionToken);
        }
      },
      onNewChat: () => {
        if (this.onNewChat) {
          this.onNewChat();
        }
      },
    });
    this.sessionList.render();
    this.sessionList.hide();

    // Message container
    this.messageContainer = document.createElement('div');
    this.messageContainer.className = 'chatbot-message-container';

    // Message list
    this.messageList = new MessageList(this.messageContainer);
    this.messageList.render();

    // Quick replies
    this.quickReplies = new QuickReplies(this.messageContainer, (value) => {
      if (this.onSendMessage) {
        this.onSendMessage(value);
      }
    });
    this.quickReplies.render();

    this.window.appendChild(this.messageContainer);

    // Input box
    this.inputBox = new InputBox(this.window, (message) => {
      if (this.onSendMessage) {
        this.onSendMessage(message);
      }
    });
    this.inputBox.render();

    this.container.appendChild(this.window);
    return this.window;
  }

  showSessionList() {
    this.currentView = 'sessions';
    if (this.sessionList) {
      this.sessionList.show();
    }
    if (this.messageContainer) {
      this.messageContainer.style.display = 'none';
    }
    if (this.inputBox && this.inputBox.container) {
      this.inputBox.container.style.display = 'none';
    }
    if (this.header) {
      this.header.setBackButton(true);
    }
  }

  showChat() {
    this.currentView = 'chat';
    if (this.sessionList) {
      this.sessionList.hide();
    }
    if (this.messageContainer) {
      this.messageContainer.style.display = 'flex';
    }
    if (this.inputBox && this.inputBox.container) {
      this.inputBox.container.style.display = 'flex';
    }
    if (this.header) {
      this.header.setBackButton(false);
    }
  }

  setSessions(sessions) {
    if (this.sessionList) {
      this.sessionList.setSessions(sessions);
    }
  }

  setCurrentSession(sessionToken) {
    if (this.sessionList) {
      this.sessionList.setCurrentSession(sessionToken);
    }
  }

  clearMessages() {
    if (this.messageList) {
      this.messageList.clear();
    }
  }

  open() {
    if (this.window) {
      this.window.style.display = 'flex';
      this.isVisible = true;
      if (this.currentView === 'chat') {
        this.inputBox.focus();
      }
    }
  }

  close() {
    if (this.window) {
      this.window.style.display = 'none';
      this.isVisible = false;
      if (this.onClose) {
        this.onClose();
      }
    }
  }

  toggle() {
    if (this.isVisible) {
      this.close();
    } else {
      this.open();
    }
  }

  addMessage(message) {
    if (this.messageList) {
      this.messageList.addMessage(message);
    }
  }

  setQuickReplies(replies) {
    if (this.quickReplies) {
      this.quickReplies.setReplies(replies);
    }
  }

  setLoading(loading) {
    if (this.inputBox) {
      this.inputBox.setDisabled(loading);
    }

    if (loading && this.messageList) {
      this.messageList.showTypingIndicator();
    } else if (this.messageList) {
      this.messageList.hideTypingIndicator();
    }
  }
}
