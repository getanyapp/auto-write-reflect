document.addEventListener('DOMContentLoaded', function() {
    // 1. System Prompt Logic
    const systemPromptInput = document.getElementById('systemPrompt');
    const saveSystemBtn = document.getElementById('saveSystemBtn');
    const resetSystemBtn = document.getElementById('resetSystemBtn');

    // Load System Prompt
    chrome.storage.sync.get(['systemPrompt'], function(result) {
        if (result.systemPrompt) {
            systemPromptInput.value = result.systemPrompt;
        }
    });

    // Save System Prompt
    saveSystemBtn.addEventListener('click', function() {
        const value = systemPromptInput.value;
        chrome.storage.sync.set({systemPrompt: value}, function() {
            alert('系统提示词已保存！');
        });
    });

    // Reset System Prompt
    resetSystemBtn.addEventListener('click', function() {
        if (confirm('确定要清空系统提示词吗？')) {
            systemPromptInput.value = '';
            chrome.storage.sync.remove('systemPrompt', function() {
                alert('系统提示词已重置！');
            });
        }
    });


    // 2. User Prompts Logic
    // Define the list of keys and their associated input/toggle IDs
    const userPromptKeys = [
        'user_workSummary',
        'user_learn',
        'user_cantSolve',
        'user_mistakes',
        'user_nextTasks',
        'user_didToday',
        'user_weeklySummary',
        'user_impossible',
        'user_share',
        'user_badge' // This one only has a toggle, no text input
    ];

    // Define default enabled states
    const defaultEnabledKeys = [
        'user_workSummary',
        'user_learn',
        'user_cantSolve',
        'user_mistakes',
        'user_weeklySummary'
    ];

    const saveUserBtn = document.getElementById('saveUserBtn');
    const resetUserBtn = document.getElementById('resetUserBtn');

    // Helper to get element IDs
    const getIds = (key) => ({
        input: key === 'user_badge' ? null : key, // badge has no input
        toggle: `enable_${key}`
    });

    // Load User Prompts and Toggles
    chrome.storage.sync.get(['userPrompts', 'userPromptToggles'], function(result) {
        let userPrompts = result.userPrompts || {};
        const userPromptToggles = result.userPromptToggles || {};

        // If userPrompts is empty (first run), populate with defaults and save
        if (!result.userPrompts) {
            const defaults = {};
            userPromptKeys.forEach(key => {
                const ids = getIds(key);
                if (ids.input) {
                    const inputEl = document.getElementById(ids.input);
                    if (inputEl) {
                        defaults[key] = inputEl.value; // Get default value from HTML
                    }
                }
            });
            // Update local variable and save to storage
            userPrompts = defaults;
            chrome.storage.sync.set({userPrompts: defaults});
        }

        userPromptKeys.forEach(key => {
            const ids = getIds(key);
            
            // Set Input Value
            if (ids.input) {
                const inputEl = document.getElementById(ids.input);
                if (inputEl && userPrompts.hasOwnProperty(key)) {
                    inputEl.value = userPrompts[key];
                }
            }

            // Set Toggle State
            if (ids.toggle) {
                const toggleEl = document.getElementById(ids.toggle);
                if (toggleEl) {
                    // Check if there is a saved setting
                    if (userPromptToggles.hasOwnProperty(key)) {
                         toggleEl.checked = userPromptToggles[key];
                    } else {
                        // If no saved setting, use default
                        toggleEl.checked = defaultEnabledKeys.includes(key);
                    }
                }
            }
        });
    });

    // Save User Prompts and Toggles
    saveUserBtn.addEventListener('click', function() {
        const userPrompts = {};
        const userPromptToggles = {};

        userPromptKeys.forEach(key => {
            const ids = getIds(key);

            // Get Input Value
            if (ids.input) {
                const inputEl = document.getElementById(ids.input);
                if (inputEl) {
                    userPrompts[key] = inputEl.value;
                }
            }

            // Get Toggle State
            if (ids.toggle) {
                const toggleEl = document.getElementById(ids.toggle);
                if (toggleEl) {
                    userPromptToggles[key] = toggleEl.checked;
                }
            }
        });

        chrome.storage.sync.set({
            userPrompts: userPrompts,
            userPromptToggles: userPromptToggles
        }, function() {
            alert('用户提示词设置已保存！');
        });
    });

    // Reset User Prompts
    resetUserBtn.addEventListener('click', function() {
        if (confirm('确定要重置所有用户提示词设置为默认值吗？')) {
            const defaults = {};
            const defaultToggles = {};

            userPromptKeys.forEach(key => {
                const ids = getIds(key);
                
                // Reset Input
                if (ids.input) {
                    const inputEl = document.getElementById(ids.input);
                    if (inputEl) {
                        inputEl.value = inputEl.defaultValue;
                        defaults[key] = inputEl.defaultValue;
                    }
                }

                // Reset Toggle to default
                if (ids.toggle) {
                    const toggleEl = document.getElementById(ids.toggle);
                    if (toggleEl) {
                        const isChecked = defaultEnabledKeys.includes(key);
                        toggleEl.checked = isChecked;
                        defaultToggles[key] = isChecked;
                    }
                }
            });

            chrome.storage.sync.set({
                userPrompts: defaults,
                userPromptToggles: defaultToggles
            }, function() {
                alert('用户提示词设置已重置为默认值！');
            });
        }
    });
});
