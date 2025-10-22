# Follow Up Boss Integration

This project is fully integrated with Follow Up Boss CRM to automatically track and send lead data for real estate properties.

## Features

The integration automatically tracks and sends the following events to Follow Up Boss:

### 1. **Property Views** (`Viewed Property`)
- Triggered when a user opens a property detail modal
- Sends complete property information including:
  - Address, city, state, zip code
  - MLS number
  - Price
  - Bedrooms, bathrooms, square footage
  - Property type

### 2. **Saved Properties** (`Saved Property`)
- Triggered when a user saves a property to their favorites
- Includes all property details
- Helps identify highly interested leads

### 3. **Property Searches** (`Property Search`)
- Triggered when users search for properties with filters
- Captures search criteria:
  - Price range (min/max)
  - Number of bedrooms/bathrooms
  - Location (city, state, zip, county, subdivision)
  - Property type preferences

### 4. **Property Inquiries** (`Property Inquiry`)
- Available for contact forms and tour requests
- Includes:
  - Complete property details
  - User contact information
  - Custom inquiry message

### 5. **User Registration** (`Registration`)
- Tracks new user signups
- Captures user contact details

### 6. **General Inquiries** (`General Inquiry`)
- For contact forms not related to specific properties
- Captures inquiry messages

## Data Mapping

The integration maps as many data points as possible from your property listings to Follow Up Boss:

### Property Object Fields
- `street`: Property address
- `city`: Property city
- `state`: Property state
- `code`: ZIP code
- `mlsNumber`: MLS listing number
- `price`: Property price
- `forRent`: false (all properties are for sale)
- `url`: Direct link to property listing
- `type`: Property type (Single Family, Condo, etc.)
- `bedrooms`: Number of bedrooms
- `bathrooms`: Number of bathrooms
- `area`: Square footage
- `lot`: Lot size (if available)

### Person Object Fields
- `firstName`: User's first name
- `lastName`: User's last name
- `emails`: Array of email addresses
- `phones`: Array of phone numbers
- `addresses`: User's address(es)

### Property Search Object Fields
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `bedrooms`: Bedroom filter
- `bathrooms`: Bathroom filter
- `propertyType`: Type of property
- `city`: City filter
- `state`: State filter
- `zipCode`: ZIP code filter

## Technical Implementation

### Edge Function
The integration uses a Supabase Edge Function (`followup-boss-event`) that:
- Authenticates with Follow Up Boss API using Basic Auth
- Transforms local property data to FUB format
- Handles CORS for frontend requests
- Provides detailed logging for debugging
- Returns appropriate success/error responses

### React Hook
The `useFollowUpBoss` hook provides easy-to-use methods:

```typescript
const { trackPropertyView, trackPropertySave, trackPropertySearch } = useFollowUpBoss();

// Track a property view
trackPropertyView({
  id: '123',
  address: '123 Main St',
  city: 'Miami',
  state: 'FL',
  price: 500000,
  beds: 3,
  baths: 2,
  sqft: 2000
});

// Track a property save
trackPropertySave({ /* property data */ });

// Track a search
trackPropertySearch({
  minPrice: 300000,
  maxPrice: 500000,
  beds: 3,
  city: 'Miami'
});
```

### Automatic Tracking
The integration is already wired into:
- `PropertyDetailModal` - tracks views and saves automatically
- `Listings` page - tracks searches when users apply filters

## Configuration

### Required Secret
The integration requires your Follow Up Boss API key to be configured in Lovable Cloud Secrets:
- Secret name: `FOLLOWUP_BOSS_API_KEY`
- Value: Your FUB API key (found in FUB Settings → API)

### Source Attribution
Events are automatically tagged with:
- `source`: Your website domain (automatically extracted)
- `system`: "PropertyListingWebsite"

## API Responses

### Success Responses
- **200**: Event created successfully, contact updated
- **201**: Event created, new contact created
- **204**: Lead flow archived/ignored (event received but not processed)

### Error Responses
- **404**: Person ID provided but not found
- **500**: API error or misconfiguration

## Event Types and Automation Triggers

According to Follow Up Boss documentation, these event types trigger automations:
- ✅ **Registration** - Triggers action plans and automations
- ✅ **Property Inquiry** - Triggers action plans and automations
- ✅ **Seller Inquiry** - Triggers action plans and automations
- ✅ **General Inquiry** - Triggers action plans and automations
- ⚠️ **Viewed Property** - Creates event but doesn't trigger automations
- ⚠️ **Saved Property** - Creates event but doesn't trigger automations
- ⚠️ **Property Search** - Creates event but doesn't trigger automations

## Best Practices

1. **Collect User Information**: To get the most value, collect user contact details (name, email, phone) during registration or property inquiries
2. **Test Events**: Monitor your FUB dashboard to verify events are being received
3. **Configure Action Plans**: Set up action plans in FUB to automatically respond to inquiries and registrations
4. **Review Lead Quality**: Use FUB's reporting to track which property types and price ranges generate the most leads

## Debugging

Edge function logs are available in Lovable Cloud → Functions → followup-boss-event

Look for:
- "Event data received" - Shows what data was sent
- "Sending to Follow Up Boss" - Shows the transformed payload
- "FUB API response" - Shows FUB's response

## Future Enhancements

Potential additions:
- Track tour requests as "Visited Open House" events
- Send page view analytics as "Viewed Page" events
- Track email opens/clicks if email features are added
- Integration with listing agent assignments via `assignedTo` field
