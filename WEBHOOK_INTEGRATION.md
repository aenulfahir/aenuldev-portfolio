# Webhook Integration Guide

## Overview

Aplikasi portfolio ini terintegrasi dengan n8n webhook untuk mengirim notifikasi real-time setiap ada order baru dari pricing page.

## Webhook URL

```env
VITE_ORDER_WEBHOOK_URL=https://n8n-byzh91ql.n8x.biz.id/webhook/aenulporto-pricing
```

## How It Works

### Flow Diagram

```
User Submit Order
    ↓
Save to Supabase Database
    ↓
Send to n8n Webhook (POST)
    ↓
n8n Workflow Triggered
    ↓
Notifications Sent (Email, Telegram, etc.)
```

### Implementation

File: `src/components/OrderModal.tsx`

```typescript
// After saving to Supabase
const webhookUrl = import.meta.env.VITE_ORDER_WEBHOOK_URL;
if (webhookUrl) {
  await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...orderData,
      order_id: insertedOrder?.id,
      submitted_at: new Date().toISOString(),
    }),
  });
}
```

## Webhook Payload

### Complete Data Structure

```json
{
  "order_id": "550e8400-e29b-41d4-a716-446655440000",
  "plan_id": "web-developer",
  "plan_title": "Web Developer",
  "plan_price": "5.000.000",

  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+62 812 3456 7890",
  "company": "PT Example Indonesia",

  "project_name": "Company Website Redesign",
  "project_description": "We need a modern, responsive website...",
  "timeline": "1-2 weeks",
  "budget": "5-10 million",
  "target_audience": "Young professionals, B2B clients",
  "preferred_start_date": "2024-12-15",

  "selected_features": [
    "SEO Optimization",
    "Analytics Integration",
    "Social Media Integration"
  ],
  "additional_features": "Need custom blog system with comments",

  "design_preference": "modern",
  "has_existing_design": "no",
  "has_content_ready": "yes",

  "additional_notes": "Please contact via WhatsApp first",

  "status": "pending",
  "created_at": "2024-12-05T10:30:00.000Z",
  "submitted_at": "2024-12-05T10:30:00.000Z"
}
```

### Field Descriptions

| Field                  | Type       | Description                                            |
| ---------------------- | ---------- | ------------------------------------------------------ |
| `order_id`             | UUID       | Unique order ID from database                          |
| `plan_id`              | string     | Plan identifier (web-developer, fullstack, enterprise) |
| `plan_title`           | string     | Display name of the plan                               |
| `plan_price`           | string     | Price in Rupiah format                                 |
| `full_name`            | string     | Customer's full name                                   |
| `email`                | string     | Customer's email address                               |
| `phone`                | string     | Customer's phone number                                |
| `company`              | string     | Company/organization name (optional)                   |
| `project_name`         | string     | Name of the project                                    |
| `project_description`  | string     | Detailed project description                           |
| `timeline`             | string     | Expected timeline (1-2 weeks, 2-4 weeks, etc.)         |
| `budget`               | string     | Budget range                                           |
| `target_audience`      | string     | Target audience description                            |
| `preferred_start_date` | string     | ISO date or null                                       |
| `selected_features`    | array      | List of additional features selected                   |
| `additional_features`  | string     | Custom features description                            |
| `design_preference`    | string     | Design style (modern, minimalist, etc.)                |
| `has_existing_design`  | string     | yes/no/partial                                         |
| `has_content_ready`    | string     | yes/no/partial                                         |
| `additional_notes`     | string     | Any additional information                             |
| `status`               | string     | Order status (always "pending" on submit)              |
| `created_at`           | ISO string | Database timestamp                                     |
| `submitted_at`         | ISO string | Webhook submission timestamp                           |

## n8n Workflow Examples

### Example 1: Email Notification

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "aenulporto-pricing",
        "responseMode": "onReceived",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "fromEmail": "admin@example.com",
        "toEmail": "admin@example.com",
        "subject": "New Order: {{ $json.project_name }}",
        "text": "New order from {{ $json.full_name }}\nPlan: {{ $json.plan_title }}\nEmail: {{ $json.email }}\nPhone: {{ $json.phone }}"
      }
    }
  ]
}
```

### Example 2: Telegram Notification

```json
{
  "name": "Send Telegram",
  "type": "n8n-nodes-base.telegram",
  "parameters": {
    "chatId": "YOUR_CHAT_ID",
    "text": "🎉 *New Order Received!*\n\n*Plan:* {{ $json.plan_title }}\n*Customer:* {{ $json.full_name }}\n*Email:* {{ $json.email }}\n*Phone:* {{ $json.phone }}\n*Project:* {{ $json.project_name }}\n*Budget:* {{ $json.budget }}\n*Timeline:* {{ $json.timeline }}"
  }
}
```

### Example 3: Google Sheets Integration

```json
{
  "name": "Add to Google Sheets",
  "type": "n8n-nodes-base.googleSheets",
  "parameters": {
    "operation": "append",
    "sheetId": "YOUR_SHEET_ID",
    "range": "Orders!A:Z",
    "values": [
      "{{ $json.order_id }}",
      "{{ $json.plan_title }}",
      "{{ $json.full_name }}",
      "{{ $json.email }}",
      "{{ $json.phone }}",
      "{{ $json.project_name }}",
      "{{ $json.budget }}",
      "{{ $json.timeline }}",
      "{{ $json.created_at }}"
    ]
  }
}
```

### Example 4: Auto-Reply Email to Customer

```json
{
  "name": "Send Confirmation Email",
  "type": "n8n-nodes-base.emailSend",
  "parameters": {
    "fromEmail": "noreply@example.com",
    "toEmail": "{{ $json.email }}",
    "subject": "Order Confirmation - {{ $json.project_name }}",
    "html": "<h2>Thank you for your order!</h2><p>Hi {{ $json.full_name }},</p><p>We've received your order for <strong>{{ $json.plan_title }}</strong> plan.</p><p>Our team will review your requirements and contact you within 24 hours.</p><p><strong>Order Details:</strong></p><ul><li>Project: {{ $json.project_name }}</li><li>Timeline: {{ $json.timeline }}</li><li>Budget: {{ $json.budget }}</li></ul><p>Best regards,<br>Your Team</p>"
  }
}
```

## Error Handling

### Webhook Failure

Jika webhook gagal (network error, n8n down, etc.):

- ✅ Order tetap tersimpan di Supabase database
- ✅ User tetap melihat success message
- ⚠️ Error hanya di-log di browser console
- ⚠️ Tidak ada retry mechanism

### Why This Approach?

1. **User Experience First** - User tidak perlu tahu jika webhook gagal
2. **Data Integrity** - Order data tetap aman di database
3. **Manual Fallback** - Admin bisa cek orders di Supabase Dashboard
4. **Non-Critical** - Webhook hanya untuk notifikasi, bukan core functionality

### Monitoring Webhook Failures

Check browser console untuk error:

```javascript
console.error("Webhook notification failed:", webhookError);
```

## Testing Webhook

### 1. Local Testing

```bash
# Start development server
npm run dev

# Open browser
http://localhost:5173

# Go to Pricing page
# Submit an order
# Check n8n workflow execution
```

### 2. Test Webhook Manually

```bash
curl -X POST https://n8n-byzh91ql.n8x.biz.id/webhook/aenulporto-pricing \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "test-123",
    "plan_title": "Web Developer",
    "full_name": "Test User",
    "email": "test@example.com",
    "phone": "+62 812 3456 7890",
    "project_name": "Test Project",
    "status": "pending"
  }'
```

### 3. Check n8n Execution

1. Login to n8n: https://n8n-byzh91ql.n8x.biz.id
2. Open workflow
3. Check "Executions" tab
4. Verify data received correctly

## Security Considerations

### Current Implementation

- ✅ HTTPS connection
- ✅ No sensitive authentication data sent
- ✅ Public webhook (no authentication required)

### Recommended Improvements

1. **Add Webhook Secret**

   ```typescript
   headers: {
     "Content-Type": "application/json",
     "X-Webhook-Secret": import.meta.env.VITE_WEBHOOK_SECRET
   }
   ```

2. **Verify in n8n**

   ```javascript
   // In n8n workflow
   if ($json.headers["x-webhook-secret"] !== "YOUR_SECRET") {
     throw new Error("Invalid webhook secret");
   }
   ```

3. **Rate Limiting**
   - Implement rate limiting di n8n
   - Prevent spam/abuse

## Troubleshooting

### Webhook not receiving data

**Check:**

1. ✅ Environment variable set correctly
2. ✅ n8n workflow is active
3. ✅ Webhook URL is accessible
4. ✅ Network/firewall not blocking

**Solution:**

```bash
# Test webhook URL
curl -I https://n8n-byzh91ql.n8x.biz.id/webhook/aenulporto-pricing
# Should return 200 OK
```

### Data not formatted correctly

**Check:**

1. ✅ JSON.stringify() used
2. ✅ Content-Type header set
3. ✅ All required fields present

**Debug:**

```typescript
console.log("Sending to webhook:", JSON.stringify(orderData, null, 2));
```

### CORS errors

**Solution:**

- n8n webhooks should handle CORS automatically
- If issues persist, configure CORS in n8n settings

## Environment Variables

### Development (.env.local)

```env
VITE_ORDER_WEBHOOK_URL=https://n8n-byzh91ql.n8x.biz.id/webhook/aenulporto-pricing
```

### Production (.env.production)

```env
VITE_ORDER_WEBHOOK_URL=https://n8n-byzh91ql.n8x.biz.id/webhook/aenulporto-pricing
```

### Disable Webhook (Optional)

```env
# Comment out or remove to disable webhook
# VITE_ORDER_WEBHOOK_URL=
```

## Best Practices

1. ✅ **Always save to database first** - Webhook is secondary
2. ✅ **Don't block user on webhook failure** - Show success immediately
3. ✅ **Log errors for debugging** - Use console.error()
4. ✅ **Keep payload lightweight** - Only send necessary data
5. ✅ **Use environment variables** - Never hardcode URLs
6. ✅ **Test thoroughly** - Test both success and failure scenarios

## Related Files

- `src/components/OrderModal.tsx` - Order form with webhook integration
- `.env` - Environment variables
- `.env.example` - Environment template
- `ORDERS_SETUP.md` - Database setup guide
- `supabase/migrations/005_create_orders_table.sql` - Database schema

---

**Created:** December 5, 2024  
**Status:** ✅ Active  
**Webhook URL:** https://n8n-byzh91ql.n8x.biz.id/webhook/aenulporto-pricing
