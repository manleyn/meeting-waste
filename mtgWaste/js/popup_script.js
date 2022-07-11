var rateInput = document.getElementById('rate');
var meterLocInput = document.getElementById('meterLoc');
var pplCountLocInput = document.getElementById('pplCountLoc');
var presenterLocInpout = document.getElementById('presenterLoc');

var savedData = {};
async function getStoredData(){
    let promise = new Promise((resolve, reject) => {
        chrome.storage.local.get('mwData', (result) => {
            if (chrome.runtime.lastError)
                console.log('Error getting mwData');
        
            resolve(result);
        });
    });
    
    savedData = await promise; // wait until the promise resolves (*)

    rateInput.value = savedData.mwData.rate; 

    meterLocInput.value = savedData.mwData.meterLoc; 

    pplCountLocInput.value = savedData.mwData.pplCountLoc;

    presenterLocInpout.value = savedData.mwData.presenterLoc;
} 
getStoredData();

document.querySelector('#setRate').addEventListener('click', () => {
    if (!isNaN(rateInput.value)) {
        saveSettings('Rate updated.');
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { 'message': 'rateChanged' });
        });
    } else {
        showFail('Rate must be a nubmer: ' + rateInput.value);
    }
});

document.querySelector('#resetMeter').addEventListener('click', () => {
   
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { 'message': 'resetMeter' });
    });

});

function showSuccess(message){
    var msgEl = document.getElementById('rateSetSuccess');
    msgEl.innerHTML = message;
    msgEl.className = 'showMe';
    setTimeout(function(){ hideElement(msgEl);  }, 2000);
}

function showFail(message){
    var msgEl = document.getElementById('rateSetFail');
    msgEl.innerHTML = message;
    msgEl.className = 'showMe';
    setTimeout(function(){ hideElement(msgEl);  }, 2000);
}

function hideElement(element){
    element.className = 'hideMe';
}

var settings = document.querySelector('#settingAccess');
settings.addEventListener('click', () => {
    var settingsForm = document.getElementById('mwSettings');
    settingsForm.className = (settingsForm.className == 'hideMe') ? 'showMe' : 'hideMe';
});

document.querySelector('#saveSettings').addEventListener('click', () => {
    saveSettings('Saved settings.');
});

function saveSettings(successMsg) {
    savedData.rate = rateInput.value;
    savedData.meterLoc = meterLocInput.value;
    savedData.pplCountLoc = pplCountLocInput.value;
    savedData.presenterLoc = presenterLocInpout.value;

    chrome.storage.local.set({ mwData : savedData }).then( () => {
        if (chrome.runtime.lastError) {
            showFail('Error saving data.')
        } else {
            showSuccess(successMsg);
        }
    });
}