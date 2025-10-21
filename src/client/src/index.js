import './styles.css';
import { FloatingButton } from './components/FloatingButton.js';
import { ChatWindow } from './components/ChatWindow.js';

/**
 * Chatbot Widget Entry Point
 */

class ChatbotWidget {
  constructor(config = {}) {
    this.config = {
      apiUrl: config.apiUrl || window.location.origin,
      title: config.title || '고객센터',
      subtitle: config.subtitle || '무엇을 도와드릴까요?',
      primaryColor: config.primaryColor || '#E17055',
      ...config,
    };

    this.container = null;
    this.shadowRoot = null;
    this.floatingButton = null;
    this.chatWindow = null;
    this.sessionToken = null;
    this.sessions = [];

    console.log('Chatbot Widget initialized', this.config);
  }

  async init() {
    // Create widget container
    this.container = document.createElement('div');
    this.container.className = 'chatbot-widget';

    // Use Shadow DOM for CSS isolation
    this.shadowRoot = this.container.attachShadow({ mode: 'open' });

    // Inject styles
    const styleSheet = document.createElement('link');
    styleSheet.rel = 'stylesheet';
    styleSheet.href = `${this.config.apiUrl}/widget/styles.css`;
    this.shadowRoot.appendChild(styleSheet);

    // Create shadow container
    const shadowContainer = document.createElement('div');
    shadowContainer.className = 'chatbot-widget';
    this.shadowRoot.appendChild(shadowContainer);

    // Apply custom primary color if provided
    if (this.config.primaryColor) {
      const style = document.createElement('style');
      style.textContent = `:root { --primary-color: ${this.config.primaryColor}; }`;
      this.shadowRoot.appendChild(style);
    }

    // Initialize components
    this.floatingButton = new FloatingButton(shadowContainer, () => {
      this.toggleChat();
    });
    this.floatingButton.render();

    this.chatWindow = new ChatWindow(shadowContainer, this.config);
    this.chatWindow.render();

    // Set up event handlers
    this.chatWindow.onClose = () => {
      this.floatingButton.show();
    };

    this.chatWindow.onSendMessage = (message) => {
      this.sendMessage(message);
    };

    this.chatWindow.onSessionSelect = (sessionToken) => {
      this.switchSession(sessionToken);
    };

    this.chatWindow.onNewChat = () => {
      this.createNewChat();
    };

    // Append to body
    document.body.appendChild(this.container);

    // Load sessions first
    await this.loadSessions();

    // Create session
    await this.createSession();

    console.log('Chatbot Widget ready');
  }

  async loadSessions() {
    try {
      const response = await fetch(`${this.config.apiUrl}/api/chatbot/sessions?limit=20`);

      if (!response.ok) {
        throw new Error('Failed to load sessions');
      }

      this.sessions = await response.json();
      this.chatWindow.setSessions(this.sessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      this.sessions = [];
    }
  }

  async createSession() {
    try {
      const response = await fetch(`${this.config.apiUrl}/api/chatbot/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.config.userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const data = await response.json();
      this.sessionToken = data.sessionToken;
      this.chatWindow.setCurrentSession(this.sessionToken);

      // Show welcome quick replies
      if (data.quickReplies && data.quickReplies.length > 0) {
        this.chatWindow.setQuickReplies(data.quickReplies);
      }

      // Add welcome message
      if (this.config.welcomeMessage) {
        this.chatWindow.addMessage({
          role: 'ASSISTANT',
          content: this.config.welcomeMessage,
          createdAt: new Date(),
        });
      }

      // Reload sessions to include the new one
      await this.loadSessions();
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  }

  async createNewChat() {
    this.chatWindow.clearMessages();
    await this.createSession();
    this.chatWindow.showChat();
  }

  async switchSession(sessionToken) {
    try {
      this.sessionToken = sessionToken;
      this.chatWindow.setCurrentSession(sessionToken);
      this.chatWindow.clearMessages();

      // Load messages for this session
      await this.loadMessages(sessionToken);

      // Switch to chat view
      this.chatWindow.showChat();
    } catch (error) {
      console.error('Failed to switch session:', error);
    }
  }

  async loadMessages(sessionToken) {
    try {
      const response = await fetch(
        `${this.config.apiUrl}/api/chatbot/sessions/${sessionToken}/messages`
      );

      if (!response.ok) {
        throw new Error('Failed to load messages');
      }

      const messages = await response.json();

      // Add messages to UI
      messages.forEach((message) => {
        this.chatWindow.addMessage(message);
      });
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }

  async toggleChat() {
    // Reload sessions when opening the chat
    if (!this.chatWindow.isVisible) {
      await this.loadSessions();
    }

    this.chatWindow.toggle();

    if (this.chatWindow.isVisible) {
      this.floatingButton.hide();
    } else {
      this.floatingButton.show();
    }
  }

  async sendMessage(content) {
    if (!this.sessionToken) {
      console.error('No session token available');
      return;
    }

    // Add user message to UI
    this.chatWindow.addMessage({
      role: 'USER',
      content,
      createdAt: new Date(),
    });

    // Clear quick replies
    this.chatWindow.setQuickReplies([]);

    // Show loading state
    this.chatWindow.setLoading(true);

    try {
      const response = await fetch(`${this.config.apiUrl}/api/chatbot/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          sessionToken: this.sessionToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Hide loading state
      this.chatWindow.setLoading(false);

      // Add assistant response
      this.chatWindow.addMessage({
        role: 'ASSISTANT',
        content: data.content,
        metadata: data.metadata,
        createdAt: data.createdAt,
      });

      // Show quick replies if available
      if (data.quickReplies && data.quickReplies.length > 0) {
        this.chatWindow.setQuickReplies(data.quickReplies);
      }

      // Reload sessions to update preview and timestamp
      await this.loadSessions();
    } catch (error) {
      console.error('Failed to send message:', error);

      // Hide loading state
      this.chatWindow.setLoading(false);

      // Show error message
      this.chatWindow.addMessage({
        role: 'ASSISTANT',
        content: '죄송합니다. 메시지 전송에 실패했습니다. 다시 시도해주세요.',
        createdAt: new Date(),
      });
    }
  }

  destroy() {
    if (this.container) {
      this.container.remove();
    }
  }
}

// Global API
window.chatbot = function () {
  const args = Array.from(arguments);
  const command = args[0];

  if (command === 'init') {
    const config = args[1] || {};
    const widget = new ChatbotWidget(config);
    widget.init();
    return widget;
  }
};

export default ChatbotWidget;
