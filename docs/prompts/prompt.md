> Use the @project_summary.md to fully understand the project then look Use @repomix-output.md for a reference to the current codebase. Use task.md look at what has been done and what still needs to be done
> 

## For this Task..

1. Plan: use sequential thinking to break down task to make them easier to understand. Use the context7 resolve-library-id tool to find the most relevant documentation,examples or patterns for the task, then use get-library-docs to then retrieve them. 

2. Implement: use results of context7 and @project_summary.md to assist in the current task

3. Integrate: Ensure implementation fits the broader project architecture and patterns


## Key Patterns to Follow:
- 
- Follow the HomeAdmin.vue and OwnerAdmin.vue central orchestrator pattern
- Maintain turn vs standard booking distinction in all business logic
- Reference existing composables and stores for consistency
- Implement proper TypeScript typing and error handling

## Before Marking Complete:
- [ ] TypeScript compiles without errors
- [ ] Follows established naming conventions
- [ ] Integrates with existing stores/composables
- [ ] Includes basic error handling
- [ ] Updates any dependent interfaces/types