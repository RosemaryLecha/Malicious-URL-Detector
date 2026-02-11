# Malicious URL Detector - Starter Code

Welcome! This folder contains all the starter code you need to begin building your Malicious URL Detector browser extension.

## 📁 What's Included

- `manifest.json` - Extension configuration file
- `background.js` - Main detection logic
- `popup.html` - User interface
- `popup.js` - Popup functionality
- `README.md` - This file

## 🚀 Quick Start

### Step 1: Install the Extension

#### For Chrome:
1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select this folder
6. Done! 🎉

#### For Firefox:
1. Open Firefox
2. Go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file
5. Done! 🎉

### Step 2: Test It

1. Click the extension icon in your browser toolbar
2. You should see the popup interface
3. Open browser console (press F12)
4. Visit any website - you'll see log messages
5. Try visiting `phishing-example.com` - you'll get a warning!

## 📝 Files Explained

### manifest.json
This is your extension's "ID card". It tells the browser:
- What your extension is called
- What permissions it needs
- Which files to load

**Don't edit this unless you know what you're doing!**

### background.js
This is the "brain" of your extension. It:
- Monitors every website you visit
- Checks URLs against the malicious list
- Shows warnings when threats are detected

**Every line is commented - read through it to understand how it works!**

### popup.html
This is what users see when they click your extension icon. It includes:
- Status display
- Statistics
- Check current page button
- Malicious domains list button

**Try changing the colors or text to customize it!**

### popup.js
This handles the popup's functionality:
- Gets data from background.js
- Responds to button clicks
- Updates the display

## 🎯 What to Do Next

1. **Read the Code**: Every line has comments explaining what it does
2. **Test It**: Make sure everything works
3. **Customize It**: Add your own domains to the malicious list
4. **Learn**: Try to understand each function
5. **Move to Phase 2**: When ready, add API integration

## ⚠️ Known Issues

### Missing Icons
You'll notice we reference icon files that don't exist yet. Two options:

**Option 1: Quick Fix (Skip Icons)**
In `manifest.json`, remove or comment out these lines:
```json
"default_icon": { ... },
"icons": { ... }
```

**Option 2: Add Real Icons**
1. Find or create shield icon images (16x16, 48x48, 128x128 pixels)
2. Create an `icons` folder in this directory
3. Save your icons as `icon16.png`, `icon48.png`, `icon128.png`

### Alerts Don't Show
Some websites block extension alerts due to security policies. This is normal! The detection still works (check the console).

## 🐛 Troubleshooting

**Extension won't load:**
- Check for syntax errors (missing commas, brackets)
- Look at browser console for error messages

**No warnings appear:**
- Check that you're visiting a domain in the malicious list
- Open the console to see if detection is working
- Try reloading the extension

**Popup won't open:**
- Check popup.html for syntax errors
- Look at extension console (right-click icon → Inspect popup)

## 📚 Learning Resources

- **Chrome Extensions**: https://developer.chrome.com/docs/extensions/
- **JavaScript**: https://javascript.info/
- **MDN Web Docs**: https://developer.mozilla.org/

## 🎓 Next Steps

After you're comfortable with this basic version:

1. **Phase 2**: Add Google Safe Browsing API
   - Register for API key
   - Integrate real threat database
   - Handle API responses

2. **Phase 3**: Add advanced features
   - Heuristic detection
   - Statistics tracking
   - User reporting
   - Settings page

## 💡 Tips

- **Take your time**: Understanding is more important than speed
- **Experiment**: Try changing things to see what happens
- **Use console.log()**: Add your own log messages to track what's happening
- **Ask for help**: Developer communities are very supportive

## 🎉 You're Ready!

Everything you need is here. Read through the code comments, test it out, and start learning. 

Remember: Every expert was once a beginner. You've got this! 💪

---

**Questions?** Read the full tutorial document or search online. The developer community is always happy to help beginners!
