# Browser Tools MCP Integration Guide

## 🚀 **Overview**

Browser Tools MCP (Model Context Protocol) provides browser automation capabilities for your Property Cleaning Scheduler project. This allows for:

- **Automated Testing**: Browser-based testing of your Vue.js application
- **Web Scraping**: Data extraction from web pages
- **UI Testing**: Automated user interface testing
- **Performance Monitoring**: Browser performance analysis
- **Debugging**: Enhanced debugging capabilities

## 📦 **Installed Packages**

- `browser-tools-mcp`: Basic browser tools MCP server
- `@eqiz/browser-tools-mcp-enhanced`: Enhanced version with 36+ development tools

## 🛠️ **Usage**

### **Starting the MCP Server**

```bash
# Start enhanced browser tools MCP server
pnpm mcp:browser-tools

# Or start basic version
pnpm mcp:browser-tools:basic

# Or start enhanced version directly
pnpm mcp:browser-tools:enhanced
```

### **Integration with Your Project**

The Browser Tools MCP can be used with your existing setup:

1. **Development Mode**: Test your Vue.js app during development
2. **Production Testing**: Test built versions of your app
3. **E2E Testing**: Complement your existing Playwright tests
4. **PWA Testing**: Test PWA functionality and manifest

## 🔧 **Configuration**

### **MCP Configuration File**

The `mcp-browser-tools.json` file contains server configurations:

```json
{
  "mcpServers": {
    "browser-tools": {
      "command": "npx",
      "args": ["browser-tools-mcp"],
      "env": {
        "NODE_ENV": "development"
      }
    },
    "browser-tools-enhanced": {
      "command": "npx",
      "args": ["@eqiz/browser-tools-mcp-enhanced"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

## 🎯 **Use Cases for Your Project**

### **1. PWA Testing**
- Test manifest loading and PWA installation
- Verify service worker functionality
- Test offline capabilities

### **2. Role-Based UI Testing**
- Test owner interface functionality
- Test admin interface functionality
- Verify role-based access controls

### **3. Calendar Integration Testing**
- Test FullCalendar component interactions
- Verify booking creation and management
- Test responsive design on different screen sizes

### **4. Authentication Testing**
- Test login/logout flows
- Verify Supabase authentication integration
- Test role-based routing

### **5. Performance Testing**
- Monitor app performance in different browsers
- Test loading times and bundle sizes
- Analyze memory usage and CPU performance

## 🔍 **Available Tools (Enhanced Version)**

The enhanced browser tools MCP provides 36+ tools including:

- **Browser Control**: Open, close, navigate browsers
- **Element Interaction**: Click, type, scroll, hover
- **Screenshot & Recording**: Capture screenshots and record sessions
- **Network Analysis**: Monitor network requests and responses
- **Performance Analysis**: Analyze page performance metrics
- **Accessibility Testing**: Test accessibility compliance
- **SEO Analysis**: Analyze SEO metrics and meta tags
- **Console Logging**: Capture and analyze console logs
- **Cookie Management**: Manage browser cookies
- **Local Storage**: Access and modify local storage

## 🧪 **Testing Examples**

### **Test PWA Manifest Loading**
```javascript
// Example: Test that PWA manifest loads correctly
const manifest = await browser.getManifest();
console.log('PWA Manifest:', manifest);
```

### **Test Role-Based Navigation**
```javascript
// Example: Test owner dashboard access
await browser.navigateTo('http://localhost:3000/owner/dashboard');
const title = await browser.getPageTitle();
console.log('Page Title:', title);
```

### **Test Calendar Interactions**
```javascript
// Example: Test calendar booking creation
await browser.click('.calendar-add-booking-btn');
await browser.type('#booking-title', 'Test Booking');
await browser.click('.save-booking-btn');
```

## 🔗 **Integration with Existing Tests**

You can integrate Browser Tools MCP with your existing Playwright tests:

```javascript
// Example: Use Browser Tools MCP alongside Playwright
import { test, expect } from '@playwright/test';

test('PWA functionality with Browser Tools MCP', async ({ page }) => {
  // Playwright test
  await page.goto('http://localhost:3000');
  
  // Browser Tools MCP can be used for additional testing
  // This would be handled by the MCP server
});
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Server Won't Start**: Check if Node.js and npm are properly installed
2. **Connection Issues**: Verify the MCP server is running on the correct port
3. **Browser Compatibility**: Ensure you're using a supported browser (Chrome, Firefox, Safari)

### **Debug Mode**

Run the server in debug mode for more detailed logging:

```bash
DEBUG=* pnpm mcp:browser-tools:enhanced
```

## 📚 **Additional Resources**

- [Browser Tools MCP Documentation](https://github.com/eqiz/browser-tools-mcp-enhanced)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)

## 🔄 **Next Steps**

1. Start the MCP server: `pnpm mcp:browser-tools`
2. Configure your MCP client to connect to the server
3. Begin testing your application with browser automation
4. Integrate with your existing testing workflow

---

**Note**: Browser Tools MCP is a powerful tool for browser automation. Use it responsibly and ensure you have proper permissions for any web scraping or automation activities. 