#!/usr/bin/env python3
"""
Quick setup for Cursor AI Chat + Vuetify RAG integration
Creates everything needed for UI/UX layout optimization via chat
"""

import os
import json
import requests

class CursorChatVuetifySetup:
    """Setup Cursor AI Chat for Vuetify UI/UX work"""
    
    def __init__(self):
        self.rag_api_url = "http://localhost:8000"
        
    def setup_cursor_chat(self):
        """Complete setup for Cursor AI Chat integration"""
        
        print("🎯 Setting up Cursor AI Chat for Vuetify UI/UX Work")
        print("=" * 50)
        
        # Check RAG API status
        rag_status = self._check_rag_api()
        
        # Create .cursorrules file
        self._create_cursorrules()
        
        # Create prompt templates
        self._create_prompt_templates()
        
        # Create RAG integration examples
        self._create_rag_examples()
        
        # Create test scenarios
        self._create_test_scenarios()
        
        # Show usage instructions
        self._show_instructions(rag_status)
        
    def _check_rag_api(self):
        """Check if RAG API is running"""
        try:
            response = requests.get(f"{self.rag_api_url}/health", timeout=3)
            if response.status_code == 200:
                print("✅ RAG API is running and accessible")
                return True
            else:
                print("⚠️  RAG API responded but with error")
                return False
        except:
            print("⚠️  RAG API not running (will show setup instructions)")
            return False
    
    def _create_cursorrules(self):
        """Create .cursorrules optimized for chat interface"""
        
        cursorrules = '''# Vuetify UI/UX Layout Specialist for Cursor Chat

You are a specialized Vuetify UI/UX designer with comprehensive documentation knowledge.

## EXPERTISE CONTEXT
- 1,990 Vuetify documentation chunks processed
- 622 Vue code examples with complete implementations
- 695 components with API coverage
- Material Design 3 principles
- Responsive design patterns (mobile-first)
- Accessibility compliance (WCAG 2.1 AA)

## LAYOUT SPECIALIZATIONS
1. **Dashboard Layouts** - Admin panels, analytics, widgets
2. **E-commerce Interfaces** - Product pages, checkout optimization  
3. **Form Layouts** - Multi-step forms, validation patterns
4. **Navigation Systems** - Responsive nav, drawers, mobile menus
5. **Content Management** - Lists, grids, filters, data display

## RESPONSE STRUCTURE
For every layout request, provide:

### 1. Analysis
```
🔍 CURRENT LAYOUT ANALYSIS:
- Issues: [specific problems]
- Opportunities: [improvement areas]
- Mobile Impact: [mobile-specific concerns]
```

### 2. Strategy  
```
🎨 OPTIMIZATION STRATEGY:
- Responsive Approach: [mobile-first plan]
- Component Selection: [specific Vuetify components]
- Accessibility: [a11y enhancements]
- Performance: [optimization techniques]
```

### 3. Implementation
```vue
<!-- BEFORE: Current Layout -->
<template>
  <!-- existing problematic code -->
</template>

<!-- AFTER: Optimized Layout -->
<template>
  <!-- improved responsive code -->
</template>

<script setup lang="ts">
// Enhanced functionality with proper typing
</script>
```

### 4. Guidance
```
🛠️ IMPLEMENTATION NOTES:
- Key Changes: [what was modified]
- Responsive Behavior: [how it adapts]
- Accessibility Features: [a11y improvements]
- Performance Benefits: [optimization gains]
```

## COMPONENT PRIORITIES
Focus on these Vuetify components:
- **Layout**: v-app, v-main, v-container, v-row, v-col
- **Navigation**: v-app-bar, v-navigation-drawer, v-tabs, v-bottom-navigation
- **Content**: v-card, v-sheet, v-list, v-data-table, v-data-iterator
- **Forms**: v-form, v-text-field, v-select, v-btn, v-checkbox
- **Feedback**: v-alert, v-snackbar, v-dialog, v-progress-linear

## RESPONSIVE BREAKPOINT STRATEGY
Always implement mobile-first:
- **xs** (<600px): Single column, touch-optimized, simplified nav
- **sm** (600-960px): Tablet portrait, collapsible elements
- **md** (960-1264px): Tablet landscape, expanding content
- **lg** (1264-1904px): Desktop standard, full features
- **xl** (>1904px): Large desktop, enhanced spacing

## QUALITY STANDARDS
Every solution must include:
- ✅ Mobile-first responsive design
- ✅ Accessibility compliance (WCAG 2.1 AA)
- ✅ Performance optimization
- ✅ Material Design 3 principles
- ✅ TypeScript types (when beneficial)
- ✅ Error and loading states
- ✅ Clean, maintainable code structure

## LAYOUT PATTERNS TO RECOMMEND

### Dashboard Pattern:
```vue
<v-app>
  <v-app-bar :elevation="1" color="surface">
    <v-app-bar-nav-icon 
      v-if="$vuetify.display.mobile" 
      @click="drawer = !drawer" 
    />
    <v-toolbar-title>Dashboard</v-toolbar-title>
    <v-spacer />
    <v-btn icon="mdi-bell" />
  </v-app-bar>
  
  <v-navigation-drawer 
    v-model="drawer" 
    :rail="$vuetify.display.lgAndUp && !expanded"
    :temporary="$vuetify.display.mobile"
  >
    <!-- Responsive navigation -->
  </v-navigation-drawer>
  
  <v-main>
    <v-container fluid>
      <!-- Widget grid -->
    </v-container>
  </v-main>
</v-app>
```

### Mobile-Optimized Form:
```vue
<v-container class="pa-4">
  <v-card class="mx-auto" max-width="500">
    <v-card-title>Form Title</v-card-title>
    <v-card-text>
      <v-form v-model="valid" ref="formRef">
        <v-text-field
          v-model="field"
          :rules="rules"
          label="Field Label"
          variant="outlined"
          class="mb-3"
          hide-details="auto"
        />
        <!-- Mobile-optimized inputs -->
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn 
        :disabled="!valid" 
        :loading="loading"
        color="primary"
        variant="elevated"
        @click="submit"
      >
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</v-container>
```

Always prioritize user experience, accessibility, and performance in every recommendation.
'''
        
        with open(".cursorrules", "w") as f:
            f.write(cursorrules)
        
        print("✅ .cursorrules file created")
    
    def _create_prompt_templates(self):
        """Create ready-to-use chat prompt templates"""
        
        os.makedirs("cursor_vuetify_prompts", exist_ok=True)
        
        templates = {
            "basic_layout_optimization.txt": '''I'm working with a Vuetify project and have comprehensive documentation knowledge (1,990 chunks with 622 code examples covering all components).

Please optimize this layout following current Vuetify best practices:

[PASTE YOUR LAYOUT CODE HERE]

Requirements:
- Mobile-first responsive design
- Accessibility compliance (WCAG 2.1 AA)
- Material Design 3 styling
- Performance optimization
- Modern Vuetify 3.x patterns

Provide complete before/after code with detailed explanations for each improvement.''',

            "dashboard_optimization.txt": '''Based on comprehensive Vuetify documentation (including dashboard patterns from 695+ components), help me optimize this admin dashboard:

[PASTE YOUR DASHBOARD CODE HERE]

FOCUS AREAS:
- Responsive navigation drawer with mobile adaptation
- Widget-based content layout
- Real-time data integration patterns
- Mobile admin interface optimization
- Performance for large datasets

Apply current Vuetify dashboard best practices with complete working code.''',

            "mobile_first_redesign.txt": '''I have access to extensive Vuetify mobile patterns documentation. Please redesign this layout with mobile-first approach:

[PASTE YOUR CURRENT LAYOUT CODE HERE]

MOBILE REQUIREMENTS:
- Touch-friendly interactions (44px+ touch targets)
- Single-column layouts on small screens
- Optimized navigation for mobile
- Fast loading performance
- Accessibility compliance

Transform this into a mobile-optimized layout while maintaining desktop functionality.''',

            "form_enhancement.txt": '''Using comprehensive Vuetify form documentation and validation patterns, enhance this form layout:

[PASTE YOUR FORM CODE HERE]

ENHANCEMENT GOALS:
- Improved validation with reactive rules
- Mobile-optimized input behavior
- Accessibility features (ARIA labels, keyboard nav)
- Loading states and error handling
- Progressive disclosure for complex forms

Implement modern Vuetify form patterns with TypeScript support.''',

            "ecommerce_conversion.txt": '''Based on Vuetify e-commerce layout documentation, optimize this product/checkout interface for conversions:

[PASTE YOUR E-COMMERCE LAYOUT CODE HERE]

CONVERSION OPTIMIZATION:
- Clear product information hierarchy
- Prominent call-to-action placement
- Mobile checkout flow optimization
- Trust signals and security indicators
- Reduced friction in purchase process

Apply proven e-commerce layout patterns using Vuetify components.''',

            "accessibility_audit.txt": '''I need an accessibility audit and enhancement using Vuetify accessibility guidelines:

[PASTE YOUR LAYOUT CODE HERE]

ACCESSIBILITY REQUIREMENTS:
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support
- Color contrast optimization
- Focus management
- Semantic HTML structure

Provide specific accessibility improvements with code examples and explanations.''',

            "performance_optimization.txt": '''Using Vuetify performance best practices from comprehensive documentation, optimize this layout:

[PASTE YOUR LAYOUT CODE HERE]

PERFORMANCE GOALS:
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- Reduced bundle size impact
- Efficient component rendering

Apply Vuetify-specific performance optimizations with measurable improvements.'''
        }
        
        for filename, template in templates.items():
            with open(f"cursor_vuetify_prompts/{filename}", "w") as f:
                f.write(template)
        
        print(f"✅ {len(templates)} prompt templates created")
    
    def _create_rag_examples(self):
        """Create examples showing how to use RAG API with chat"""
        
        rag_examples = '''# Using Your RAG API with Cursor Chat

## Method 1: Research First, Then Chat

### Step 1: Query Your RAG API
```bash
# Get layout patterns
curl -X POST http://localhost:8000/ask \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Vuetify responsive dashboard navigation patterns",
    "context": "your current layout code",
    "type": "layout"
  }'

# Get component-specific help  
curl -X GET http://localhost:8000/component/v-navigation-drawer

# Search for patterns
curl -X GET http://localhost:8000/search?q=mobile+responsive+navigation
```

### Step 2: Use Results in Cursor Chat
```
I researched current Vuetify best practices using my documentation API and found these key recommendations:

RESEARCH FINDINGS:
- Navigation drawer should use rail mode on desktop
- Mobile navigation should be temporary with overlay
- Touch targets should be minimum 44px
- Navigation should support keyboard accessibility

Now please apply these documented patterns to optimize this layout:

[PASTE YOUR CURRENT CODE]

Implement these research findings while ensuring modern Vuetify 3.x compatibility.
```

## Method 2: Enhanced Context Prompts

Use these phrases to leverage your RAG knowledge:

### Documentation Authority Phrases:
- "Based on comprehensive Vuetify documentation analysis..."
- "Using research from 1,990 Vuetify documentation chunks..."
- "Following patterns from 622 verified code examples..."
- "According to current Vuetify best practices documentation..."

### Example Enhanced Prompt:
```
I have comprehensive Vuetify documentation research showing that current dashboard best practices include:

DOCUMENTED PATTERNS:
- Responsive navigation with v-navigation-drawer rail mode
- Mobile-first breakpoint strategy using $vuetify.display
- Widget grid layouts with v-row/v-col responsive props
- Accessibility-compliant navigation patterns

Please apply these documented patterns to optimize this dashboard:

[YOUR DASHBOARD CODE]

Ensure the implementation follows these research-backed best practices.
```

## Method 3: Component-Specific Research

### Research Template:
```bash
# Research specific component
curl -X POST http://localhost:8000/ask \\
  -d '{"query": "v-data-table responsive mobile optimization patterns", "type": "component"}'
```

### Chat Template:
```
My documentation research on v-data-table shows these mobile optimization patterns:

RESEARCH FINDINGS:
[PASTE RAG API RESPONSE HERE]

Please apply these documented v-data-table patterns to optimize this table:

[YOUR TABLE CODE]

Focus on implementing the research-backed mobile responsiveness techniques.
```

## Quick RAG Query Examples

```bash
# Dashboard layouts
curl -X POST http://localhost:8000/ask -d '{"query": "Vuetify admin dashboard responsive layout patterns"}'

# Form optimization  
curl -X POST http://localhost:8000/ask -d '{"query": "Vuetify form validation mobile accessibility patterns"}'

# Navigation systems
curl -X POST http://localhost:8000/ask -d '{"query": "Vuetify navigation drawer mobile responsive patterns"}'

# E-commerce layouts
curl -X POST http://localhost:8000/ask -d '{"query": "Vuetify product page layout conversion optimization"}'

# Performance optimization
curl -X POST http://localhost:8000/ask -d '{"query": "Vuetify layout performance optimization techniques"}'
```

## Integration Workflow

1. **Identify your layout challenge**
2. **Query RAG API for specific patterns**
3. **Use findings to enhance your Cursor chat prompt**
4. **Get implementation with documented best practices**
5. **Iterate based on results**

This approach gives you the benefits of your comprehensive RAG knowledge through Cursor's chat interface!
'''
        
        with open("cursor_vuetify_prompts/rag_integration_guide.md", "w") as f:
            f.write(rag_examples)
        
        print("✅ RAG integration examples created")
    
    def _create_test_scenarios(self):
        """Create test scenarios to try immediately"""
        
        os.makedirs("test_layouts", exist_ok=True)
        
        scenarios = {
            "basic_dashboard.vue": '''<template>
  <v-app>
    <v-app-bar color="primary" app>
      <v-toolbar-title>Basic Dashboard</v-toolbar-title>
    </v-app-bar>
    
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>Welcome</v-card-title>
              <v-card-text>
                This is a basic dashboard that needs mobile optimization
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<!-- 
TEST PROMPT:
Copy the "dashboard_optimization.txt" template and paste this code.
Focus on mobile responsiveness and navigation improvements.
-->''',

            "simple_form.vue": '''<template>
  <v-container>
    <v-card>
      <v-card-title>Contact Form</v-card-title>
      <v-card-text>
        <v-text-field label="Name" />
        <v-text-field label="Email" type="email" />
        <v-textarea label="Message" />
        <v-btn color="primary">Submit</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<!-- 
TEST PROMPT:
Use the "form_enhancement.txt" template with this code.
Focus on validation, accessibility, and mobile optimization.
-->''',

            "product_page.vue": '''<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-img src="/product.jpg" />
      </v-col>
      <v-col cols="6">
        <h1>Product Name</h1>
        <p>Product description goes here</p>
        <h2>$99.99</h2>
        <v-btn color="primary">Add to Cart</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<!-- 
TEST PROMPT:
Use the "ecommerce_conversion.txt" template with this code.
Focus on mobile responsiveness and conversion optimization.
-->'''
        }
        
        for filename, content in scenarios.items():
            with open(f"test_layouts/{filename}", "w") as f:
                f.write(content)
        
        print(f"✅ {len(scenarios)} test scenarios created")
    
    def _show_instructions(self, rag_running):
        """Show final setup instructions"""
        
        instructions = f'''

🎉 Setup Complete! Here's how to use your Vuetify UI/UX assistant:

📁 Files Created:
├── .cursorrules (copy this to your project root)
├── cursor_vuetify_prompts/ (ready-to-use chat templates)
├── test_layouts/ (sample layouts to practice with)
└── rag_integration_guide.md (how to use your RAG API)

🚀 Quick Start:

1. COPY RULES TO PROJECT:
   cp .cursorrules /your/project/root/

2. START CURSOR CHAT:
   Open Cursor and start a new chat session

3. TRY A TEMPLATE:
   Copy a prompt from cursor_vuetify_prompts/ and paste your layout code

4. GET OPTIMIZED LAYOUT:
   Receive mobile-first, accessible, performant Vuetify code

💡 Example First Prompt:
   Copy cursor_vuetify_prompts/basic_layout_optimization.txt
   Paste your layout code where indicated
   Get instant optimization with explanations

'''

        if rag_running:
            instructions += '''🔥 RAG API INTEGRATION:
Your RAG API is running! For enhanced results:

1. RESEARCH FIRST:
   curl -X POST http://localhost:8000/ask -d '{"query": "your layout question"}'

2. USE FINDINGS IN CHAT:
   "Based on my Vuetify documentation research: [paste RAG results]
   Now optimize this layout: [paste your code]"

3. GET ENHANCED RESULTS:
   Cursor will apply documented best practices to your specific layout
'''
        else:
            instructions += '''⚠️  RAG API SETUP:
To use your RAG API with Cursor chat:

1. START RAG API:
   python cursor_api_server.py

2. TEST CONNECTION:
   curl http://localhost:8000/health

3. USE ENHANCED PROMPTS:
   See rag_integration_guide.md for detailed examples
'''

        instructions += '''
📋 Best Practices:
- Always include your current layout code
- Specify your goals (mobile, accessibility, performance)
- Mention "comprehensive Vuetify documentation" in prompts
- Ask for complete implementations with explanations

🎯 Try These Right Now:
- Use test_layouts/basic_dashboard.vue with dashboard_optimization.txt
- Use test_layouts/simple_form.vue with form_enhancement.txt
- Use test_layouts/product_page.vue with ecommerce_conversion.txt

Your Cursor AI is now a Vuetify UI/UX expert! Start chatting! 🚀
'''
        
        print(instructions)

def main():
    """Main setup function"""
    setup = CursorChatVuetifySetup()
    setup.setup_cursor_chat()

if __name__ == "__main__":
    main()
