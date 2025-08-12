const chatbox = document.getElementById("chatbox");
const input = document.getElementById("userInput");

// Load marked.js with syntax highlighting
marked.setOptions({
    highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    }
});

// Format messages
function formatMessage(sender, message) {
    const isUser = sender === 'user';
    message = message.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const fixedIndent = code.replace(/\t/g, "    ");
        return `\`\`\`${lang || ''}\n${fixedIndent}\`\`\``;
    });
    const formattedMessage = marked.parse(message);

    if (isUser) {
        return `<div class="message user">${formattedMessage}</div>`;
    } else {
        return `
        <div class="bot-message">
            <img src="img/Chatbot_pfp.png" alt="Bot" class="bot-avatar">
            <div class="message-bot">
                <div class="bot-text">${formattedMessage}</div>
            </div>
        </div>
        `;
    }
}

async function sendMessage() {
    const question = input.value.trim();
    if (!question) return;

    chatbox.innerHTML += formatMessage('user', question);
    input.value = "";

    const res = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
    });

    const data = await res.json();
    const rawAnswer = data.choices[0].message.content;
    chatbox.innerHTML += formatMessage('bot', rawAnswer);
}
