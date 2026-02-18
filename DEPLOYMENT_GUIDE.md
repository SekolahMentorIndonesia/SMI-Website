# SEO Deployment Guide - Sekolah Mentor Indonesia

## 📋 DEPLOYMENT CHECKLIST

### ✅ Pre-Deployment Validation
- [ ] Build successful (1.6MB total)
- [ ] All pages accessible: `/`, `/about`, `/program`, `/kelas`
- [ ] Meta tags complete (title, description, OG, Twitter)
- [ ] Structured data valid (Organization, Course, FAQ)
- [ ] Sitemap.xml updated with all pages
- [ ] Robots.txt pointing to correct domain
- [ ] 404.html ready with noindex

### 🚀 Deployment Commands

```bash
# Build production
npm run build

# Verify build size
du -sh build/  # Should be ~1.6MB

# Upload to Hostinger
rsync -av build/client/ user@hostinger:/public_html/

# Or manual upload via FTP/cPanel
# Upload entire build/client/ folder to public_html/
```

### 🔧 Hostinger Configuration

#### 1. File Permissions
```bash
# Set correct permissions
chmod 755 public_html/
chmod 644 public_html/*.html
chmod 644 public_html/*.css
chmod 644 public_html/*.js
chmod 755 public_html/assets/
```

#### 2. .htaccess Verification
Ensure `.htaccess` contains:
- ErrorDocument 404 /404.html
- Rewrite rules for SPA routing
- Security headers
- Cache expiration
- Gzip compression

#### 3. PHP Version (if needed)
Set PHP 8.1+ in cPanel for optimal performance

### 📊 Post-Deployment Validation

#### 1. Basic Checks
```bash
# Test homepage
curl -I https://smi.multipriority.com/

# Test specific pages
curl -I https://smi.multipriority.com/about
curl -I https://smi.multipriority.com/program
curl -I https://smi.multipriority.com/kelas

# Test 404
curl -I https://smi.multipriority.com/nonexistent-page
```

#### 2. SEO Validation Tools
- **Google PageSpeed Insights**: Test LCP, FID, CLS
- **Google Search Console**: Submit sitemap
- **Rich Results Test**: Validate structured data
- **Mobile-Friendly Test**: Check mobile compatibility

#### 3. Manual Testing
- [ ] Navigation works on all pages
- [ ] Forms submit correctly
- [ ] Images load with proper alt text
- [ ] Social sharing previews work
- [ ] Mobile responsive design
- [ ] Keyboard navigation (Tab, Enter, Space)

### 🔍 SEO Monitoring Setup

#### 1. Google Search Console
1. Add property: `https://smi.multipriority.com/`
2. Submit sitemap: `https://smi.multipriority.com/sitemap.xml`
3. Monitor indexing status
4. Check Core Web Vitals report

#### 2. Google Analytics 4
1. Verify GA4 tracking (G-4QKTE25P65)
2. Set up conversion goals (form submissions)
3. Monitor user behavior flow

#### 3. Performance Monitoring
```bash
# Regular performance checks
lighthouse https://smi.multipriority.com/ --output=json --output-path=./lighthouse-report.json

# Core Web Vitals monitoring
# Check Search Console > Core Web Vitals report
```

### 📈 Expected SEO Metrics

#### Target Scores (30 days post-deployment):
- **Technical SEO**: 85/100+
- **On-Page SEO**: 90/100+
- **Performance**: 75/100+
- **Accessibility**: 70/100+
- **Overall**: 80/100+

#### Ranking Targets:
- **Brand keywords**: Top 3 ("Sekolah Mentor Indonesia", "SMI")
- **Long-tail**: Page 1-2 ("kursus content creator", "belajar konten kreator")
- **Local**: Top 5 ("kursus content creator Jakarta")

### 🛠️ Troubleshooting

#### Common Issues:
1. **404 errors**: Check .htaccess rewrite rules
2. **Slow loading**: Verify gzip compression and caching
3. **Images not loading**: Check file paths and permissions
4. **SEO errors**: Validate meta tags and structured data

#### Quick Fixes:
```bash
# Clear browser cache
# Check .htaccess syntax
# Verify file permissions
# Test with incognito mode
```

### 📞 Support Contacts

#### Technical Support:
- Hostinger: 24/7 live chat
- Domain: Ensure DNS points to Hostinger

#### SEO Support:
- Google Search Console Help Center
- PageSpeed Insights documentation

---

## 🎯 SUCCESS METRICS

### Week 1:
- [ ] All pages indexed in Google
- [ ] No 404 errors in GSC
- [ ] Core Web Vitals "Good" rating

### Week 2:
- [ ] Brand keywords ranking
- [ ] Organic traffic increase 20%+

### Week 4:
- [ ] Long-tail keywords appearing
- [ ] Conversion tracking working
- [ ] Mobile traffic 60%+

### Month 3:
- [ ] Top 10 rankings for target keywords
- [ ] Organic traffic 50%+ increase
- [ ] Core Web Vitals consistently "Good"

---

**🚀 Website SMI siap untuk SEO success!**
