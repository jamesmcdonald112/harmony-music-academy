# Project Setup & Deployment Checklist

This checklist tracks required setup steps for deploying and maintaining Astro-based client sites with email, DNS, and hosting.

---

## 1. Code & UI (Baseline)

- [ ] Info Pack form implemented
- [ ] Client-side + server-side validation
- [ ] Accessible error handling
- [ ] Thank-you page implemented
- [ ] Lighthouse scores 100 (Perf / A11y / SEO / BP)
- [ ] Tests passing
- [ ] Formatting enforced via Biome + Prettier
- [ ] Husky pre-commit / pre-push hooks working

---

## 2. Domain & DNS (Project Owner)

### Domain ownership
- [ ] Primary domain registered (e.g. `musicschoolsites.com`)
- [ ] Optional regional domain registered (e.g. `.ie`)
- [ ] Decide canonical domain (`.com` or `.ie`)
- [ ] Secondary domains redirect → canonical

### DNS basics
- [ ] Understand record types:
  - A / AAAA → website hosting
  - CNAME → subdomain aliases
  - MX → email delivery
  - TXT → SPF / DKIM / DMARC
- [ ] TTL set (24h acceptable for now)

---

## 3. Hosting (Vercel)

- [ ] Project deployed to Vercel
- [ ] Root domain connected (`@`)
- [ ] `www` subdomain connected
- [ ] Old hosting A records removed (e.g. SiteGround IP)
- [ ] Vercel DNS verification passes
- [ ] HTTPS active
- [ ] Redirects working correctly (www → root or vice versa)

---

## 4. Email – Business Mail (Owner)

### Decide email provider
- [ ] Zoho Mail **or**
- [ ] Google Workspace **or**
- [ ] Host-provided mail (low priority)

### Mailboxes
- [ ] `info@domain`
- [ ] personal mailbox (e.g. `james@domain`)
- [ ] Storage needs assessed (5–30 GB sufficient)

### DNS for mail
- [ ] MX records updated for provider
- [ ] SPF record valid
- [ ] DKIM configured
- [ ] DMARC present (`p=none` initially)

### Deliverability & brand (later)
- [ ] DMARC reporting mailbox/alias created (e.g. `dmarc@domain`) *only if you plan to read reports*
- [ ] Consider BIMI (logo in inbox) **later** — only after DMARC is enforced (`p=quarantine` or `p=reject`, `pct=100`) and SPF/DKIM are stable for all senders

---

## 5. Email – Transactional (Forms)

### Provider decision
- [ ] Resend selected for transactional email
- [ ] Alternative noted (AWS SES later)

### Resend setup
- [ ] Resend account created
- [ ] API key stored securely
- [ ] Sending domain added
- [ ] Domain verified (DNS)
- [ ] Test email sent successfully

### Usage rules
- [ ] One Resend account
- [ ] One sending domain per client
- [ ] No shared “from” domains between clients

---

## 6. Forms & Automation

- [ ] Contact form sends email
- [ ] Info pack form sends email + PDF
- [ ] Errors handled gracefully
- [ ] Rate limiting / spam protection considered
- [ ] Logs or alerts on failures

---

## 7. Accessibility & SEO

- [ ] Color contrast passes WCAG AA
- [ ] Placeholder text contrast verified
- [ ] Descriptive link text used
- [ ] Proper heading structure
- [ ] Canonical URL defined (if needed)
- [ ] Meta titles/descriptions unique per page

---

## 8. Client Scaling (Future)

- [ ] Client onboarding checklist created
- [ ] Per-client domain + DNS flow documented
- [ ] Email setup steps repeatable
- [ ] Decide when to migrate to AWS SES
- [ ] Decide when marketing email tools are needed (Mailchimp, etc.)

---

## 9. Documentation & Process

- [ ] This checklist reviewed before launch
- [ ] Checklist updated as stack evolves
- [ ] Repo usable as template
- [ ] Optional: GitHub issue templates created

---

## Notes

- DNS propagation can take up to 72 hours
- TTL can be lowered temporarily during changes
- Do **not** mix marketing and transactional email domains
- Avoid free SMTP providers for production