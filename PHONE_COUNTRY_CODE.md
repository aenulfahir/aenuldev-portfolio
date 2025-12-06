# Phone Number with Country Code Selector

## Feature

Phone number input sekarang dilengkapi dengan country code selector untuk memudahkan user dari berbagai negara.

## UI Design

```
┌─────────────────┬──────────────────────────────┐
│ 🇮🇩 +62 ▼      │ 812 3456 7890                │
└─────────────────┴──────────────────────────────┘
   Country Code      Phone Number
```

## Supported Countries

24 negara dengan country codes paling umum:

| Flag | Country        | Code |
| ---- | -------------- | ---- |
| 🇮🇩   | Indonesia      | +62  |
| 🇺🇸   | United States  | +1   |
| 🇬🇧   | United Kingdom | +44  |
| 🇮🇳   | India          | +91  |
| 🇨🇳   | China          | +86  |
| 🇯🇵   | Japan          | +81  |
| 🇰🇷   | South Korea    | +82  |
| 🇸🇬   | Singapore      | +65  |
| 🇲🇾   | Malaysia       | +60  |
| 🇹🇭   | Thailand       | +66  |
| 🇻🇳   | Vietnam        | +84  |
| 🇵🇭   | Philippines    | +63  |
| 🇦🇺   | Australia      | +61  |
| 🇩🇪   | Germany        | +49  |
| 🇫🇷   | France         | +33  |
| 🇮🇹   | Italy          | +39  |
| 🇪🇸   | Spain          | +34  |
| 🇷🇺   | Russia         | +7   |
| 🇧🇷   | Brazil         | +55  |
| 🇲🇽   | Mexico         | +52  |
| 🇿🇦   | South Africa   | +27  |
| 🇦🇪   | UAE            | +971 |
| 🇸🇦   | Saudi Arabia   | +966 |
| 🇹🇷   | Turkey         | +90  |

## How It Works

### 1. Default Value

- Default country code: **+62** (Indonesia)
- User bisa mengubah sesuai negara mereka

### 2. User Experience

1. User klik dropdown country code
2. Pilih negara/code yang sesuai
3. Ketik nomor telepon (tanpa country code)
4. System otomatis gabungkan: `{countryCode} {phone}`

### 3. Data Storage

Phone number disimpan dalam format lengkap:

```
+62 812 3456 7890
+1 555 123 4567
+44 20 7946 0958
```

## Implementation

### Form Data Structure

```typescript
const [formData, setFormData] = useState({
  // ... other fields
  countryCode: "+62", // Default Indonesia
  phone: "", // Phone number without code
});
```

### Submission

```typescript
const orderData = {
  // ... other fields
  phone: `${formData.countryCode} ${formData.phone}`,
};
```

### UI Component

```typescript
<div style={{ display: "flex", gap: "0.5rem" }}>
  {/* Country Code Selector - 140px width */}
  <CustomSelect
    value={formData.countryCode}
    onChange={(value) =>
      setFormData((prev) => ({
        ...prev,
        countryCode: value,
      }))
    }
    options={countryCodes.map((c) => ({
      value: c.code,
      label: `${c.flag} ${c.code}`,
    }))}
  />

  {/* Phone Number Input - Flexible width */}
  <input
    type="tel"
    name="phone"
    value={formData.phone}
    placeholder="812 3456 7890"
  />
</div>
```

## Validation

Phone validation tetap sama:

```typescript
if (!formData.phone.trim()) {
  newErrors.phone = "Phone number is required";
}
```

Country code tidak perlu validasi karena sudah dipilih dari dropdown.

## Examples

### Indonesia

- Country Code: 🇮🇩 +62
- Input: `812 3456 7890`
- Saved: `+62 812 3456 7890`

### United States

- Country Code: 🇺🇸 +1
- Input: `555 123 4567`
- Saved: `+1 555 123 4567`

### Singapore

- Country Code: 🇸🇬 +65
- Input: `9123 4567`
- Saved: `+65 9123 4567`

## Responsive Design

### Desktop

```
┌─────────────────┬──────────────────────────────┐
│ 🇮🇩 +62 ▼      │ 812 3456 7890                │
└─────────────────┴──────────────────────────────┘
```

### Mobile

```
┌─────────────────┐
│ 🇮🇩 +62 ▼      │
└─────────────────┘
┌─────────────────┐
│ 812 3456 7890   │
└─────────────────┘
```

Layout otomatis adjust dengan flexbox.

## Customization

### Add More Countries

Edit `countryCodes` array di `OrderModal.tsx`:

```typescript
const countryCodes = [
  { code: "+62", country: "🇮🇩 Indonesia", flag: "🇮🇩" },
  // Add more countries here
  { code: "+XX", country: "🏳️ Country Name", flag: "🏳️" },
];
```

### Change Default Country

Update initial state:

```typescript
const [formData, setFormData] = useState({
  // ...
  countryCode: "+1", // Change to your default
  // ...
});
```

Also update reset:

```typescript
setFormData({
  // ...
  countryCode: "+1", // Match default
  // ...
});
```

## Benefits

1. ✅ **International Support** - Users dari berbagai negara bisa order
2. ✅ **Better UX** - Tidak perlu ketik country code manual
3. ✅ **Consistent Format** - Phone numbers tersimpan dalam format standar
4. ✅ **Visual Flags** - Mudah identify negara dengan emoji flags
5. ✅ **Validation Ready** - Format konsisten memudahkan validasi

## Testing

1. Open order form
2. Go to Step 1 (Personal Info)
3. Click country code dropdown
4. Select different country
5. Enter phone number
6. Submit form
7. Check database - phone should be: `{code} {number}`

## Files Changed

- ✅ `src/components/OrderModal.tsx`
  - Added `countryCode` to formData
  - Added `countryCodes` array
  - Updated phone input UI
  - Updated phone data combination
  - Updated form reset

---

**Status:** ✅ Active  
**Date:** December 5, 2024  
**Countries:** 24 supported  
**Default:** 🇮🇩 Indonesia (+62)
