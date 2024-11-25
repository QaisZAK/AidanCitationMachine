document.getElementById('generateButton').addEventListener('click', function () {
    const url = document.getElementById('urlInput').value;
    const reference = generateHarvardReference(url);
    document.getElementById('referenceOutput').innerText = reference;
    addToHistory(reference);
});

document.getElementById('copyButton').addEventListener('click', function () {
    copyToClipboard(document.getElementById('referenceOutput').innerText);
});

document.getElementById('copyAllButton').addEventListener('click', function () {
    const historyItems = Array.from(document.querySelectorAll('#historyList li')).map(item => item.innerText);
    copyToClipboard(historyItems.join('\n'));
});

document.getElementById('clearButton').addEventListener('click', function () {
    document.getElementById('historyList').innerHTML = '';
});

function generateHarvardReference(url) {
    // Placeholder function to generate a Harvard reference
    const author = "Shaw, A.A.";
    const year = "2021";
    const title = "Industry analysis - definition, types, examples & how-to guide";
    const site = "Marketing Tutor";
    const accessDate = "12 October 2024";

    return `${author} (${year}) ${title}, ${site}. Available at: ${url} (Accessed: ${accessDate}).`;
}

function addToHistory(reference) {
    const historyList = document.getElementById('historyList');
    const listItem = document.createElement('li');
    listItem.innerText = reference;
    historyList.appendChild(listItem);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}