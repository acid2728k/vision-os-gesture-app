# Security Policy

## 🔒 Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 0.9.x   | :white_check_mark: |
| < 0.9   | :x:                |

## 🚨 Reporting a Vulnerability

Please report (suspected) security vulnerabilities to **[security@example.com](mailto:security@example.com)**. You will receive a response within 48 hours. If the issue is confirmed, we will release a patch as soon as possible depending on complexity but historically within a few days.

## 📋 Security Best Practices

When using this application:

1. **Camera Access**: Only grant camera access to trusted websites
2. **HTTPS**: Always use HTTPS in production
3. **Dependencies**: Keep dependencies up to date
4. **Browser**: Use a modern, updated browser

## 🔐 Known Security Considerations

- This application requires camera access to function
- MediaPipe models are loaded from CDN (jsdelivr.net)
- No data is sent to external servers (runs entirely client-side)
- All processing happens locally in the browser

## 📝 Disclosure Policy

- We will acknowledge your email within 48 hours
- We will provide a detailed response within 7 days
- We will keep you informed of the progress towards fixing the vulnerability
- We will notify you when the vulnerability has been fixed

Thank you for helping keep VISION_OS and our users safe!

