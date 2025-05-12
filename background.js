// 后台脚本，处理扩展的生命周期事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('自动写reflect扩展已安装');
});