# Malicious URL Detector - Complete Beginner's Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [What You'll Learn](#what-youll-learn)
3. [Prerequisites](#prerequisites)
4. [Phase 1: Basic Version (START HERE)](#phase-1-basic-version)
5. [Phase 2: Intermediate Version](#phase-2-intermediate-version)
6. [Phase 3: Advanced Features](#phase-3-advanced-features)
7. [Testing Your Extension](#testing)
8. [Troubleshooting](#troubleshooting)
9. [Adding to Your CV](#cv-tips)

---

## 🎯 Project Overview

### What You're Building
A browser extension that protects users by detecting and warning them about malicious websites in real-time.

### Why This Matters
- **Real Problem**: Phishing attacks cost billions annually
- **Practical Skill**: Shows you can build real security tools
- **Portfolio Value**: Demonstrates JavaScript, APIs, and security knowledge
- **User Impact**: Actually helps people stay safe online

### Final Product Features
- ✅ Automatically scans every website you visit
- ✅ Warns you before visiting dangerous sites
- ✅ Shows threat details (phishing, malware, etc.)
- ✅ Works in Chrome, Firefox, and Edge
- ✅ Uses real security databases

---

## 🧠 What You'll Learn

### Technical Skills
- **JavaScript Programming**: Writing code that runs in browsers
- **Browser APIs**: How extensions interact with web pages
- **External APIs**: Connecting to security databases
- **Asynchronous Programming**: Handling delayed responses
- **JSON**: Working with data formats
- **Git/GitHub**: Version control for your code

### Security Concepts
- **URL Analysis**: Understanding web addresses
- **Threat Detection**: Identifying malicious patterns
- **Heuristics**: Rule-based detection methods
- **Reputation Systems**: How sites get blacklisted

### Soft Skills
- **Problem Solving**: Breaking big problems into small steps
- **Documentation**: Explaining your work
- **Testing**: Making sure things work properly
- **Project Management**: Completing a real project start to finish

---

## 🛠️ Prerequisites

### What You Need to Know
- **Basic HTML/CSS**: Understanding web page structure
- **Basic JavaScript**: Variables, functions, if/else statements
- **NOT REQUIRED**: Advanced programming, databases, or frameworks

### Tools to Install

#### 1. VS Code (Text Editor)
- **Download**: https://code.visualstudio.com/
- **Why**: Free, beginner-friendly, has helpful extensions
- **Setup**: Just download and install (takes 2 minutes)

#### 2. Web Browser
- **Chrome** or **Firefox** (either works)
- **Why**: You need a browser to test your extension
- **Already have it**: You're using one right now!

#### 3. Git (Optional but Recommended)
- **Download**: https://git-scm.com/
- **Why**: Track changes and upload to GitHub for your portfolio
- **Setup**: Install with default settings

---

## 🚀 Phase 1: Basic Version (START HERE)

### What This Version Does
- Maintains a simple list of known bad websites
- Checks every URL you visit against this list
- Shows an alert if you visit a dangerous site
- Takes about 2-4 hours to build

### Step-by-Step Instructions

#### Step 1: Set Up Your Project Folder (5 minutes)

1. Create a new folder on your Desktop called `malicious-url-detector`
2. Open VS Code
3. Go to File → Open Folder → Select your new folder
4. You should see an empty folder in VS Code's sidebar

#### Step 2: Create Your First File - manifest.json (10 minutes)

This file is like your extension's ID card - it tells the browser what your extension is.

**In VS Code:**
1. Click the "New File" icon in the sidebar
2. Name it: `manifest.json`
3. Copy and paste this code:

```json
{
  "manifest_version": 3,
  "name": "Malicious URL Detector",
  "version": "1.0",
  "description": "Detects and warns about potentially malicious URLs",
  "permissions": [
    "tabs",
    "webNavigation"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icon16.png",
      "48": "icon48.png",
      "128": "icon128.png"
    }
  },
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  }
}
```

**What This Means:**
- `manifest_version`: Which extension format to use (3 is newest)
- `name`: What your extension is called
- `permissions`: What your extension can access
  - `tabs`: See what tabs are open
  - `webNavigation`: Know when you visit new pages
- `background`: The brain of your extension
- `action`: What happens when you click the icon

**Save the file**: Ctrl+S (Windows) or Cmd+S (Mac)

#### Step 3: Create the Brain - background.js (30 minutes)

This file does the actual checking of URLs.

**Create new file:** `background.js`

```javascript
// LIST OF KNOWN BAD DOMAINS
// This is our simple "database" of dangerous websites
const maliciousDomains = [
  'phishing-example.com',
  'malware-test.com',
  'scam-website.net',
  'fake-bank-login.com',
  'virus-download.org'
];

// HELPER FUNCTION: Extract domain from full URL
// Example: "https://www.google.com/search?q=test" → "google.com"
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    // Remove 'www.' if present
    return urlObj.hostname.replace('www.', '');
  } catch (e) {
    return null; // If URL is invalid, return null
  }
}

// HELPER FUNCTION: Check if domain is in our bad list
function isDomainMalicious(domain) {
  if (!domain) return false;
  
  // Check if domain exactly matches any in our list
  return maliciousDomains.includes(domain);
}

// MAIN FUNCTION: This runs every time you navigate to a new page
chrome.webNavigation.onCommitted.addListener((details) => {
  // Only check main page loads (not images, scripts, etc.)
  if (details.frameId === 0) {
    const domain = extractDomain(details.url);
    
    if (isDomainMalicious(domain)) {
      // DANGER! Show warning
      console.warn(`⚠️ MALICIOUS SITE DETECTED: ${domain}`);
      
      // Try to show alert (may not work on all pages due to browser security)
      chrome.tabs.executeScript(details.tabId, {
        code: `alert('⚠️ WARNING: This site (${domain}) is known to be malicious!\\n\\nIt may try to:\\n• Steal your passwords\\n• Install malware\\n• Phish for personal information\\n\\nLeave immediately!');`
      }).catch(err => {
        console.error('Could not show alert:', err);
      });
    } else {
      // Site is safe
      console.log(`✅ Safe site: ${domain}`);
    }
  }
});

// Log when extension starts
console.log('Malicious URL Detector is running!');
console.log(`Monitoring ${maliciousDomains.length} known malicious domains`);
```

**What This Code Does:**

1. **Lines 1-7**: List of bad websites (you can add more later)
2. **Lines 9-17**: Function that gets just the domain name from a full URL
3. **Lines 19-25**: Function that checks if a domain is in our bad list
4. **Lines 27-50**: The main logic that runs when you visit any page
5. **Lines 52-53**: Confirmation message when extension loads

**Save the file!**

#### Step 4: Create the Interface - popup.html (20 minutes)

This is what users see when they click your extension icon.

**Create new file:** `popup.html`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Malicious URL Detector</title>
  <style>
    body {
      width: 300px;
      padding: 15px;
      font-family: Arial, sans-serif;
    }
    
    h1 {
      font-size: 18px;
      color: #333;
      margin-top: 0;
    }
    
    .status {
      padding: 10px;
      border-radius: 5px;
      margin: 10px 0;
    }
    
    .safe {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    .info {
      background-color: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }
    
    button {
      width: 100%;
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
    }
    
    button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <h1>🛡️ URL Security Check</h1>
  
  <div class="status safe">
    <strong>✅ Extension Active</strong>
    <p>Monitoring all websites you visit</p>
  </div>
  
  <div class="status info">
    <strong>📊 Statistics</strong>
    <p>Monitoring <span id="domainCount">0</span> malicious domains</p>
  </div>
  
  <button id="checkBtn">Check Current Page</button>
  
  <script src="popup.js"></script>
</body>
</html>
```

**What This Creates:**
- A nice-looking popup window
- Status display showing extension is working
- Button to manually check the current page
- Clean, professional styling

**Save the file!**

#### Step 5: Add Popup Logic - popup.js (20 minutes)

This makes the popup interactive.

**Create new file:** `popup.js`

```javascript
// Update the domain count when popup opens
document.addEventListener('DOMContentLoaded', () => {
  // Get the malicious domains list from background script
  chrome.runtime.getBackgroundPage((bgPage) => {
    if (bgPage && bgPage.maliciousDomains) {
      const count = bgPage.maliciousDomains.length;
      document.getElementById('domainCount').textContent = count;
    }
  });
  
  // Add click handler to the check button
  document.getElementById('checkBtn').addEventListener('click', checkCurrentPage);
});

// Function to check the current active tab
function checkCurrentPage() {
  // Get the currently active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      const url = tabs[0].url;
      const domain = extractDomain(url);
      
      // Check against our list
      chrome.runtime.getBackgroundPage((bgPage) => {
        if (bgPage && bgPage.isDomainMalicious(domain)) {
          alert(`⚠️ WARNING: ${domain} is a known malicious site!`);
        } else {
          alert(`✅ Safe: ${domain} is not in our malicious domains list.`);
        }
      });
    }
  });
}

// Same helper function as background.js
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (e) {
    return null;
  }
}
```

**What This Does:**
- Shows how many malicious sites we're watching
- Lets users manually check the current page
- Displays results in a clean alert

**Save the file!**

#### Step 6: Add Icons (5 minutes)

Extensions need icons. For now, we'll skip creating custom icons and use placeholders.

**Quick Solution:**
1. Google "shield icon png 128x128"
2. Download a simple shield icon
3. Save it in your project folder 3 times as:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

**OR** temporarily edit manifest.json to remove icon requirements (we'll add them later).

#### Step 7: Load Your Extension in Browser (10 minutes)

**For Chrome:**

1. Open Chrome
2. Go to: `chrome://extensions/`
3. Turn on "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select your `malicious-url-detector` folder
6. You should see your extension appear! 🎉

**For Firefox:**

1. Open Firefox
2. Go to: `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select your `manifest.json` file
5. Extension loaded! 🎉

#### Step 8: Test It! (10 minutes)

1. Click your extension icon - popup should appear
2. Open browser console (F12) - you should see startup messages
3. Visit a normal site like `google.com` - console shows "✅ Safe site"
4. Visit one of your test sites (type `phishing-example.com` in address bar)
   - Should show warning alert!

**Success Criteria:**
- ✅ Extension appears in browser
- ✅ Popup opens when clicked
- ✅ Console logs show it's working
- ✅ Alerts appear for malicious sites

---

## 🎓 Phase 2: Intermediate Version

### What This Adds
- Real threat detection using Google Safe Browsing API
- Database of millions of actual malicious sites
- Detailed threat information
- More professional warnings

### Estimated Time: 4-6 hours

### Step 1: Get API Key (15 minutes)

1. Go to: https://developers.google.com/safe-browsing/v4/get-started
2. Click "Get a Key"
3. Create a Google Cloud project
4. Enable Safe Browsing API
5. Create credentials (API key)
6. Copy your key - keep it secret!

### Step 2: Update background.js

Add this at the top:

```javascript
// Your API key (replace with your actual key)
const API_KEY = 'YOUR_API_KEY_HERE';
const API_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';

// Check URL against Google Safe Browsing
async function checkUrlWithAPI(url) {
  const requestBody = {
    client: {
      clientId: "malicious-url-detector",
      clientVersion: "1.0.0"
    },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url: url }]
    }
  };
  
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    // If matches found, site is dangerous
    return data.matches && data.matches.length > 0 ? data.matches : null;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}
```

### Step 3: Update the Navigation Listener

Replace the old onCommitted listener with:

```javascript
chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId === 0) {
    const url = details.url;
    
    // First check our local list (faster)
    const domain = extractDomain(url);
    if (isDomainMalicious(domain)) {
      showWarning(details.tabId, domain, 'LOCAL_DATABASE');
      return;
    }
    
    // Then check with API (more comprehensive)
    const threats = await checkUrlWithAPI(url);
    if (threats) {
      showWarning(details.tabId, domain, threats[0].threatType);
    }
  }
});

function showWarning(tabId, domain, threatType) {
  const messages = {
    'LOCAL_DATABASE': 'known malicious site',
    'MALWARE': 'may install malware',
    'SOCIAL_ENGINEERING': 'phishing/scam site',
    'UNWANTED_SOFTWARE': 'may install unwanted software'
  };
  
  const message = messages[threatType] || 'potentially dangerous';
  
  chrome.tabs.executeScript(tabId, {
    code: `alert('⚠️ SECURITY WARNING\\n\\n${domain} is a ${message}\\n\\nDo not enter passwords or personal information!');`
  });
}
```

### Testing Phase 2

1. Replace `YOUR_API_KEY_HERE` with your actual API key
2. Reload your extension
3. Visit known malicious sites to test
4. Check console for API responses

---

## 🌟 Phase 3: Advanced Features

These are optional enhancements you can add over time:

### Feature Ideas

1. **URL Pattern Analysis**
   - Check for suspicious patterns (many numbers, odd TLDs)
   - Detect typosquatting (goggle.com vs google.com)

2. **User Reporting**
   - Let users report suspicious sites
   - Build your own database

3. **Statistics Dashboard**
   - Count threats blocked
   - Show most common threat types
   - Graph of activity over time

4. **Whitelist System**
   - Let users mark false positives
   - Never warn about whitelisted sites

5. **Browser Notifications**
   - Use Chrome notifications API
   - More subtle than alerts

6. **Certificate Checking**
   - Verify HTTPS certificates
   - Warn about expired/invalid certs

---

## 🧪 Testing Your Extension

### Manual Testing Checklist

- [ ] Extension loads without errors
- [ ] Popup displays correctly
- [ ] Console shows startup messages
- [ ] Safe sites don't trigger warnings
- [ ] Malicious sites trigger warnings
- [ ] API calls work (Phase 2+)
- [ ] Extension doesn't slow down browsing

### Test Sites (Safe for Testing)

These are intentionally malicious test sites maintained for security research:

- `testsafebrowsing.appspot.com/s/malware.html` (Google's test page)
- `malware.wicar.org` (Malware test)
- `phishing.rocks` (Phishing research site)

**⚠️ Never enter real credentials on test sites!**

---

## 🐛 Troubleshooting

### Common Issues

**Extension won't load**
- Check manifest.json for syntax errors (missing commas, brackets)
- Make sure all file names match exactly
- Check browser console for error messages

**No warnings appear**
- Check if permissions are granted
- Look for errors in background page console
- Verify domain is actually in your malicious list

**API not working (Phase 2)**
- Verify API key is correct
- Check if API is enabled in Google Cloud
- Look for rate limit errors (free tier limits)

**Popup doesn't open**
- Check popup.html for syntax errors
- Verify popup.js is loading
- Check file paths in manifest.json

### Getting Help

1. **Browser Console** (F12): Shows JavaScript errors
2. **Extension Console**: Right-click extension icon → "Inspect popup"
3. **Background Page**: Go to extensions page → "Inspect service worker"

---

## 📝 Adding to Your CV

### How to Describe This Project

**Project Title:**
"Malicious URL Detector - Browser Security Extension"

**Description:**
"Developed a real-time browser extension that protects users from malicious websites by integrating with Google Safe Browsing API and implementing custom heuristic detection. Monitors web traffic, analyzes URLs, and provides instant security warnings."

**Key Points:**
- Built using JavaScript and WebExtensions API
- Integrated external REST APIs for threat intelligence
- Implemented asynchronous programming for real-time detection
- Designed user-friendly interface with professional warnings
- Handles millions of URLs through reputation databases

**Technologies Used:**
- JavaScript (ES6+)
- Chrome/Firefox WebExtensions API
- Google Safe Browsing API
- REST API integration
- JSON data handling
- Git version control

### GitHub Repository Setup

1. Initialize git in your project:
```bash
cd malicious-url-detector
git init
git add .
git commit -m "Initial commit: Malicious URL Detector v1.0"
```

2. Create repository on GitHub
3. Push your code:
```bash
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

4. Write a good README.md with:
   - Project description
   - Screenshots
   - Installation instructions
   - Features list
   - Future improvements

---

## 🎯 Learning Resources

### If You Get Stuck

**JavaScript Basics:**
- FreeCodeCamp.org (free)
- JavaScript.info (comprehensive guide)
- MDN Web Docs (official reference)

**Browser Extensions:**
- Chrome Extension Docs: developer.chrome.com/docs/extensions
- MDN WebExtensions: developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions

**APIs:**
- Google Safe Browsing: developers.google.com/safe-browsing
- REST API basics: restfulapi.net

### Practice Projects After This

Once you finish this, try:
1. Password strength checker extension
2. Ad blocker (learn content scripts deeply)
3. Page highlighter/note-taker
4. Website blocker for productivity

---

## ✅ Success Milestones

Track your progress:

- [ ] Project folder created
- [ ] All files created with correct names
- [ ] Extension loads in browser
- [ ] Phase 1 complete: Basic detection working
- [ ] Phase 2 complete: API integration working
- [ ] Code pushed to GitHub
- [ ] README written with screenshots
- [ ] Project added to CV
- [ ] Showed project to someone (friend, mentor, interviewer)

---

## 🚀 Next Steps

After completing this project:

1. **Enhance It**: Add features from Phase 3
2. **Publish It**: Submit to Chrome Web Store or Firefox Add-ons
3. **Blog About It**: Write about what you learned
4. **Show It Off**: Add to portfolio website
5. **Get Feedback**: Share on Reddit r/webdev or Twitter

---

## 💪 You've Got This!

Remember:
- **Everyone starts somewhere** - even experts were beginners
- **Errors are learning** - each bug teaches you something
- **Build iteratively** - start simple, add features gradually
- **Ask for help** - developer communities are supportive
- **Be proud** - you're building something real!

When you finish this project, you'll have:
✅ A working security tool
✅ Portfolio project for your CV
✅ Real-world JavaScript experience
✅ API integration skills
✅ Understanding of browser extensions
✅ Confidence to tackle more projects

**Ready to start? Go back to Phase 1, Step 1 and begin building!**
