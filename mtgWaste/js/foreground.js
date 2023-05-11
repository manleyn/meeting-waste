function elementReady(selector, onetime) {
    return new Promise((resolve, reject) => {
        let el = document.querySelector(selector);
        if (el) {
            resolve(el);
        }
        new MutationObserver((mutationRecords, observer) => {
            // Query for elements matching the specified selector
            Array.from(document.querySelectorAll(selector)).forEach((element) => {
                resolve(element);
                if (onetime){
                    observer.disconnect();
                }
            });
        }).observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });
}

const mw_outer = document.createElement('DIV');
const mw_myMeter = document.createElement('SPAN');
mw_outer.id = 'mw_outer';
mw_outer.style = 'padding-left: 0px; padding-top: 0px;'
mw_myMeter.id = 'mw_myMeter';
mw_myMeter.classList.add('odometer');

mw_outer.innerHTML = '$';
mw_myMeter.innerHTML = '0';
mw_outer.appendChild(mw_myMeter);

var cost = 0;
var timer;
var pplCount = 1;
var rate = 75; //default the rate to 75 and then get it from local storage
var meterLoc = '.fXLZ2'; //default the meterLoc to '.NyMmmf' and then get it from local storage
var pplCountLoc = '.uGOf1d'; //default the pplCountLoc to '.uGOf1d' and then get it from local storage
var presenterLoc = '.DLTdnd'; //default the presenterLoc to '.DLTdnd' and then get it from local storage

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

    rate = savedData.mwData.rate; console.log(rate);

    meterLoc = savedData.mwData.meterLoc; console.log(meterLoc);

    pplCountLoc = savedData.mwData.pplCountLoc; console.log(pplCountLoc);

    presenterLoc = savedData.mwData.presenterLoc; console.log(presenterLoc);

    //watch for the target element that we want to inject the meter into
    elementReady(meterLoc, true).then((targetElement) => {
        console.log(targetElement);
        targetElement.prepend(mw_outer);
        startMeter();
    });
} 
getStoredData();

function updateMeter(){
    var counterDiv = document.querySelector(pplCountLoc);
    var prestingNow = document.querySelector(presenterLoc);
    if (counterDiv != null){
        pplCount = counterDiv.innerHTML;
        if (prestingNow != null)
            pplCount -= 1; // remove 1 for the presenting person
    }

    cost += (pplCount * (rate / 60 / 60));

    od.update(cost);

    timer = setTimeout(updateMeter, 1000);
};

var od;

function startMeter(targetElement) {
    od = new Odometer({
        el: mw_myMeter,
        value: cost,
        format: '(,ddd).dd',
        duration: 500
    });

    timer = setTimeout(updateMeter, 1000);
}

function stopMeter(){
    clearTimeout(timer);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.message);
    if (request.message === 'rateChanged') {
        console.log('getting latest rate');
        getStoredData(); // get saved data out of local storage to get the new rate
        sendResponse({
            message: 'success'
        });
    } else if (request.message === 'resetMeter') {
        cost = 0;
        od.update(0);
    }
});
