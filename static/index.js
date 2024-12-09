const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");


function formatMarkdown(text) {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function enhanceBotResponse(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
               .replace(/🔑/g, "\ud83d\udc51")
               .replace(/📝/g, "\ud83d\udd8c")
               .replace(/🛠️/g, "\ud83d\udca5")
               .replace(/```/g, "")
               .replace(/^\* (.+)/gm, "<li>$1</li>");

               text = `<ul>${text}</ul>`;
               return text;
}


function appendMessage(role, message, isBot = false) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", role.toLowerCase());

    if (isBot) {
        const enhancedMessage = enhanceBotResponse(message);
        messageDiv.innerHTML = `<span>${enhancedMessage}</span>`;
    } else {
        messageDiv.innerHTML = `<span>${message}</span>`;
    }

    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}


sendButton.addEventListener("click", async () => {
    const message = userInput.value.trim();
    if (message) {
        appendMessage("You", message);
        userInput.value = "";

        
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("message", "bot");
        typingDiv.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`;
        chatbox.appendChild(typingDiv);

        try {
            const response = await fetch("/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            typingDiv.remove();

            if (data.bot_message) {
                appendMessage("Bubble", data.bot_message, true);
            }
        } catch (error) {
            typingDiv.remove();
            appendMessage("Bubble", "Oops! I couldn't process your request. Try again later.");
        }
    }
});

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendButton.click();
});


function initializeChat() {
    appendMessage("Bubble", "👋 Hello! Welcome to Bubble Ai Chatbot! How can I assist you today?", true);
}


initializeChat();
