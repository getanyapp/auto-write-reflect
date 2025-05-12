document.addEventListener('DOMContentLoaded', function() {
    // 处理帮助图标的显示逻辑
    const helpIcons = document.querySelectorAll('.help-icon');
    
    helpIcons.forEach(function(icon) {
        // 跳过使用说明图标，它有单独的处理逻辑
        if (icon.id === 'usage-help-icon') return;
        
        // 获取对应的图片元素
        const imgId = 'img-' + icon.parentElement.getAttribute('for');
        const imgElem = document.getElementById(imgId);
        
        if (!imgElem) return;
        
        // 创建一个包含图标和图片的容器
        const container = document.createElement('div');
        container.className = 'help-container';
        
        // 将图标替换为容器，并将图标和图片放入容器
        icon.parentNode.insertBefore(container, icon);
        container.appendChild(icon);
        container.appendChild(imgElem);
        
        // 鼠标进入容器显示图片
        container.addEventListener('mouseenter', function() {
            imgElem.style.display = 'block';
        });
        
        // 鼠标离开容器隐藏图片
        container.addEventListener('mouseleave', function() {
            imgElem.style.display = 'none';
        });
    });
    
    // 处理使用说明图标的显示逻辑
    const usageHelpIcon = document.getElementById('usage-help-icon');
    const usageHelpContent = document.getElementById('usage-help-content');
    const usageHelpContainer = document.getElementById('usage-help-container');
    
    if (usageHelpContainer && usageHelpContent) {
        usageHelpContainer.addEventListener('mouseenter', function() {
            usageHelpContent.style.display = 'block';
        });
        
        usageHelpContainer.addEventListener('mouseleave', function() {
            usageHelpContent.style.display = 'none';
        });
    }

    // 获取表单元素
    const workSummaryInput = document.getElementById('work-summary');
    const whatLearnedInput = document.getElementById('what-learned');
    const smallMistakesInput = document.getElementById('small-mistakes');
    const weeklySummaryInput = document.getElementById('weekly-summary');
    const saveBtn = document.getElementById('save-btn');
    const resetBtn = document.getElementById('reset-btn');

    // 加载保存的模板
    loadTemplates();

    // 保存按钮点击事件
    saveBtn.addEventListener('click', function() {
        // 移除之前的错误提示
        const oldErrorMsg = document.getElementById('weekly-error-msg');
        if (oldErrorMsg) {
            oldErrorMsg.remove();
        }
        
        // 验证周报模板是否至少有5条内容
        const weeklySummaryContent = weeklySummaryInput.value.trim();
        const weeklySummaryTemplates = splitTemplates(weeklySummaryContent);
        
        if (weeklySummaryTemplates.length < 5) {
            // 创建错误提示
            const errorMsg = document.createElement('div');
            errorMsg.id = 'weekly-error-msg';
            errorMsg.textContent = '本周工作总结模板至少需要5条内容，请使用";;;"或"；；；"分隔不同模板';
            errorMsg.style.color = '#e74c3c';
            errorMsg.style.fontSize = '14px';
            errorMsg.style.marginTop = '8px';
            
            // 添加到周报输入框下方
            weeklySummaryInput.parentNode.appendChild(errorMsg);
            
            // 滚动到错误提示位置
            errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        
        // 保存模板
        chrome.storage.sync.set({
            'workSummaryTemplate': workSummaryInput.value,
            'whatLearnedTemplate': whatLearnedInput.value,
            'smallMistakesTemplate': smallMistakesInput.value,
            'weeklySummaryTemplate': weeklySummaryInput.value
        }, function() {
            alert('模板保存成功！');
        });
    });

    // 重置按钮点击事件
    resetBtn.addEventListener('click', function() {
        if (confirm('确定要重置所有模板吗？')) {
            chrome.storage.sync.remove([
                'workSummaryTemplate',
                'whatLearnedTemplate',
                'smallMistakesTemplate',
                'weeklySummaryTemplate'
            ], function() {
                // 清空输入框
                workSummaryInput.value = '';
                whatLearnedInput.value = '';
                smallMistakesInput.value = '';
                weeklySummaryInput.value = '';
                alert('模板已重置！');
            });
        }
    });

    // 加载保存的模板
    function loadTemplates() {
        chrome.storage.sync.get([
            'workSummaryTemplate',
            'whatLearnedTemplate',
            'smallMistakesTemplate',
            'weeklySummaryTemplate'
        ], function(result) {
            if (result.workSummaryTemplate) {
                workSummaryInput.value = result.workSummaryTemplate;
            }
            if (result.whatLearnedTemplate) {
                whatLearnedInput.value = result.whatLearnedTemplate;
            }
            if (result.smallMistakesTemplate) {
                smallMistakesInput.value = result.smallMistakesTemplate;
            }
            if (result.weeklySummaryTemplate) {
                weeklySummaryInput.value = result.weeklySummaryTemplate;
            }
        });
    }

    // 分割模板字符串为数组
    function splitTemplates(templateStr) {
        if (!templateStr) return [];
        return templateStr.split(/;;;|；；；/).filter(item => item.trim() !== '');
    }
});