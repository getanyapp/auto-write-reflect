document.addEventListener('DOMContentLoaded', function() {
    const autoPublishCheckbox = document.getElementById('autoPublish');
    const openTemplateBtn = document.getElementById('openTemplateBtn');

    // Load saved settings
    chrome.storage.sync.get(['autoPublish'], function(result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }
        autoPublishCheckbox.checked = result.autoPublish || false;
    });

    // Save settings on change
    autoPublishCheckbox.addEventListener('change', function() {
        chrome.storage.sync.set({autoPublish: autoPublishCheckbox.checked}, function() {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            }
        });
    });

    // Open template page
    openTemplateBtn.addEventListener('click', function() {
        chrome.tabs.create({url: 'template.html'});
    });
});
