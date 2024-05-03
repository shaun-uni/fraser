// This code handles the style button clicks to send text to the background script for enhancement.
document.querySelectorAll('.style-button').forEach(button => {
    button.addEventListener('click', function() {
        const originalInputText = document.getElementById('inputText').value; // Always use the original input
        const style = this.id;  // 'professional', 'informal', or 'concise'
        chrome.runtime.sendMessage({action: "enhanceText", text: originalInputText, style: style}, function(response) {
            document.getElementById('resultText').textContent = response.enhancedText || 'Error: ' + response.error;
        });
    });
});


// This code handles the "Copy Text" button click to copy the enhanced text to the clipboard.
document.getElementById('copyButton').addEventListener('click', function() {
    const resultText = document.getElementById('resultText').textContent;
    navigator.clipboard.writeText(resultText).then(() => {
        alert('Text copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});
