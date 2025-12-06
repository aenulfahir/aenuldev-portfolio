# n8n Webhook Setup Guide

## Error: Webhook Not Registered

Jika Anda mendapat error ini di browser console:

```
Webhook failed with status: 404
{"code":404,"message":"The requested webhook \"POST aenulporto-pricing\" is not registered."}
```

**Penyebab:** Workflow n8n belum dibuat atau tidak aktif.

## Setup n8n Workflow

### Step 1: Login ke n8n

1. Buka: https://n8n-byzh91ql.n8x.biz.id
2. Login dengan credentials Anda

### Step 2: Create New Workflow

1. Click "New Workflow" atau "+" button
2. Beri nama: "AenulPorto - Order Notifications"

### Step 3: Add Webhook Node

1. Click "+" untuk add node
2. Search "Webhook"
3. Select "Webhook" node
4. Configure:
   - **HTTP Method:** POST
   - **Path:** `aenulporto-pricing`
   - **Response Mode:** "On Received"
   - **Response Code:** 200

### Step 4: Add Notification Nodes

Pilih salah satu atau beberapa:

#### Option A: Email Notification

1. Add "Send Email" node
2. Connect dari Webhook
3. Configure:

   - **From Email:** your-email@example.com
   - **To Email:** admin@example.com
   - **Subject:** `New Order: {{ $json.project_name }}`
   - **Text/HTML:**

   ```
   New order received!

   Customer: {{ $json.full_name }}
   Email: {{ $json.email }}
   Phone: {{ $json.phone }}

   Plan: {{ $json.plan_title }}
   Price: Rp {{ $json.plan_price }}

   Project: {{ $json.project_name }}
   Description: {{ $json.project_description }}

   Timeline: {{ $json.timeline }}
   Budget: {{ $json.budget }}

   Order ID: {{ $json.id }}
   Submitted: {{ $json.submitted_at }}
   ```

#### Option B: Telegram Notification

1. Add "Telegram" node
2. Connect dari Webhook
3. Configure:

   - **Chat ID:** Your Telegram chat ID
   - **Text:**

   ```
   🎉 *New Order Received!*

   *Customer:* {{ $json.full_name }}
   *Email:* {{ $json.email }}
   *Phone:* {{ $json.phone }}

   *Plan:* {{ $json.plan_title }}
   *Price:* Rp {{ $json.plan_price }}

   *Project:* {{ $json.project_name }}
   *Timeline:* {{ $json.timeline }}
   *Budget:* {{ $json.budget }}

   *Order ID:* {{ $json.id }}
   ```

#### Option C: Discord Notification

1. Add "Discord" node
2. Connect dari Webhook
3. Configure:

   - **Webhook URL:** Your Discord webhook URL
   - **Content:**

   ```
   🎉 **New Order Received!**

   **Customer:** {{ $json.full_name }}
   **Email:** {{ $json.email }}
   **Phone:** {{ $json.phone }}

   **Plan:** {{ $json.plan_title }}
   **Price:** Rp {{ $json.plan_price }}

   **Project:** {{ $json.project_name }}
   **Timeline:** {{ $json.timeline }}
   ```

#### Option D: Google Sheets

1. Add "Google Sheets" node
2. Connect dari Webhook
3. Configure:
   - **Operation:** Append
   - **Sheet ID:** Your Google Sheet ID
   - **Range:** A:Z
   - **Values:**
     - {{ $json.id }}
     - {{ $json.full_name }}
     - {{ $json.email }}
     - {{ $json.phone }}
     - {{ $json.plan_title }}
     - {{ $json.project_name }}
     - {{ $json.timeline }}
     - {{ $json.budget }}
     - {{ $json.submitted_at }}

### Step 5: Activate Workflow

**IMPORTANT:** Workflow harus AKTIF!

1. Click toggle switch di top-right corner
2. Pastikan status berubah menjadi "Active" (hijau)
3. Jika tidak aktif, webhook tidak akan menerima request

### Step 6: Test Webhook

#### Test dari n8n:

1. Click "Test Workflow" button
2. Webhook node akan menunggu request
3. Submit order dari aplikasi
4. Check apakah data masuk

#### Test manual dengan curl:

```bash
curl -X POST https://n8n-byzh91ql.n8x.biz.id/webhook/aenulporto-pricing \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-123",
    "plan_title": "Web Developer",
    "plan_price": "5.000.000",
    "full_name": "Test User",
    "email": "test@example.com",
    "phone": "+62 812 3456 7890",
    "project_name": "Test Project",
    "project_description": "This is a test",
    "timeline": "1-2 weeks",
    "budget": "5-10 million",
    "status": "pending",
    "submitted_at": "2024-12-05T10:00:00Z"
  }'
```

## Webhook Payload Structure

Data yang dikirim ke webhook:

```json
{
  "id": "uuid",
  "plan_id": "web-developer",
  "plan_title": "Web Developer",
  "plan_price": "5.000.000",
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+62 812 3456 7890",
  "company": "PT Example",
  "project_name": "Company Website",
  "project_description": "We need a modern website...",
  "timeline": "1-2 weeks",
  "budget": "5-10 million",
  "selected_features": ["SEO Optimization", "Analytics"],
  "additional_features": "Custom blog system",
  "design_preference": "modern",
  "target_audience": "Young professionals",
  "has_existing_design": "no",
  "has_content_ready": "yes",
  "preferred_start_date": "2024-12-15",
  "additional_notes": "Please contact via WhatsApp",
  "status": "pending",
  "created_at": "2024-12-05T10:30:00Z",
  "submitted_at": "2024-12-05T10:30:00Z"
}
```

## Troubleshooting

### Webhook returns 404

**Problem:** Workflow tidak aktif atau path salah

**Solution:**

1. Check workflow is ACTIVE (toggle switch on)
2. Verify path is exactly: `aenulporto-pricing`
3. Check HTTP method is POST

### Webhook returns 500

**Problem:** Error di workflow execution

**Solution:**

1. Check n8n "Executions" tab for error details
2. Verify all nodes are configured correctly
3. Test each node individually

### Data not showing in notification

**Problem:** Field mapping salah

**Solution:**

1. Use `{{ $json.field_name }}` syntax
2. Check field names match payload structure
3. Test with sample data first

### Webhook works but order not in database

**Problem:** Different issue - check Supabase

**Solution:**

1. Webhook is separate from database save
2. Check browser console for database errors
3. Verify RLS policies are correct

## Production Checklist

Before going live:

- [ ] Workflow is ACTIVE
- [ ] Webhook path is correct: `aenulporto-pricing`
- [ ] Notification nodes configured
- [ ] Test with real order submission
- [ ] Check executions log shows success
- [ ] Verify notifications received
- [ ] Monitor for errors

## Monitoring

### Check Executions:

1. Go to n8n Dashboard
2. Click "Executions" in sidebar
3. See all webhook triggers
4. Click on execution to see details
5. Check for errors or warnings

### View Logs:

Each execution shows:

- Input data received
- Each node's output
- Errors if any
- Execution time

## Advanced: Multiple Notifications

You can add multiple notification nodes:

```
Webhook → Email
       → Telegram
       → Discord
       → Google Sheets
       → Slack
```

All will execute in parallel when order is received!

---

**Webhook URL:** https://n8n-byzh91ql.n8x.biz.id/webhook/aenulporto-pricing  
**Status:** Must be ACTIVE  
**Method:** POST  
**Content-Type:** application/json
