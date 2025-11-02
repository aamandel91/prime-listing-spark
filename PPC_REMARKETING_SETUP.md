# PPC Remarketing & Enhanced Conversions Setup Guide

This guide explains how to implement comprehensive PPC tracking, remarketing, and enhanced conversions for your real estate platform.

## Features Implemented

### 1. Enhanced Conversions for Google Ads
- Automatically hashes and sends user data (email, phone, name, address) to Google Ads
- Improves conversion tracking accuracy
- GDPR/Privacy compliant with SHA-256 hashing

### 2. Dynamic Property Remarketing
- Tracks property views with structured data
- Enables Google Ads dynamic remarketing campaigns
- Facebook dynamic product ads integration
- Property-specific audience building

### 3. Facebook Product Catalog Feed
**Endpoint:** `https://orzihyioizslidrqnyio.supabase.co/functions/v1/generate-facebook-catalog`

Generates an XML feed in Facebook catalog format containing all active properties. Use this URL in your Facebook Business Manager catalog settings.

### 4. Google Real Estate Feed
**Endpoint:** `https://orzihyioizslidrqnyio.supabase.co/functions/v1/generate-google-real-estate-feed`

Generates a Google-compatible real estate XML feed for display network remarketing.

### 5. Google Page Feed (Dynamic Search Ads)
**Endpoint:** `https://orzihyioizslidrqnyio.supabase.co/functions/v1/generate-page-feed`

Creates a page feed with structured data for dynamic search ad campaigns. Includes custom labels for advanced targeting.

### 6. Ad Customizers Feed
**Endpoint:** `https://orzihyioizslidrqnyio.supabase.co/functions/v1/generate-ad-customizers`

Generates a TSV file with property counts and statistics by city for dynamic ad copy. Perfect for ads like "View {PropertyCount} Homes in {City} Starting at {MinPrice}".

## Setup Instructions

### Google Ads Enhanced Conversions

1. **Enable Enhanced Conversions in Google Ads:**
   - Go to Google Ads > Tools > Conversions
   - Select your conversion action
   - Click "Settings" > "Enhanced conversions"
   - Enable enhanced conversions using Google Tag

2. **Update Conversion Tracking ID:**
   In the code, replace `AW-CONVERSION_ID` with your actual Google Ads conversion ID in:
   - `src/hooks/usePropertyRemarketing.ts` (line 41)

3. **Usage in Code:**
   ```typescript
   import { useEnhancedConversions } from '@/hooks/useEnhancedConversions';
   
   const { sendEnhancedConversion } = useEnhancedConversions();
   
   // Send conversion with user data
   await sendEnhancedConversion('purchase', {
     email: 'user@example.com',
     phone: '+1234567890',
     firstName: 'John',
     lastName: 'Doe',
     address: {
       street: '123 Main St',
       city: 'Miami',
       state: 'FL',
       zip: '33101',
       country: 'US'
     }
   }, {
     value: 450000,
     currency: 'USD'
   });
   ```

### Dynamic Property Remarketing

1. **Setup Google Ads Dynamic Remarketing:**
   - Create a Dynamic Remarketing campaign in Google Ads
   - Use "Real Estate" as the business type
   - Configure audience lists based on property views

2. **Track Property Views:**
   ```typescript
   import { usePropertyRemarketing } from '@/hooks/usePropertyRemarketing';
   
   const { trackPropertyView } = usePropertyRemarketing();
   
   // Track when user views a property
   trackPropertyView({
     id: 'MLS123456',
     address: '123 Main St',
     city: 'Miami',
     state: 'FL',
     zip: '33101',
     price: 450000,
     beds: 3,
     baths: 2,
     sqft: 2000,
     propertyType: 'Single Family',
     imageUrl: 'https://...'
   });
   ```

3. **Track Search Activity:**
   ```typescript
   const { trackSearch } = usePropertyRemarketing();
   
   trackSearch({
     city: 'Miami',
     state: 'FL',
     minPrice: 300000,
     maxPrice: 500000,
     beds: 3,
     propertyType: 'Single Family'
   });
   ```

### Facebook Dynamic Product Ads

1. **Setup Facebook Catalog:**
   - Go to Facebook Business Manager > Catalog Manager
   - Create a new catalog (Real Estate type)
   - Add Data Source > Data Feed
   - Use feed URL: `https://orzihyioizslidrqnyio.supabase.co/functions/v1/generate-facebook-catalog`
   - Set schedule: Update hourly or daily

2. **Create Dynamic Ads:**
   - Create a new campaign with "Catalog Sales" objective
   - Select your real estate catalog
   - Create dynamic ad templates
   - Use property data placeholders: `{product.name}`, `{product.price}`, etc.

### Google Real Estate Feed (Display Network)

1. **Setup in Google Merchant Center:**
   - Go to Google Merchant Center
   - Add a feed: Products > Feeds > Primary Feeds
   - Use feed URL: `https://orzihyioizslidrqnyio.supabase.co/functions/v1/generate-google-real-estate-feed`
   - Set fetch schedule: Daily

2. **Create Display Campaign:**
   - Create a Display campaign in Google Ads
   - Link your Merchant Center account
   - Use dynamic remarketing templates

### Google Page Feed (Dynamic Search Ads)

1. **Upload Page Feed:**
   - Go to Google Ads > Tools > Business Data > Page Feeds
   - Create new page feed
   - Add feed URL: `https://orzihyioizslidrqnyio.supabase.co/functions/v1/generate-page-feed`
   - Set update schedule

2. **Create DSA Campaign:**
   - Create a Dynamic Search Ads campaign
   - Use "Page feed" as the targeting source
   - Create ad copy with dynamic insertion
   - Use custom labels for targeting (property type, city, price range)

### Ad Customizers (Dynamic Ad Copy)

1. **Upload Ad Customizer Feed:**
   - Go to Google Ads > Tools > Business Data > Ad Customizers
   - Create new feed
   - Download: `https://orzihyioizslidrqnyio.supabase.co/functions/v1/generate-ad-customizers`
   - Upload the TSV file
   - Set update schedule (manual or via Google Sheets)

2. **Use in Ad Copy:**
   - In your ads, use: `{CUSTOMIZER.Property Count:50} homes in {CUSTOMIZER.Target location}`
   - Example: "View 127 homes in Miami starting at $350K"
   - The numbers update automatically from your feed

## Feed Update Schedules

All feeds are generated in real-time from your Repliers API data:
- **Facebook Catalog:** Set to update every 4-12 hours
- **Google Real Estate:** Daily updates recommended
- **Page Feed:** Daily or weekly
- **Ad Customizers:** Daily updates (can be automated via Google Sheets)

## Tracking Events

### Automatic Events:
- `view_item` - Property detail page view
- `search` - Property search performed
- `generate_lead` - Tour request, contact form submission

### Facebook Events:
- `ViewContent` - Property viewed
- `Search` - Search performed
- `Lead` - Lead generated

## Data Privacy & GDPR Compliance

- All user data is hashed using SHA-256 before sending to Google
- Facebook receives unhashed data but processes it securely
- User consent should be obtained via cookie consent banner
- PII is never stored in plain text in conversion tags

## Testing

1. **Test Enhanced Conversions:**
   - Submit a form with your email
   - Check Google Ads > Tools > Conversions > Diagnostics
   - Verify enhanced conversion data is received

2. **Test Remarketing:**
   - View property pages
   - Check Google Tag Assistant for proper event firing
   - Verify audience populations in Google Ads

3. **Test Feeds:**
   - Visit feed URLs directly
   - Verify XML/CSV format is correct
   - Check for all active properties

## Troubleshooting

### Enhanced Conversions Not Working:
- Verify Google Analytics/Tag Manager is loaded
- Check browser console for errors
- Ensure user data is being captured correctly
- Verify hashing is working (check console logs)

### Feeds Not Updating:
- Check Repliers API key is correct
- Verify API is returning data
- Check edge function logs in Supabase
- Test feed URL directly in browser

### Remarketing Tags Not Firing:
- Verify tracking codes are loaded on page
- Check for ad blockers
- Use Google Tag Assistant Chrome extension
- Check browser console for errors

## Performance Optimization

- All feeds are cached for 1 hour (`Cache-Control: public, max-age=3600`)
- Property data is fetched directly from Repliers API (no database caching needed)
- Feeds support up to 10,000 properties (adjust limit if needed)
- Consider implementing CDN caching for feeds

## Support & Maintenance

- Monitor edge function logs for errors
- Check feed health weekly in respective platforms
- Update remarketing audiences as needed
- Review conversion tracking monthly
- Test new property listings appear in feeds within 24 hours
