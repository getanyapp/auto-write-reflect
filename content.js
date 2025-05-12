// ... existing code ...

// 创建按钮元素
const autofillBtn = document.createElement('button');
autofillBtn.innerText = '自动填写';
autofillBtn.style.position = 'fixed';
autofillBtn.style.right = '30px';
autofillBtn.style.bottom = '30px';
autofillBtn.style.zIndex = '9999';
autofillBtn.style.backgroundColor = '#27ae60';
autofillBtn.style.color = '#fff';
autofillBtn.style.border = 'none';
autofillBtn.style.borderRadius = '8px';
autofillBtn.style.padding = '12px 24px';
autofillBtn.style.fontSize = '16px';
autofillBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
autofillBtn.style.cursor = 'pointer';

// 将按钮添加到页面
document.body.appendChild(autofillBtn);

// 通用查找函数
function findReflectInputs() {
    // 1. Work summary 输入框
    const workSummary = Array.from(document.querySelectorAll("div[contenteditable='true'][data-max-length]"))
        .find(div => div.className.includes('editor-content'));

    // 2. What did I learn for the purpose of future winning
    const futureWinning = Array.from(document.querySelectorAll("textarea[rows='6'][maxlength='999']"))[0];

    // 3. Small mistakes I made
    const smallMistakes = Array.from(document.querySelectorAll("textarea[rows='11'][maxlength='400']"))[0];

    // 4. Summarize your weekly
    const summarizeWeekly = Array.from(document.querySelectorAll("textarea[class*='van-field__control'][placeholder*='what you observed']"));

    // 只有当 summarizeWeekly 存在时，smallMistakes 才有效
    const effectiveSmallMistakes = (summarizeWeekly && summarizeWeekly.length > 0) ? smallMistakes : null;

    return {
        workSummary,
        futureWinning,
        smallMistakes: effectiveSmallMistakes,
        summarizeWeekly
    };
}

// 分割模板字符串为数组
function splitTemplates(templateStr) {
    if (!templateStr) return [];
    return templateStr.split(/;;;|；；；/)
        .map(item => item.trim())  // 去除每个模板前后的空白
        .filter(item => item !== '');  // 过滤掉空模板
}

// 从数组中随机选择一个元素
function getRandomItem(array) {
    if (!array || array.length === 0) return '';
    return array[Math.floor(Math.random() * array.length)];
}

// 从数组中随机选择n个不重复的元素
function getRandomUniqueItems(array, n) {
    if (!array || array.length === 0) return [];
    if (array.length <= n) return array.slice().sort(() => Math.random() - 0.5);
    
    const result = [];
    const copyArray = array.slice();
    
    for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * copyArray.length);
        result.push(copyArray[randomIndex]);
        copyArray.splice(randomIndex, 1);
    }
    
    return result;
}

// 绑定按钮点击事件，自动填写内容
autofillBtn.addEventListener('click', () => {
    const inputs = findReflectInputs();
    
    // 获取保存的模板和设置
    chrome.storage.sync.get([
        'workSummaryTemplate',
        'whatLearnedTemplate',
        'smallMistakesTemplate',
        'weeklySummaryTemplate',
        'autoPublish'
    ], function(result) {
        // 填写 Work summary
        if (inputs.workSummary && result.workSummaryTemplate) {
            const templates = splitTemplates(result.workSummaryTemplate);
            const randomTemplate = getRandomItem(templates);
            
            // 清空内容并设置新内容
            inputs.workSummary.innerHTML = '';
            inputs.workSummary.textContent = randomTemplate;
            
            // 触发输入事件
            const inputEvent = new Event('input', { bubbles: true });
            inputs.workSummary.dispatchEvent(inputEvent);
            
            // 触发 change 事件
            const changeEvent = new Event('change', { bubbles: true });
            inputs.workSummary.dispatchEvent(changeEvent);
        }
        
        // 填写 What did I learn
        if (inputs.futureWinning && result.whatLearnedTemplate) {
            const templates = splitTemplates(result.whatLearnedTemplate);
            const randomTemplate = getRandomItem(templates);
            
            // 设置值
            inputs.futureWinning.value = randomTemplate;
            
            // 触发输入事件
            const inputEvent = new Event('input', { bubbles: true });
            inputs.futureWinning.dispatchEvent(inputEvent);
            
            // 触发 change 事件
            const changeEvent = new Event('change', { bubbles: true });
            inputs.futureWinning.dispatchEvent(changeEvent);
        }
        
        // 填写 Small mistakes I made
        if (inputs.smallMistakes && result.smallMistakesTemplate) {
            const templates = splitTemplates(result.smallMistakesTemplate);
            const randomTemplate = getRandomItem(templates);
            
            // 设置值
            inputs.smallMistakes.value = randomTemplate;
            
            // 触发输入事件
            const inputEvent = new Event('input', { bubbles: true });
            inputs.smallMistakes.dispatchEvent(inputEvent);
            
            // 触发 change 事件
            const changeEvent = new Event('change', { bubbles: true });
            inputs.smallMistakes.dispatchEvent(changeEvent);
        }
        
        // 填写 Summarize your weekly
        if (inputs.summarizeWeekly && inputs.summarizeWeekly.length > 0 && result.weeklySummaryTemplate) {
            const templates = splitTemplates(result.weeklySummaryTemplate);
            
            // 确保至少有5个模板
            if (templates.length >= 5) {
                // 随机选择5个不重复的模板
                const randomTemplates = getRandomUniqueItems(templates, Math.min(5, inputs.summarizeWeekly.length));
                
                // 填入每个输入框
                for (let i = 0; i < Math.min(randomTemplates.length, inputs.summarizeWeekly.length); i++) {
                    // 设置值
                    inputs.summarizeWeekly[i].value = randomTemplates[i];
                    
                    // 触发输入事件
                    const inputEvent = new Event('input', { bubbles: true });
                    inputs.summarizeWeekly[i].dispatchEvent(inputEvent);
                    
                    // 触发 change 事件
                    const changeEvent = new Event('change', { bubbles: true });
                    inputs.summarizeWeekly[i].dispatchEvent(changeEvent);
                }
            }
        }
        
        // 如果启用了自动发布，点击发布按钮
        if (result.autoPublish === true) {
            setTimeout(() => {
                // 尝试查找发布按钮
                const postButton = document.querySelector("div[data-v-459f7e30].btn.btn1.cursor-pointer.poppins-m-5") || 
                                  document.querySelector("div[data-v-459f7e30].btn.poppins-m-5");
                
                if (postButton) {
                    // 点击发布按钮
                    postButton.click();
                    console.log('自动发布成功！');
                } else {
                    console.log('未找到发布按钮');
                }
            }, 500); // 延迟500毫秒，确保内容填充完成
        }
        
        // 移除了这里的 alert 弹窗
    });
});

// 你可以在后续自动填充时调用 findReflectInputs()，获取所有输入框的 DOM 元素