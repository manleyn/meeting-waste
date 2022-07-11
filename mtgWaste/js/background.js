chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ mwData : {
            rate: 75,
            meterLoc: '.NyMmmf',
            pplCountLoc: '.uGOf1d',
            presenterLoc: '.DLTdnd'
        }
    }); 
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'get_mwData') {
        chrome.storage.local.get('mwData', data => {
            if (chrome.runtime.lastError) {
                sendResponse({
                    message: 'fail'
                });
                return;
            }
            sendResponse({
                message: 'success',
                payload: data
            });
        });
        return true;
    }
});
