# Git Workflow Guide for Claude Code Agent

## ⚠️ Important: Do NOT Use Direct Git Commands

This repository is managed through Claude Code's automated workflow. **Direct `git` commands will fail with permission errors.**

## Problem: Permission Denied Errors

If you see errors like:
```
remote: Permission to Sorenv6543/BookingAppv89.git denied to [username].
fatal: unable to access 'https://github.com/Sorenv6543/BookingAppv89.git/': The requested URL returned error: 403
```

**This means direct git commands were used instead of the proper workflow.**

## ✅ Correct Workflow

### To Commit and Push Changes

**Use the `report_progress` tool:**

```
report_progress(
  commitMessage: "Brief description of changes",
  prDescription: "Detailed checklist of changes made"
)
```

The tool automatically:
- Stages all changes (`git add .`)
- Creates a commit with your message
- Pushes to the remote branch
- Updates the PR description

### To Check Repository Status

You **CAN** use read-only git commands:
```bash
git status          # ✅ Check working tree status
git log             # ✅ View commit history
git diff            # ✅ View changes
git branch          # ✅ List branches
```

### What You CANNOT Do

```bash
git push            # ❌ Will fail with 403 permission error
git commit          # ❌ Use report_progress instead
gh pr create        # ❌ PR management handled automatically
git push --force    # ❌ Force push not available
```

## Environment Details

- **Sandboxed Environment**: Limited GitHub credential access
- **Authentication**: Managed by Claude Code infrastructure
- **Branch Protection**: Enforced through report_progress tool
- **PR Updates**: Automatic through report_progress

## Troubleshooting

### "Permission denied" error
- **Cause**: Used `git push` directly
- **Solution**: Use `report_progress` tool instead

### "Credential manager" errors  
- **Cause**: Attempted manual credential management
- **Solution**: Credentials handled automatically; no manual intervention needed

### Changes not appearing in PR
- **Cause**: Didn't use `report_progress` after making changes
- **Solution**: Call `report_progress` to commit and push changes

## Best Practices

1. **Make changes to files** using edit/create tools
2. **Verify changes** with view/bash tools  
3. **Commit and push** using `report_progress`
4. **Never** attempt manual git push commands

## Related Documentation

- See environment limitations in Claude Code configuration
- See custom instructions for development workflow
- See report_progress tool documentation
