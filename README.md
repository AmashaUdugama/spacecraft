<div align="center">

# 📚 Library Management System
**A Modern Web-Based Solution for Digital Library Operations**

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=2563EB&center=true&vCenter=true&width=435&lines=Welcome+to+Library+Management;Multi-Role+Access+System;Built+with+PHP+%26+Tailwind;Fast+%26+Efficient+Operations" alt="Typing SVG" />


[![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://javascript.com)

---
</div>

## 🎯 Overview
The Library Management System is a comprehensive web application designed to streamline library operations across three distinct user roles. Built with modern web technologies, it provides an intuitive interface for managing books, users, and borrowing activities.

## ✨ Features
### 🎓 Student Portal
| Feature | Description |
|---------|-------------|
| **Book Search & Browse** | Fast and accurate catalogue search with advanced filters |
| **Borrowing Management** | Easy book borrowing and return processes |
| **Personal Dashboard** | View borrowing history, current loans, and due dates |
| **Notifications** | Receive alerts for due dates and library announcements |

### 👩‍💼 Librarian Portal
| Feature | Description |
|---------|-------------|
| **Book Management** | Add, update, remove, and categorize book records |
| **User Administration** | Manage student accounts and borrowing privileges |
| **Transaction Processing** | Handle book issuing and returning operations |
| **Records Maintenance** | Comprehensive borrowing history and overdue tracking |
| **Reporting Tools** | Generate reports on library usage and inventory |

### ⚙️ Admin Portal
| Feature | Description |
|---------|-------------|
| **System Oversight** | Monitor overall library system performance |
| **Staff Management** | Create and manage librarian accounts |
| **Configuration** | System settings and parameter adjustments |
| **Analytics Dashboard** | Advanced reporting and usage analytics |

---
## 📸 System Dashboards

### 🎓 Student Dashboard
<div align="center">
<img src="images/454shots_so.png" alt="Student Dashboard" width="800" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</div>

### 👩‍💼 Librarian Dashboard
<div align="center">
<img src="images/580shots_so.png" alt="Librarian Dashboard" width="800" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</div>

### ⚙️ Admin Dashboard
<div align="center">
<img src="images/467shots_so.png" alt="Admin Dashboard" width="800" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</div>

<table>
<tr>
<td width="10%">

### 📋 PREREQUISITES CHECKLIST

```yaml
🔧 System Requirements:
  ├── 💻 Windows OS
  ├── 🌐 WAMP Server 3.0+
  ├── 🐘 PHP 7.4+
  ├── 🗄️ MySQL 5.7+
  ├── 🌍 Modern Web Browser
  └── 💾 500MB+ Storage
```

</td>
</tr>
</table>

## 📁 Project Architecture

```
📦 librarymanagementsystem/
├──  admin_dashboard.php             # Admin portal files
├── librarian_dashboard.php          # Librarian portal files  
├── student_dashboard.php            # Student portal files
├──  pages/ 
│   ├── index.css                    # Common CSS files
│   └── assets/                      # CSS files
├── 🔧 login.php                     # Login and authentication
├── 🔐 logout.php                    # Logout script
├── 📂 register.php                  # User registration
├── 📜 README.md                     # Project documentation
├── 🗄️ database/                     # Database files
|         |__ libraryms.sql          # Database connection script
├── config.php                       # Configuration files
└── 🏠 index.php                     # Main entry point
└──  admin.js                       # Admin-specific scripts
└──  librarian.js                    # Librarian-specific scripts
└──  main.js                        # Common scripts
```

### ⚡ Installation Steps


<b>Step 1: WAMP Server Setup</b>

```bash
# Download WAMP Server from official website
# 🌐 Visit: http://www.wampserver.com/
# 📥 Download and install WAMP64
# ▶️ Start WAMP Server
# 🟢 Wait for green icon (all services running)
```


<b>Step 2: Setup Project</b>

```bash
# 📋 Copy project to WAMP directory
# Default path: C:\wamp64\www\librarymanagementsystem\

# 🗄️ Setup Database
# 1. Open phpMyAdmin: http://localhost/phpmyadmin
# 2. Create database: libraryms
# 3. Import SQL file (if available)
```
### 3. Project Deployment
1. Copy the project folder to WAMP's `www` directory:
   ```
   C:\wamp64\www\librarymanagementsystem\
   ```
2. Ensure all files are properly placed in the directory

### 4. Configuration
1. Update database connection settings in `config/database.php`:
   ```php
   $host = "localhost";
   $username = "root";
   $password = "";
   $database = "libraryMS";
   ```

## 🌐 Running the Application

1. Start WAMP Server
2. Open your web browser
3. Navigate to: `http://localhost/librarymanagementsystem/`
4. Use the appropriate login credentials for your role

## 🔐 Default Login Credentials

### Administrator Access
- **Email**: admin@gmail.com
- **Password**: password
- **Portal**: Admin Dashboard

### Librarian Access
- **Email**: librarian@gmail.com
- **Password**: 12345678
- **Portal**: Librarian Dashboard

### Student Access
- **Email**: student@gmail.com
- **Password**: 12345678
- **Portal**: Student Dashboard
---
## 🐛 Known Issues & Limitations

- **Online Book Reservations Unavailable**: The system currently lacks functionality for students to pre-book library materials through the web interface.

- **Notification System Missing**: Automatic messaging capabilities for due date reminders and overdue book alerts via email or SMS have not been implemented.

- **XAMPP Local Environment Only**: System operates exclusively on local XAMPP server infrastructure without cloud-based or internet deployment options.

- **Web-Only Interface**: No dedicated mobile application exists; system lacks mobile device optimization features.

- **Performance Limitations at Scale**: Architecture targets small to medium educational library environments; may experience degraded performance with extensive data volumes.

- **Standard Security Implementation**: While password encryption is active, enhanced security measures such as Two-Factor Authentication remain unimplemented.

- **English-Only User Interface**: System provides exclusively English language support, potentially creating accessibility barriers for non-English speaking users.

- **Basic Report Generation**: System offers fundamental borrowing and overdue item reports; comprehensive analytical tools and advanced reporting features are not available.
---

<div align="center">
<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=36BCF7&center=true&vCenter=true&width=435&lines=Thank+you+for+visiting!;Happy+Coding!+%F0%9F%9A%80;" alt="Typing SVG" />
</div>
