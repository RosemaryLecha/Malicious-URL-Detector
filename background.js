// ==========================================
// MALICIOUS URL DETECTOR - BACKGROUND SCRIPT
// ==========================================
// This is the "brain" of the extension.
// It runs in the background and checks every URL you visit.

// ==========================================
// STEP 1: DEFINE OUR MALICIOUS DOMAINS LIST
// ==========================================
// This is a simple array (list) of websites we know are dangerous.
// You can add more domains here as you discover them.

const maliciousDomains = [
  'phishing-example.com',
  'malware-test.com',
  'scam-website.net',
  'fake-bank-login.com',
  'virus-download.org',
  'steal-passwords.net',
  'fake-paypal.com',
  'credit-card-scam.org'
];

// ==========================================
// STEP 2: HELPER FUNCTIONS
// ==========================================

/**
 * Extract the domain name from a full URL
 * 
 * EXAMPLE:
 * Input:  "https://www.google.com/search?q=test"
 * Output: "google.com"
 * 
 * @param {string} url - The full URL to parse
 * @returns {string|null} - Just the domain, or null if invalid
 */
function extractDomain(url) {
  try {
    // Create a URL object to parse the address
    const urlObj = new URL(url);
    
    // Get the hostname (domain) and remove 'www.' if present
    // hostname example: "www.google.com" → "google.com"
    return urlObj.hostname.replace('www.', '');
  } catch (e) {
    // If URL is malformed or invalid, return null
    console.error('Invalid URL:', url, e);
    return null;
  }
}

/**
 * Check if a domain is in our malicious list
 * 
 * @param {string} domain - The domain to check
 * @returns {boolean} - true if malicious, false if safe
 */
function isDomainMalicious(domain) {
  // Return false if no domain provided
  if (!domain) return false;
  
  // Check if the domain exists in our maliciousDomains array
  // .includes() returns true if the item is found in the array
  return maliciousDomains.includes(domain);
}

// ==========================================
// STEP 3: MAIN DETECTION LOGIC
// ==========================================

/**
 * This function runs EVERY TIME you navigate to a new page
 * It's like a security guard checking everyone who enters
 */
chrome.webNavigation.onCommitted.addListener((details) => {
  // details.frameId === 0 means this is the main page load
  // (not an iframe, image, or script loading)
  if (details.frameId === 0) {
    
    // Get just the domain from the full URL
    const domain = extractDomain(details.url);
    
    // Check if this domain is malicious
    if (isDomainMalicious(domain)) {
      // ⚠️ DANGER DETECTED!
      console.warn(`⚠️ MALICIOUS SITE DETECTED: ${domain}`);
      console.warn(`Full URL: ${details.url}`);
      
      // Show a warning to the user
      showWarning(details.tabId, domain);
      
    } else {
      // ✅ Site appears safe
      console.log(`✅ Safe site: ${domain}`);
    }
  }
});

/**
 * Display a warning message to the user
 * 
 * @param {number} tabId - Which browser tab to show the warning in
 * @param {string} domain - The dangerous domain name
 */
function showWarning(tabId, domain) {
  // Create the warning message
  const warningMessage = `
⚠️ SECURITY WARNING ⚠️

The website you're trying to visit is DANGEROUS:
${domain}

This site may:
• Steal your passwords
• Install malware on your device
• Trick you into sharing personal information
• Steal your credit card details

🛑 RECOMMENDATION: Leave this site immediately!

Click OK to acknowledge this warning.
  `.trim();
  
  // Try to inject a script that shows an alert
  // Note: This might not work on all pages due to browser security policies
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (message) => {
      alert(message);
    },
    args: [warningMessage]
  }).catch(error => {
    // If we can't show an alert (some pages block it), log to console
    console.error('Could not display alert:', error);
    console.warn('User should be warned about:', domain);
  });
}

// ==========================================
// STEP 4: INITIALIZATION
// ==========================================

/**
 * This runs when the extension first loads
 * It's like the extension saying "I'm awake and ready!"
 */
console.log('🛡️ Malicious URL Detector is now active!');
console.log(`📊 Currently monitoring ${maliciousDomains.length} known malicious domains`);
console.log('✅ All websites you visit will be checked for threats');

// ==========================================
// BONUS: MESSAGE LISTENER
// ==========================================

/**
 * This allows other parts of the extension (like popup.js) 
 * to communicate with this background script
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkUrl') {
    // Someone asked us to check a URL
    const domain = extractDomain(request.url);
    const isMalicious = isDomainMalicious(domain);
    
    sendResponse({
      domain: domain,
      isMalicious: isMalicious,
      url: request.url
    });
  } else if (request.action === 'getDomainCount') {
    // Someone asked how many domains we're monitoring
    sendResponse({
      count: maliciousDomains.length
    });
  }
  
  // Return true to indicate we'll respond asynchronously
  return true;
});

// ==========================================
// DEVELOPMENT NOTES
// ==========================================

/*
 * HOW TO TEST THIS:
 * 
 * 1. Load the extension in your browser
 * 2. Open the browser console (F12 → Console tab)
 * 3. You should see the startup messages
 * 4. Visit any website - you'll see "✅ Safe site" messages
 * 5. Try typing "phishing-example.com" in the address bar
 * 6. You should get a warning alert!
 * 
 * NEXT STEPS:
 * 
 * Phase 2: Add Google Safe Browsing API
 * - Register for API key
 * - Make API calls to check URLs
 * - Handle API responses
 * 
 * Phase 3: Add advanced features
 * - Heuristic detection (pattern matching)
 * - User reporting system
 * - Statistics tracking
 */
