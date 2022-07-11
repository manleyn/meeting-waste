# Meeting Wa$te
Google Chrome extension for Google Meet meetings. This extension generates a meter like view of the cost of a meeting based on an average configurable rate and the number of people on the call.

![alt text](https://github.com/manleyn/meeting-waste/blob/main/misc/meterExample.png)

This extension is not ready for Google so it is a dev mode extension for now. Be use to switch your extensions to Dev Mode and [Load unpacked](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked) extension.

Use the popup to set whatever $/hr rate you want for your meeting. You can update the rate in real time in the middle of a meeting as well as reset the meter back to zero.

I have no clue how, but Google seems to generate the DOM for Google Meet thru some kind of scripting. Therefore the class names for all the DOM elements are pretty much gibberish. I am assuming that at some point in the future Google will generate some newer verson of Google Meet and the class names discovered for the DIVs for this extension will change. Trying to keep up on this could be untenable. However, there are settings to override the preconfig'ed classes by using the popup for the extension.

Update Settings:

![alt text](https://github.com/manleyn/meeting-waste/blob/main/misc/popup-settings.png)
