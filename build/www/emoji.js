// emojis
let dynamicEmojiMap = {};

async function loadEmojisFromAPI() {
    try {
        const response = await fetch('https://emojihub.yurace.pro/api/all');
        const data = await response.json();

        data.forEach(item => {
            const shortcode = `:${item.name.toLowerCase().replace(/\s+/g, '_')}:`;
            const parser = new DOMParser();
            const parsedDoc = parser.parseFromString(item.htmlCode[0], 'text/html');
            dynamicEmojiMap[shortcode] = parsedDoc.body.textContent;
        });
    } catch (error) {
        console.error(error);
    }
}

loadEmojisFromAPI();

document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat_message');

    if (!chatInput) return;

    chatInput.addEventListener('input', function(event) {
        let text = event.target.value;
        
        const emojiRegex = /:[a-z0-9_]+:/g;
        
        let textChanged = false;
        text = text.replace(emojiRegex, (match) => {
            if (dynamicEmojiMap[match]) {
                textChanged = true;
                return dynamicEmojiMap[match];
            }
            return match;
        });

        if (textChanged) {
            const start = this.selectionStart;
            const end = this.selectionEnd;
            const oldLength = this.value.length;

            this.value = text;

            const lengthDiff = text.length - oldLength;
            this.setSelectionRange(start + lengthDiff, end + lengthDiff);
        }
    });
});
