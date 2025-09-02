# Development Workflow with Testing Branch

I've created a `testing` branch for safe development. Here's how to use it:

## 🌟 **Current Branch Setup:**

- **`main`** → Production branch (deployed to public site)
- **`testing`** → Development branch (for testing changes)

## 🔄 **Recommended Workflow:**

### 1. **Development (Current)**
```bash
# You're now on the testing branch
git branch  # Shows: * testing
```

### 2. **Making Changes**
- **All edits** go to `testing` branch first
- **Test thoroughly** before merging to main
- **Deploy testing branch** to a preview environment (optional)

### 3. **When Ready to Publish**
```bash
# Switch to main branch
git checkout main

# Merge testing changes
git merge testing

# Push to production
git push origin main
```

### 4. **Continue Development**
```bash
# Switch back to testing for next changes
git checkout testing
```

## 🚀 **Vercel Deployment Options:**

### Option A: Single Deployment (Current)
- **Main branch** → Production site
- **Testing branch** → Manual testing only

### Option B: Dual Deployment (Recommended)
- **Main branch** → `meridian-procure.vercel.app` (production)
- **Testing branch** → `meridian-procure-testing.vercel.app` (preview)

## 🎯 **Benefits of This Workflow:**

### ✅ **Safety**
- **No breaking changes** go live immediately
- **Test thoroughly** before public release
- **Rollback easily** if issues found

### ✅ **Quality Control**
- **Preview changes** before going live
- **Client review** on testing branch
- **Catch issues** before customers see them

### ✅ **Professional Process**
- **Standard development practice**
- **Change tracking** through pull requests
- **Documentation** of what changed when

## 📋 **Quick Commands:**

```bash
# Check current branch
git branch

# Switch to testing
git checkout testing

# Switch to main
git checkout main

# See differences between branches
git diff main..testing

# Merge testing to main
git checkout main && git merge testing
```

## 🔧 **Setting Up Preview Deployment (Optional):**

1. **In Vercel Dashboard:**
   - Add new project for testing branch
   - Connect to same GitHub repo
   - Set branch to `testing`
   - Use subdomain like `meridian-testing.vercel.app`

2. **Environment Variables:**
   - Copy all env vars from main project
   - Test with same configuration

## 📝 **Current Status:**

- ✅ **Testing branch created** and pushed to GitHub
- ✅ **You're now on testing branch** for all future changes
- ✅ **Main branch protected** from direct edits
- ✅ **Ready for safe development**

## 🎯 **Next Steps:**

1. **Continue development** on testing branch
2. **Test changes thoroughly**
3. **Merge to main** when ready to publish
4. **Optional:** Set up preview deployment in Vercel

Your development process is now much safer and more professional!