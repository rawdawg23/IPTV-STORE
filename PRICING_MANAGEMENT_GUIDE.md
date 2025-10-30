# Pricing Management Guide

This guide explains how to manage pricing data in your MERN IPTV application database.

## Overview

The pricing system has been moved from hardcoded values to a database-driven approach, allowing you to:
- Update prices dynamically
- Manage plan features
- Control plan availability
- Set popular plans
- Track pricing statistics

## Database Structure

### Pricing Model (`Server/models/Pricing.js`)

Each pricing plan includes:
- **Basic Info**: plan name, description, prices
- **Features**: channels, quality, connections, VOD library, premium sports
- **Status**: active/inactive, popular flag
- **Pricing**: monthly and yearly prices
- **Metadata**: sort order, discount percentage, trial days

## Setup Instructions

### 1. Seed Initial Pricing Data

Run the pricing seed script to populate the database with initial pricing plans:

```bash
cd Server
npm run seed-pricing
```

This will create three default plans:
- **Basic**: $15/month, $144/year
- **Standard**: $25/month, $240/year (marked as popular)
- **Premium**: $40/month, $384/year

### 2. Verify Database Connection

Ensure your MongoDB connection is working and the pricing collection is created.

## Managing Pricing Data

### Method 1: Admin Panel (Recommended)

1. **Access Admin Panel**: Navigate to `/admin` in your application
2. **Pricing Tab**: Click on the "Pricing" tab
3. **Real-time Updates**: 
   - Edit prices directly in the input fields
   - Toggle plan active/inactive status
   - Set/remove popular plan designation
   - Update channel counts and connections

### Method 2: API Endpoints

#### Get All Pricing Plans
```bash
GET /api/pricing
```

#### Get Specific Plan
```bash
GET /api/pricing/{plan}
# Example: GET /api/pricing/basic
```

#### Update Pricing Plan
```bash
PUT /api/pricing/{plan}
Content-Type: application/json

{
  "monthlyPrice": 20,
  "yearlyPrice": 192,
  "features": {
    "channels": 150,
    "quality": "HD",
    "connections": 2
  }
}
```

#### Toggle Plan Status
```bash
PUT /api/pricing/{plan}/toggle
```

#### Set Popular Plan
```bash
PUT /api/pricing/{plan}/popular
Content-Type: application/json

{
  "isPopular": true
}
```

#### Get Pricing Statistics
```bash
GET /api/pricing/admin/stats
```

### Method 3: Direct Database Updates

You can also update pricing directly in MongoDB:

```javascript
// Connect to MongoDB
use your_database_name

// Update a specific plan
db.pricings.updateOne(
  { plan: "basic" },
  { 
    $set: { 
      monthlyPrice: 18,
      yearlyPrice: 172,
      "features.channels": 120
    } 
  }
)

// Set a plan as popular
db.pricings.updateMany({}, { isPopular: false })
db.pricings.updateOne({ plan: "standard" }, { isPopular: true })
```

## Common Operations

### 1. Update Prices

**Via Admin Panel:**
- Navigate to Admin Panel → Pricing tab
- Edit the price fields directly
- Changes are saved automatically

**Via API:**
```bash
curl -X PUT http://localhost:5000/api/pricing/basic \
  -H "Content-Type: application/json" \
  -d '{"monthlyPrice": 18, "yearlyPrice": 172}'
```

### 2. Change Plan Features

**Update channels count:**
```bash
curl -X PUT http://localhost:5000/api/pricing/standard \
  -H "Content-Type: application/json" \
  -d '{"features.channels": 250}'
```

**Update quality:**
```bash
curl -X PUT http://localhost:5000/api/pricing/premium \
  -H "Content-Type: application/json" \
  -d '{"features.quality": "4K"}'
```

### 3. Activate/Deactivate Plans

**Via Admin Panel:**
- Click "Activate" or "Deactivate" button

**Via API:**
```bash
curl -X PUT http://localhost:5000/api/pricing/basic/toggle
```

### 4. Set Popular Plan

**Via Admin Panel:**
- Click "Set Popular" or "Remove Popular" button

**Via API:**
```bash
curl -X PUT http://localhost:5000/api/pricing/standard/popular \
  -H "Content-Type: application/json" \
  -d '{"isPopular": true}'
```

## Pricing Structure

### Plan Features

Each plan includes these features:
- **Channels**: Number of available channels
- **Quality**: SD, HD, or 4K
- **Connections**: Number of simultaneous connections
- **VOD Library**: Boolean (true/false)
- **Premium Sports**: Boolean (true/false)
- **Support**: email, chat, or phone

### Price Calculation

- **Monthly Price**: Direct monthly cost
- **Yearly Price**: Annual cost (typically with discount)
- **Savings**: Automatically calculated as percentage

### Discount Logic

Yearly savings are calculated as:
```
Savings % = ((Monthly Price × 12) - Yearly Price) / (Monthly Price × 12) × 100
```

## Best Practices

### 1. Price Updates
- Test changes in development first
- Update prices during low-traffic periods
- Consider grandfathering existing subscribers
- Communicate changes to users

### 2. Plan Management
- Keep at least one plan active at all times
- Use the popular flag sparingly (only one plan should be popular)
- Maintain logical price progression between plans
- Consider seasonal pricing strategies

### 3. Feature Updates
- Ensure feature changes don't break existing subscriptions
- Update plan descriptions when features change
- Consider migration paths for existing users

## Monitoring and Analytics

### Pricing Statistics

Access pricing statistics via:
```bash
GET /api/pricing/admin/stats
```

Returns:
- Total number of plans
- Active plans count
- Popular plans count
- Average monthly/yearly prices

### Database Queries

**Get all active plans:**
```javascript
db.pricings.find({ isActive: true }).sort({ sortOrder: 1 })
```

**Get popular plan:**
```javascript
db.pricings.findOne({ isPopular: true })
```

**Get plans by price range:**
```javascript
db.pricings.find({ 
  monthlyPrice: { $gte: 15, $lte: 30 },
  isActive: true 
})
```

## Troubleshooting

### Common Issues

1. **Prices not updating on frontend**
   - Clear browser cache
   - Check if pricing API is responding
   - Verify database connection

2. **Plan not showing on pricing page**
   - Check if plan is active (`isActive: true`)
   - Verify plan exists in database
   - Check API response for errors

3. **Subscription creation fails**
   - Ensure pricing plan exists and is active
   - Check plan name matches exactly
   - Verify billing cycle is valid

### Debug Commands

**Check current pricing data:**
```bash
curl http://localhost:5000/api/pricing
```

**Verify specific plan:**
```bash
curl http://localhost:5000/api/pricing/basic
```

**Test plan update:**
```bash
curl -X PUT http://localhost:5000/api/pricing/basic \
  -H "Content-Type: application/json" \
  -d '{"monthlyPrice": 20}' \
  -v
```

## Security Considerations

1. **API Protection**: Consider adding authentication to pricing update endpoints
2. **Validation**: All price updates are validated on the server
3. **Audit Trail**: Consider logging pricing changes for compliance
4. **Backup**: Regularly backup pricing data before major changes

## Future Enhancements

1. **Version Control**: Track pricing history and changes
2. **A/B Testing**: Test different pricing strategies
3. **Dynamic Pricing**: Adjust prices based on demand
4. **Regional Pricing**: Support different prices by region
5. **Promotional Pricing**: Temporary price reductions
6. **Bulk Updates**: Update multiple plans at once

## Support

For issues with pricing management:
1. Check the server logs for errors
2. Verify database connectivity
3. Test API endpoints directly
4. Review the pricing model structure
5. Ensure all required fields are present

The pricing system is now fully database-driven and provides flexible management options for your IPTV application. 