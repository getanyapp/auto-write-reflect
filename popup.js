document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const autoPublishSwitch = document.getElementById('auto-publish');
    const openOptionsBtn = document.getElementById('open-options');
    
    // 加载保存的设置
    chrome.storage.sync.get(['autoPublish'], function(result) {
        autoPublishSwitch.checked = result.autoPublish === true;
    });
    
    // 保存自动发布设置
    autoPublishSwitch.addEventListener('change', function() {
        chrome.storage.sync.set({
            'autoPublish': autoPublishSwitch.checked
        });
    });
    
    // 打开选项页面
    openOptionsBtn.addEventListener('click', function() {
        chrome.runtime.openOptionsPage();
    });
});