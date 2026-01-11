/**
 * Tau Prolog Chatbot Integration for Sri Lankan Tourism Website
 * This file handles the client-side chatbot functionality using Tau Prolog
 */

class TourismChatbot {
    constructor() {
        this.conversationHistory = [];
        this.isTyping = false;
        this.init();
    }

    /**
     * Initialize the chatbot
     */
    async init() {
        try {
            // Initialize UI
            this.initUI();

            console.log('Tourism Chatbot initialized successfully');
        } catch (error) {
            console.error('Failed to initialize chatbot:', error);
        }
    }



    /**
     * Initialize the chat UI
     */
    initUI() {
        // Create chat widget container
        const chatWidget = document.createElement('div');
        chatWidget.id = 'tourism-chat-widget';
        chatWidget.innerHTML = `
            <div id="chat-toggle-btn">
                <span>💬</span>
            </div>
            <div id="chat-window" class="hidden">
                <div id="chat-header">
                    <h3>Sri Lanka Tourism Assistant</h3>
                    <button id="chat-close-btn">×</button>
                </div>
                <div id="chat-messages"></div>
                <div id="typing-indicator" class="hidden">
                    <span>Assistant is typing...</span>
                </div>
                <div id="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Ask me about Sri Lanka...">
                    <button id="chat-send-btn">Send</button>
                </div>
                <div id="quick-replies">
                    <button class="quick-reply-btn" data-query="Tell me about cultural sites">Cultural Sites</button>
                    <button class="quick-reply-btn" data-query="Find hotels in Colombo">Hotels in Colombo</button>
                    <button class="quick-reply-btn" data-query="Best time to visit Sri Lanka">Best Time to Visit</button>
                    <button class="quick-reply-btn" data-query="Show me tour packages">Tour Packages</button>
                    <button class="quick-reply-btn" data-query="What food should I try">Sri Lankan Food</button>
                    <button class="quick-reply-btn" data-query="How to get around">Transportation</button>
                </div>
            </div>
        `;

        document.body.appendChild(chatWidget);

        // Bind event listeners
        this.bindEvents();
    }

    /**
     * Bind event listeners for chat interactions
     */
    bindEvents() {
        const toggleBtn = document.getElementById('chat-toggle-btn');
        const closeBtn = document.getElementById('chat-close-btn');
        const sendBtn = document.getElementById('chat-send-btn');
        const inputField = document.getElementById('chat-input');
        const quickReplyBtns = document.querySelectorAll('.quick-reply-btn');

        // Toggle chat window
        toggleBtn.addEventListener('click', () => this.toggleChat());

        // Close chat window
        closeBtn.addEventListener('click', () => this.closeChat());

        // Send message on button click
        sendBtn.addEventListener('click', () => this.sendMessage());

        // Send message on Enter key
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Quick reply buttons
        quickReplyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const query = e.target.getAttribute('data-query');
                this.sendMessage(query);
            });
        });
    }

    /**
     * Toggle chat window visibility
     */
    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.toggle('hidden');
    }

    /**
     * Close chat window
     */
    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.add('hidden');
    }

    /**
     * Send a message to the chatbot
     */
    sendMessage(userMessage = null) {
        const inputField = document.getElementById('chat-input');
        const message = userMessage || inputField.value.trim();

        if (!message) return;

        // Clear input
        inputField.value = '';

        // Add user message to chat
        this.addMessage(message, 'user');

        // Show typing indicator
        this.showTyping();

        // Process the message
        this.processMessage(message);
    }

    /**
     * Process user message and generate response
     */
    async processMessage(message) {
        try {
            // Send message to server API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    lastIntent: this.conversationHistory.length > 0 ? this.conversationHistory[this.conversationHistory.length - 1].intent : 'none'
                })
            });

            if (!response.ok) {
                throw new Error('Server error');
            }

            const data = await response.json();
            this.addMessage(data.reply, 'bot');
        } catch (error) {
            console.error('Error processing message:', error);
            this.addMessage('Sorry, something went wrong. Please try again.', 'bot');
        }

        this.hideTyping();
    }



    /**
     * Add a message to the chat
     */
    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        // Format message with line breaks
        const formattedText = text.replace(/\n/g, '<br>');
        messageDiv.innerHTML = formattedText;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Store in conversation history
        this.conversationHistory.push({ text, sender, timestamp: new Date() });
    }

    /**
     * Show typing indicator
     */
    showTyping() {
        const typingIndicator = document.getElementById('typing-indicator');
        typingIndicator.classList.remove('hidden');
        this.isTyping = true;
    }

    /**
     * Hide typing indicator
     */
    hideTyping() {
        const typingIndicator = document.getElementById('typing-indicator');
        typingIndicator.classList.add('hidden');
        this.isTyping = false;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load Tau Prolog library if not already loaded
    if (typeof pl === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tau-prolog@0.3.4/modules/core.min.js';
        script.onload = () => {
            // Initialize chatbot after Tau Prolog loads
            window.tourismChatbot = new TourismChatbot();
        };
        document.head.appendChild(script);
    } else {
        // Tau Prolog already loaded
        window.tourismChatbot = new TourismChatbot();
    }
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TourismChatbot;
}