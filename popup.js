// ==========================================
// MALICIOUS URL DETECTOR - POPUP SCRIPT
// ==========================================
// This script runs when you click the extension icon.
// It handles the popup interface and user interactions.

// ==========================================
// STEP 1: INITIALIZE WHEN POPUP OPENS
// ==========================================

/**
 * This runs as soon as the popup window opens
 * It's like the "setup" or "initialization" function
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Popup opened');
  
  // Load and display all information
  await loadDomainCount();
  await loadCurrentPageInfo();
  
  // Set up button click handlers
  setupEventListeners();
});

// ==========================================
// STEP 2: LOAD DATA FROM BACKGROUND SCRIPT
// ==========================================

/**
 * Get the count of malicious domains we're monitoring
 * This talks to background.js to get the information
 */
async function loadDomainCount() {
  try {
    // Send a message to background.js asking for the count
    const response = await chrome.runtime.sendMessage({ 
      action: 'getDomainCount' 
    });
    
    // Update the display with the count
    const countElement = document.getElementById('domainCount');
    countElement.textContent = response.count;
    
    console.log(`Monitoring ${response.count} malicious domains`);
  } catch (error) {
    console.error('Error loading domain count:', error);
    document.getElementById('domainCount').textContent = '?';
  }
}

/**
 * Get information about the current active tab
 * Shows what website the user is currently on
 */
async function loadCurrentPageInfo() {
  try {
    // Query for the currently active tab
    const tabs = await chrome.tabs.query({ 
      active: true, 
      currentWindow: true 
    });
    
    if (tabs[0]) {
      const currentUrl = tabs[0].url;
      const urlElement = document.getElementById('currentUrl');
      
      // Display the URL
      urlElement.textContent = currentUrl;
      
      // Store for later use
      window.currentTabUrl = currentUrl;
      window.currentTabId = tabs[0].id;
      
      console.log('Current page:', currentUrl);
    }
  } catch (error) {
    console.error('Error loading current page:', error);
    document.getElementById('currentUrl').textContent = 'Unable to load';
  }
}

// ==========================================
// STEP 3: HANDLE USER INTERACTIONS
// ==========================================

/**
 * Set up all button click handlers
 * This connects the HTML buttons to JavaScript functions
 */
function setupEventListeners() {
  // "Check Current Page" button
  const checkBtn = document.getElementById('checkCurrentBtn');
  checkBtn.addEventListener('click', checkCurrentPage);
  
  // "View Malicious List" button
  const viewListBtn = document.getElementById('viewListBtn');
  viewListBtn.addEventListener('click', viewMaliciousList);
}

/**
 * Check if the current page is malicious
 * This is called when user clicks "Check Current Page"
 */
async function checkCurrentPage() {
  console.log('Checking current page...');
  
  // Get the button element to show loading state
  const btn = document.getElementById('checkCurrentBtn');
  const originalText = btn.textContent;
  btn.textContent = '🔄 Checking...';
  btn.disabled = true;
  
  try {
    // Ask background.js to check the current URL
    const response = await chrome.runtime.sendMessage({
      action: 'checkUrl',
      url: window.currentTabUrl
    });
    
    // Show the result
    if (response.isMalicious) {
      // ⚠️ DANGEROUS SITE!
      showResult(
        'danger',
        `⚠️ THREAT DETECTED!`,
        `${response.domain} is a known malicious website. Do not enter any personal information!`
      );
    } else {
      // ✅ SAFE SITE
      showResult(
        'safe',
        `✅ Site Appears Safe`,
        `${response.domain} is not in our database of malicious sites.`
      );
    }
  } catch (error) {
    console.error('Error checking URL:', error);
    showResult(
      'error',
      '❌ Error',
      'Could not check the current page. Please try again.'
    );
  } finally {
    // Restore button to normal state
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

/**
 * Display a result message to the user
 * 
 * @param {string} type - 'danger', 'safe', or 'error'
 * @param {string} title - The heading of the message
 * @param {string} message - The detailed message
 */
function showResult(type, title, message) {
  // Determine the style based on type
  let className;
  if (type === 'danger') {
    className = 'warning';
  } else if (type === 'safe') {
    className = 'active';
  } else {
    className = 'info';
  }
  
  // Create a temporary result box
  const resultBox = document.createElement('div');
  resultBox.className = `status-box ${className}`;
  resultBox.innerHTML = `
    <strong>${title}</strong>
    <p>${message}</p>
  `;
  
  // Find the current page info box and insert result after it
  const currentPageBox = document.getElementById('currentPageInfo');
  currentPageBox.parentNode.insertBefore(resultBox, currentPageBox.nextSibling);
  
  // Remove the result after 5 seconds
  setTimeout(() => {
    resultBox.remove();
  }, 5000);
}

/**
 * Show the list of malicious domains
 * Opens in a new, formatted alert
 */
function viewMaliciousList() {
  // For now, just show an alert
  // In Phase 2, we could create a dedicated page for this
  alert(`
🛡️ MONITORED MALICIOUS DOMAINS

This extension currently monitors these known malicious domains:

• phishing-example.com
• malware-test.com
• scam-website.net
• fake-bank-login.com
• virus-download.org
• steal-passwords.net
• fake-paypal.com
• credit-card-scam.org

Note: This is just the local database. When you add 
Google Safe Browsing API (Phase 2), you'll have access 
to millions more malicious sites!
  `.trim());
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Extract just the domain from a full URL
 * Same function as in background.js
 * 
 * @param {string} url - Full URL
 * @returns {string|null} - Just the domain
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (e) {
    return null;
  }
}

// ==========================================
// DEVELOPMENT NOTES
// ==========================================

/*
 * HOW TO TEST THIS:
 * 
 * 1. Load the extension
 * 2. Click the extension icon - this popup should appear
 * 3. You should see:
 *    - The number of monitored domains
 *    - Your current page URL
 *    - All buttons working
 * 4. Click "Check Current Page" to test the checking function
 * 5. Click "View Malicious List" to see all monitored domains
 * 
 * FUTURE IMPROVEMENTS:
 * 
 * - Add a statistics counter for threats blocked
 * - Create a dedicated page for the malicious domains list
 * - Add settings page for customization
 * - Show recent scan history
 * - Add whitelist management
 */
