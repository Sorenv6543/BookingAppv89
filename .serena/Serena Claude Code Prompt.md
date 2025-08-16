# **Serena Project Setup Guide**

Thank you for watching my video\! This is a cheat-sheet for what to do when you are starting up a fresh project in Claude Code. You are awesome, thank you so much for watching my content. I hope this helps you get everything done that was on your plate today\!

## **Complete Order of Operations**

### **1\. Clone the Repository**

cd \~/Desktop  \# or wherever you keep projects  
git clone \<https://github.com/username/repo-name.git\>  
cd repo-name

### **2\. Add Serena to This Project**

claude mcp add serena \-- uvx \--from git+https://github.com/oraios/serena serena-mcp-server \--context ide-assistant \--project $(pwd)

### **3\. Start Claude Code**

claude \--dangerously-skip-permissions

### **4\. Load Serena Instructions**

/mcp\_\_serena\_\_initial\_instructions

### **5\. Let Serena Analyze & Organize the Project**

Please perform onboarding for this project. Analyze the codebase structure, identify key components, and create memories for future reference.

## **What Serena Will Do During Onboarding**

✅ **Scan the entire codebase** \- Understand file structure and relationships

✅ **Identify key components** \- Main modules, entry points, configuration files

✅ **Analyze dependencies** \- package.json, requirements.txt, etc.

✅ **Create project memories** \- Store important findings in `.serena/memories/`

✅ **Understand the tech stack** \- Language servers, frameworks, tools

✅ **Generate project summary** \- Overview of what the project does

## **Pro Tips**

### **For Large Projects (Optional but Recommended)**

Before starting Claude, index the project for faster performance:

uvx \--from git+https://github.com/oraios/serena index-project

### **After Onboarding, You Can Ask**

* "Summarize this project's architecture"  
* "What are the main entry points?"  
* "Show me the testing setup"  
* "What dependencies does this use?"  
* "Create a development roadmap"  
* "Find any obvious bugs or issues"

### **Your Project Will Get**

* `.serena/project.yml` \- Project configuration  
* `.serena/memories/` \- AI-generated documentation and insights  
* Language server integration for semantic code navigation

## **Example Full Workflow**

\# Clone  
git clone \<https://github.com/some-user/awesome-project.git\>  
cd awesome-project

\# Add Serena  
claude mcp add serena \-- uvx \--from git+https://github.com/oraios/serena serena-mcp-server \--context ide-assistant \--project $(pwd)

\# Start Claude  
claude \--dangerously-skip-permissions

Then in Claude:

/mcp\_\_serena\_\_initial\_instructions

Please perform onboarding for this project. I just cloned it and want to understand its structure, key components, and how everything fits together.

## **Quick Reference Commands**

### **Daily Workflow**

cd /path/to/project  
claude \--dangerously-skip-permissions

Then in Claude: `/mcp__serena__initial_instructions`

### **MCP Management**

* **Check status**: `claude mcp list`  
* **Remove Serena**: `claude mcp remove serena`  
* **Re-add if needed**: `claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena-mcp-server --context ide-assistant --project $(pwd)`

### **Optional Alias Setup**

Add to `~/.zshrc`:

alias claudestart='claude \--dangerously-skip-permissions'

Then reload: `source ~/.zshrc`

