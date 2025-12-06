# Quick Reference Guide

## 🚀 Quick Links

| Feature             | Documentation                                            | Status                |
| ------------------- | -------------------------------------------------------- | --------------------- |
| Blog Manager        | [BLOG_MANAGER_GUIDE.md](BLOG_MANAGER_GUIDE.md)           | ✅ Active             |
| Project Manager     | [PROJECT_MANAGER_GUIDE.md](PROJECT_MANAGER_GUIDE.md)     | ✅ Active             |
| Project Modal       | [PROJECT_MODAL_GUIDE.md](PROJECT_MODAL_GUIDE.md)         | ✅ Active             |
| Projects Page       | [PROJECTS_PAGE_GUIDE.md](PROJECTS_PAGE_GUIDE.md)         | ✅ Active             |
| Order System        | [ORDERS_SETUP.md](ORDERS_SETUP.md)                       | ⚠️ Migration Required |
| Webhook Integration | [WEBHOOK_INTEGRATION.md](WEBHOOK_INTEGRATION.md)         | ✅ Active             |
| Responsive Design   | [RESPONSIVE_GUIDE.md](RESPONSIVE_GUIDE.md)               | ✅ Active             |
| Supabase Setup      | [SUPABASE_SETUP.md](SUPABASE_SETUP.md)                   | ✅ Active             |
| Modal Background    | [MODAL_BACKGROUND_UPDATE.md](MODAL_BACKGROUND_UPDATE.md) | ✅ Active             |

## 🔧 Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=https://uupnygdqeeqehxkfrwkd.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Webhook
VITE_ORDER_WEBHOOK_URL=https://n8n-byzh91ql.n8x.biz.id/webhook/aenulporto-pricing
```

## 📦 Key Components

### Admin Components

- `src/pages/admin/BlogManager.tsx` - Blog content management
- `src/pages/admin/ProjectManager.tsx` - Project portfolio management
- `src/pages/admin/ContactManager.tsx` - Contact messages
- `src/pages/admin/PricingManager.tsx` - Pricing plans
- `src/pages/admin/ProfileEditor.tsx` - Profile settings
- `src/pages/admin/GeneralSettings.tsx` - Site settings

### Public Components

- `src/components/OrderModal.tsx` - Order form with webhook
- `src/components/ProjectModal.tsx` - Project detail modal
- `src/components/RichTextEditor.tsx` - Markdown editor
- `src/pages/Projects.tsx` - Projects showcase
- `src/pages/Pricing.tsx` - Pricing plans
- `src/pages/BlogDetail.tsx` - Blog post viewer

## 🎨 Key Features

### Rich Text Editor

- ✅ Markdown support with live preview
- ✅ Toolbar with formatting buttons
- ✅ Bold, italic, headings, lists, links, code
- ✅ Image upload support
- ✅ Split view (edit/preview)

### Project Modal

- ✅ Green/black theme
- ✅ 40 animated particles background
- ✅ Image gallery with navigation
- ✅ Tech stack display
- ✅ Key features grid
- ✅ Live demo & GitHub links

### Order System

- ✅ 3-step form validation
- ✅ Personal info → Project details → Requirements
- ✅ Custom dropdowns (no native select)
- ✅ Feature selection with quick-add
- ✅ Webhook notification to n8n
- ✅ Supabase database storage

### Webhook Integration

- ✅ Real-time notifications
- ✅ Complete order data payload
- ✅ Non-blocking (doesn't affect UX)
- ✅ Error handling with fallback
- ✅ n8n workflow ready

## 🗄️ Database Tables

| Table              | Purpose            | RLS |
| ------------------ | ------------------ | --- |
| `profiles`         | User profiles      | ✅  |
| `projects`         | Portfolio projects | ✅  |
| `blog_posts`       | Blog articles      | ✅  |
| `blog_comments`    | Blog comments      | ✅  |
| `pricing_plans`    | Pricing tiers      | ✅  |
| `contact_messages` | Contact form       | ✅  |
| `orders`           | Order submissions  | ✅  |

## 🚦 Setup Checklist

### Initial Setup

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Update Supabase credentials
- [ ] Run migrations in Supabase Dashboard

### Database Setup

- [ ] Run `001_initial_schema.sql`
- [ ] Run `002_seed_data.sql`
- [ ] Run `003_rls_policies.sql`
- [ ] Run `004_add_comment_replies.sql`
- [ ] Run `005_create_orders_table.sql`

### Webhook Setup

- [ ] Create n8n workflow
- [ ] Set webhook URL in `.env`
- [ ] Test webhook with sample order
- [ ] Configure notifications (email, Telegram, etc.)

### Development

- [ ] Run `npm run dev`
- [ ] Open http://localhost:5173
- [ ] Login to admin panel
- [ ] Test all features

## 🎯 Common Tasks

### Add New Project

1. Login to admin panel
2. Go to Project Manager
3. Fill form with project details
4. Add tech stack (manual or quick-add)
5. Add thumbnail, demo, and GitHub URLs
6. Save project

### Manage Orders

1. Check Supabase Dashboard → orders table
2. View order details
3. Update status (pending/approved/rejected)
4. Contact customer via email/phone

### Configure Webhook

1. Open `.env` file
2. Set `VITE_ORDER_WEBHOOK_URL`
3. Create n8n workflow
4. Test with sample order
5. Monitor n8n executions

### Update Blog Post

1. Login to admin panel
2. Go to Blog Manager
3. Edit post content
4. Use rich text editor for formatting
5. Add images via URL
6. Save changes

## 🐛 Troubleshooting

### Orders not saving (401 Error) ⚠️ MOST COMMON

**Error:** "new row violates row-level security policy"

**Quick Fix:** 👉 [RUN_THIS_SQL.md](RUN_THIS_SQL.md) (1 minute!)

**Steps:**

1. Open Supabase SQL Editor
2. Copy SQL from `RUN_THIS_SQL.md` or `007_orders_complete_setup.sql`
3. Run it
4. Test order form again ✅

### Orders not saving (404 Error)

- ✅ Check if migration 005 is run
- ✅ Verify table "orders" exists in Supabase
- ✅ Check browser console for errors

### Webhook not working

- ✅ Verify webhook URL in `.env`
- ✅ Check n8n workflow is active
- ✅ Test webhook URL with curl
- ✅ Check n8n execution logs
- ⚠️ Note: Order still saves even if webhook fails

### Images not loading

- ✅ Verify image URLs are valid
- ✅ Check CORS settings
- ✅ Use HTTPS URLs only

### Modal not opening

- ✅ Check browser console
- ✅ Verify component imports
- ✅ Check z-index conflicts

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
}

/* Desktop */
@media (min-width: 1025px) {
}
```

## 🔐 Admin Access

**Default Login:**

- Email: Set in Supabase Auth
- Password: Set in Supabase Auth

**Protected Routes:**

- `/admin/*` - All admin pages
- Requires authentication
- Auto-redirect to login if not authenticated

## 📊 Analytics & Monitoring

### Supabase Dashboard

- View all database tables
- Monitor API usage
- Check authentication logs
- Review RLS policies

### n8n Dashboard

- Monitor webhook executions
- View workflow logs
- Check error rates
- Test workflows manually

### Browser DevTools

- Console: Check for errors
- Network: Monitor API calls
- Application: Check localStorage
- Performance: Monitor load times

## 🎨 Customization

### Colors

Edit `src/index.css`:

```css
:root {
  --primary: #00ff88;
  --secondary: #00ccff;
  --accent: #ff00ff;
}
```

### Fonts

Edit `src/index.css`:

```css
body {
  font-family: "Your Font", sans-serif;
}
```

### Theme

Edit component styles or create theme context

## 📞 Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **n8n Docs:** https://docs.n8n.io
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev

---

**Last Updated:** December 5, 2024  
**Version:** 2.2  
**Status:** ✅ Production Ready
