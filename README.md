<header>

<!--
  <<< Author notes: Course header >>>
  Include a 1280×640 image, course title in sentence case, and a concise description in emphasis.
  In your repository settings: enable template repository, add your 1280×640 social image, auto delete head branches.
  Add your open source license, GitHub uses MIT license.
-->

# Introduction to GitHub

_Get started using GitHub in less than an hour._

</header>

---

# 🕐 Clock-In/Clock-Out System with Session Persistence

A robust, production-ready attendance tracking system built with Google Apps Script that maintains session persistence across browser closures, phone restarts, and token expiration.

## 📋 Quick Links

- **[System Documentation](CLOCKIN_SYSTEM.md)** - Complete feature documentation
- **[Deployment Guide](DEPLOYMENT.md)** - Step-by-step deployment instructions
- **[Security Review](SECURITY.md)** - Security analysis and recommendations
- **[Usage Examples](examples.html)** - Interactive examples (when deployed)

## ✨ Key Features

### Session Persistence
- ✅ **30+ Day Sessions** - Sessions persist for over 30 days
- ✅ **Auto-Save Tokens** - Automatic session storage (no "Remember Me" required)
- ✅ **Browser Restart Recovery** - Sessions restore after closing browser
- ✅ **Phone Restart Recovery** - Works after phone restarts
- ✅ **Fallback Clock-Out** - Clock out without re-login if session expired

### Core Functionality
- ⏰ Clock-in/Clock-out tracking
- 📊 Duration calculation
- 👤 User management
- 📱 Mobile-optimized UI
- 💼 Leave management
- 🔐 Secure session management
- 📈 Admin reporting tools

## 🚀 Quick Start

### 1. Deploy the System

```bash
# Clone this repository
git clone https://github.com/Mishra-Aniket/skills-introduction-to-github.git

# Follow the deployment guide
# See DEPLOYMENT.md for detailed instructions
```

### 2. Files Included

```
├── code.gs                 # Main backend logic
├── AdminRegistration.gs    # Admin functions
├── index.html             # Main UI
├── leave.html             # Leave management
├── examples.html          # Usage examples
├── Tests.gs               # Test suite
├── appsscript.json        # Configuration
├── CLOCKIN_SYSTEM.md      # Documentation
├── DEPLOYMENT.md          # Deployment guide
└── SECURITY.md            # Security review
```

### 3. Access the System

Once deployed, users can:
1. Open the web app URL
2. Login with name and email
3. Clock in/out with persistent sessions
4. Recover sessions after browser closure
5. Manage leave requests

## 🎯 Use Cases

### Perfect For
- ✅ Small-to-medium teams (1-200 users)
- ✅ Remote workers
- ✅ Mobile workforce
- ✅ Flexible work arrangements
- ✅ Internal company use

### Key Scenarios
- **Mobile Workers**: Clock in from phone, close app, return later to clock out
- **Phone Restarts**: Session recovery after device restart
- **Browser Crashes**: Auto-restore sessions from localStorage
- **Token Expiration**: Fallback clock-out without re-authentication
- **Multi-Device**: Use on both phone and computer with separate sessions

## 📱 Session Persistence Features

### How It Works

```
User Login → Token Created → Saved to localStorage
                          → Saved to Google Sheets
                          → 30-day expiration set

Browser Close → localStorage persists

Browser Reopen → Auto-validate session
              → Restore user state
              → Continue working

Session Expired? → Recover via email
                → Restore open clock-in
                → Complete work record
```

### Three-Level Recovery

1. **Level 1: Automatic** - Token valid, session auto-restored
2. **Level 2: Recovery** - Token expired, email-based recovery
3. **Level 3: Fallback** - No session, but can clock out if open clock-in exists

## 🛠️ For Administrators

### Admin Functions Available

```javascript
// View all users
getAllUsers()

// Check open sessions
getAllOpenSessions()

// Force clock out a user
forceClockOut(userId)

// Generate reports
generateAttendanceReport(startDate, endDate)

// System statistics
getSystemStats()

// Cleanup old data
cleanupExpiredSessions()

// Backup data
backupData()
```

### Setup Automated Maintenance

```javascript
// Run once to schedule daily cleanup
setupAutomatedCleanup()
```

## 🧪 Testing

Run the test suite in Apps Script editor:

```javascript
// Run all tests
runAllTests()

// Quick test
quickTest()

// Clean up test data
cleanupTestData()
```

## 🔒 Security

- ✅ Cryptographically random session tokens (UUID)
- ✅ Server-side session validation
- ✅ 30-day expiration enforcement
- ✅ XSS protection via HtmlService
- ✅ HTTPS enforced by Google Apps Script
- ✅ Input validation (client + server)
- ✅ Audit trail for all actions

**Security Rating**: GOOD ✅ (See [SECURITY.md](SECURITY.md) for details)

## 📊 Architecture

### Data Structure

**Attendance Sheet**
- User ID, Name, Email
- Clock In Time, Clock Out Time
- Date, Duration, Status

**Sessions Sheet**
- Session Token, User ID, Email
- Created At, Expires At, Last Access
- Active status

**Users Sheet**
- User ID, Name, Email
- Created At, Active status

### Technology Stack

- **Backend**: Google Apps Script (JavaScript)
- **Database**: Google Sheets
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: localStorage + server-side

## 📖 Documentation

### Complete Guides Available

1. **[CLOCKIN_SYSTEM.md](CLOCKIN_SYSTEM.md)**
   - Feature documentation
   - Architecture details
   - API reference
   - Troubleshooting

2. **[DEPLOYMENT.md](DEPLOYMENT.md)**
   - Step-by-step deployment
   - Configuration guide
   - Testing procedures
   - Maintenance tasks

3. **[SECURITY.md](SECURITY.md)**
   - Security analysis
   - Vulnerability assessment
   - Best practices
   - Recommendations

## 🤝 Contributing

This is a production-ready system. For improvements:

1. Test changes thoroughly
2. Update documentation
3. Run security review
4. Submit with detailed description

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🆘 Support

### Troubleshooting

**Session not persisting?**
- Check localStorage is enabled
- Verify session token exists
- Use session recovery feature

**Can't clock out after restart?**
1. Click "Recover Session"
2. Enter your email
3. Session will restore with open clock-in

**Need help?**
- Check [CLOCKIN_SYSTEM.md](CLOCKIN_SYSTEM.md) troubleshooting section
- Review execution logs in Apps Script
- Verify all files are deployed correctly

## 📈 Version

**Current Version**: 1.0.0
**Release Date**: November 2025
**Status**: Production Ready ✅

---



<!--
  <<< Author notes: Step 1 >>>
  Choose 3-5 steps for your course.
  The first step is always the hardest, so pick something easy!
  Link to docs.github.com for further explanations.
  Encourage users to open new tabs for steps!
-->

## Step 1: Create a branch

_Welcome to "Introduction to GitHub"! :wave:_

**What is GitHub?**: GitHub is a collaboration platform that uses _[Git](https://docs.github.com/get-started/quickstart/github-glossary#git)_ for versioning. GitHub is a popular place to share and contribute to [open-source](https://docs.github.com/get-started/quickstart/github-glossary#open-source) software.
<br>:tv: [Video: What is GitHub?](https://www.youtube.com/watch?v=pBy1zgt0XPc)

**What is a repository?**: A _[repository](https://docs.github.com/get-started/quickstart/github-glossary#repository)_ is a project containing files and folders. A repository tracks versions of files and folders. For more information, see "[About repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories)" from GitHub Docs.

**What is a branch?**: A _[branch](https://docs.github.com/en/get-started/quickstart/github-glossary#branch)_ is a parallel version of your repository. By default, your repository has one branch named `main` and it is considered to be the definitive branch. Creating additional branches allows you to copy the `main` branch of your repository and safely make any changes without disrupting the main project. Many people use branches to work on specific features without affecting any other parts of the project.

Branches allow you to separate your work from the `main` branch. In other words, everyone's work is safe while you contribute. For more information, see "[About branches](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-branches)".

**What is a profile README?**: A _[profile README](https://docs.github.com/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme)_ is essentially an "About me" section on your GitHub profile where you can share information about yourself with the community on GitHub.com. GitHub shows your profile README at the top of your profile page. For more information, see "[Managing your profile README](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme)".

![profile-readme-example](/images/profile-readme-example.png)

### :keyboard: Activity: Your first branch

1. Open a new browser tab and navigate to your newly made repository. Then, work on the steps in your second tab while you read the instructions in this tab.
2. Navigate to the **< > Code** tab in the header menu of your repository.

   ![code-tab](/images/code-tab.png)

3. Click on the **main** branch drop-down.

   ![main-branch-dropdown](/images/main-branch-dropdown.png)

4. In the field, name your branch `my-first-branch`. In this case, the name must be `my-first-branch` to trigger the course workflow.
5. Click **Create branch: my-first-branch** to create your branch.

   ![create-branch-button](/images/create-branch-button.png)

   The branch will automatically switch to the one you have just created.
   The **main** branch drop-down bar will reflect your new branch and display the new branch name.

6. Wait about 20 seconds then refresh this page (the one you're following instructions from). [GitHub Actions](https://docs.github.com/en/actions) will automatically update to the next step.

<footer>

<!--
  <<< Author notes: Footer >>>
  Add a link to get support, GitHub status page, code of conduct, license link.
-->

---

Get help: [Post in our discussion board](https://github.com/orgs/skills/discussions/categories/introduction-to-github) &bull; [Review the GitHub status page](https://www.githubstatus.com/)

&copy; 2024 GitHub &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [MIT License](https://gh.io/mit)

</footer>
