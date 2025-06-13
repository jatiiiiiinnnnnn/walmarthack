# 🌍 EcoCart - Smart Sustainable Shopping App

## Overview

EcoCart is a revolutionary shopping app that helps users make environmentally conscious purchasing decisions while earning rewards. Built with React Native and Expo, it combines smart shopping with sustainability, featuring an innovative EcoPoints system, AI-powered product scanning, and comprehensive environmental impact tracking.

## 🚀 Key Features

### 🛒 Smart Shopping Experience
- **Enhanced Product Catalog**: 1000+ products with detailed sustainability metrics
- **Expanded Organic Section**: Comprehensive organic produce, dairy, pantry staples, and beverages
- **Local Products**: Support local businesses and reduce carbon footprint
- **Certification Tracking**: USDA Organic, Fair Trade, Carbon Neutral, and more
- **Nutrition Scoring**: A-E ratings for food products
- **Advanced Filtering**: Filter by organic, local, eco-friendly, on sale, and more
- **Smart Sorting**: Sort by price, eco-score, and relevance

### 💰 EcoPoints Rewards System
- **Earn Points**: Get EcoPoints for eco-friendly purchases (8-50 points per product)
- **Scan Bonuses**: Extra 8-15 points for scanning and choosing eco alternatives
- **Realistic Discounts**: 
  - ₹75 off with 100 points (min ₹750 cart)
  - 5% off eco products with 250 points (max ₹750 discount)
  - ₹375 off with 500 points (min ₹3750 cart)
  - 10% off entire cart with 750 points (max ₹1125 discount)
- **Level System**: Progress from Eco Rookie to Sustainability Master
- **Points History**: Track earnings and spending with detailed history

### 📱 Smart Product Scanner
- **Barcode Scanning**: Instant product recognition with camera
- **Eco Alternatives**: AI-powered recommendations for sustainable swaps
- **Store Navigation**: Get directions to eco alternatives in-store
- **Impact Comparison**: See CO₂ savings and EcoPoints for each choice
- **Real-time Rewards**: Earn bonus points for scanning and choosing eco options

### 🛍️ Intelligent Shopping Cart
- **Eco Swap Suggestions**: Smart recommendations for cart items
- **Dynamic Pricing**: Real-time price comparisons and savings calculations
- **EcoPoints Integration**: Apply earned points for instant discounts
- **Environmental Impact**: Track CO₂ impact and EcoPoints for entire cart
- **Promo Code Support**: Apply additional discounts and promotions

### 🌱 Environmental Impact Tracking
- **Personal Metrics**: Track CO₂ saved, money saved, and meals donated
- **Progress Visualization**: Charts and graphs showing monthly progress
- **Community Impact**: See your contribution to overall environmental goals
- **Achievement System**: Unlock badges and rewards for milestones
- **Impact Equivalents**: Understand your impact in terms of trees planted, miles not driven

### 🎯 Gamified Challenges
- **Active Challenges**: Zero Waste Week, Green Commute Challenge, Plant-Based Pioneer
- **Progress Tracking**: Real-time progress with tips for success
- **Reward System**: Earn 150-300 EcoPoints for challenge completion
- **Difficulty Levels**: Easy, Medium, and Hard challenges for all users
- **Category Variety**: Waste Reduction, Transportation, Diet Impact, Community

### 🏆 Comprehensive Profile Management
- **EcoPoints Dashboard**: Detailed history and earning opportunities
- **Rewards Progress**: Track achievements and unlock new badges
- **Level Benefits**: Unlock exclusive perks as you progress
- **Profile Customization**: Edit personal information and preferences
- **Notification Controls**: Manage alerts for deals, challenges, and achievements

## 🛠️ Technical Implementation

### Project Structure
```
app/
├── (customer)/(tabs)/          # Main app tabs
│   ├── dashboard.tsx           # Enhanced shopping with 1000+ products
│   ├── cart.tsx               # Smart cart with eco swaps
│   ├── scan.tsx               # AI-powered barcode scanner
│   ├── challenges.tsx         # Gamified eco challenges
│   ├── impact.tsx             # Environmental impact tracking
│   ├── profile.tsx            # User profile and EcoPoints management
│   └── _layout.tsx            # Tab navigation layout
├── contexts/
│   └── AppDataContext.tsx     # Global state management
├── _layout.tsx                # Root layout with providers
└── index.tsx                  # Welcome screen with onboarding
```

### State Management
- **Context API**: Centralized state management with `AppDataContext`
- **Persistent Data**: User profile, EcoPoints, cart items, and preferences
- **Real-time Updates**: Dynamic cart updates and points calculation
- **Cross-tab Sync**: Consistent data across all app sections

### Key Components
- **Product Catalog**: 1000+ products with detailed metadata
- **EcoPoints Engine**: Realistic reward calculation and discount system
- **Scanner Integration**: Camera-based barcode recognition
- **Impact Calculator**: Real-time environmental impact tracking
- **Discount Engine**: Smart coupon and points-based pricing

## 💡 Realistic Business Model

### For Users
- **Genuine Savings**: Realistic discount tiers that provide value
- **Environmental Impact**: Actual CO₂ reduction through better choices
- **Gamification**: Engaging challenges and rewards system
- **Educational**: Learn about sustainable products and practices

### For Walmart
- **Increased Engagement**: Higher cart values and customer retention
- **Sustainability Goals**: Support corporate environmental initiatives
- **Data Insights**: Understanding customer preferences for eco products
- **Premium Product Promotion**: Encourage higher-margin sustainable products
- **Waste Reduction**: Rescue deals reduce food waste and losses

### Revenue Streams
- **Margin Optimization**: Higher margins on recommended eco products
- **Waste Reduction**: Convert potential losses into discounted sales
- **Partner Commissions**: Revenue from eco-friendly brand partnerships
- **Premium Features**: Advanced analytics and exclusive rewards

## 🏪 Store Integration

### Product Database
- **1000+ Products**: Comprehensive catalog with sustainability metrics
- **Real Locations**: Accurate aisle and section information
- **Local Sourcing**: Products from Delhi and surrounding areas
- **Certification Tracking**: Verified organic, fair trade, and eco certifications

### Discount Structure
- **Realistic Minimums**: Cart minimums that encourage meaningful purchases
- **Balanced Rewards**: EcoPoints earning rates that maintain profitability
- **Strategic Pricing**: Eco alternatives priced competitively
- **Seasonal Promotions**: Earth Day specials and eco-themed campaigns

## 📱 User Experience Enhancements

### Onboarding
- **Interactive Tutorial**: Step-by-step guide through key features
- **Personal Stats**: Display current EcoPoints and achievements
- **Feature Discovery**: Introduce scanning, cart, and challenges
- **Quick Start**: Direct navigation to main features

### Accessibility
- **Clear Typography**: Readable fonts and appropriate sizing
- **Color Contrast**: High contrast for better visibility
- **Icon Usage**: Intuitive icons with text labels
- **Touch Targets**: Appropriately sized interactive elements

### Performance
- **Optimized Images**: Efficient loading and caching
- **Smooth Animations**: 60fps transitions and interactions
- **Responsive Design**: Works across different screen sizes
- **Offline Support**: Core features available without internet

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g expo-cli`
- iOS Simulator (for iOS development) or Android Studio (for Android)

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/ecoacart-app.git
   cd ecoacart-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

### Required Permissions
- **Camera**: For barcode scanning functionality
- **Location**: For local product recommendations (optional)
- **Notifications**: For deals, challenges, and achievement alerts

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
EXPO_PUBLIC_API_URL=https://your-api-endpoint.com
EXPO_PUBLIC_ANALYTICS_KEY=your-analytics-key
EXPO_PUBLIC_STORE_ID=walmart-delhi-supercenter
```

### App Configuration (app.json)
```json
{
  "expo": {
    "name": "EcoCart",
    "slug": "ecoacart-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#059669"
    },
    "plugins": [
      "expo-camera",
      "expo-router"
    ]
  }
}
```

## 📊 Key Metrics & Analytics

### User Engagement
- **Daily Active Users**: Track app opens and feature usage
- **EcoPoints Activity**: Monitor earning and spending patterns
- **Scan Rate**: Percentage of users using barcode scanner
- **Challenge Completion**: Success rates for different challenge types

### Business Impact
- **Eco Product Sales**: Increase in sustainable product purchases
- **Cart Value**: Average order value with EcoPoints integration
- **Customer Retention**: Long-term engagement through rewards
- **Waste Reduction**: Quantify food waste prevented through rescue deals

### Environmental Impact
- **CO₂ Reduction**: Aggregate environmental savings across users
- **Sustainable Choices**: Percentage of eco-friendly purchases
- **Local Impact**: Support for local businesses and producers
- **Certification Tracking**: Adoption of organic and fair trade products

## 🌟 Future Enhancements

### Phase 1 (Next 3 months)
- **Social Features**: Share achievements and compete with friends
- **Recipe Integration**: Suggest recipes using scanned eco products
- **Advanced Analytics**: Detailed personal impact dashboards
- **Push Notifications**: Smart alerts for deals and challenges

### Phase 2 (6 months)
- **AI Recommendations**: Machine learning-powered product suggestions
- **Carbon Calculator**: Detailed carbon footprint tracking
- **Community Challenges**: Store-wide and community-level competitions
- **Subscription Model**: Premium features and exclusive rewards

### Phase 3 (1 year)
- **Multi-store Integration**: Expand beyond Walmart to other retailers
- **Supply Chain Transparency**: Full product lifecycle tracking
- **Impact Marketplace**: Trade EcoPoints for real-world environmental projects
- **AR Integration**: Augmented reality for in-store navigation and information

## 🤝 Contributing

We welcome contributions to make EcoCart even better! Please read our contributing guidelines and submit pull requests for:

- **Bug fixes**: Help us identify and resolve issues
- **Feature improvements**: Enhance existing functionality
- **New features**: Add innovative sustainability features
- **Documentation**: Improve setup and usage documentation
- **Testing**: Add unit tests and integration tests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Expo Team**: For the excellent React Native framework
- **Walmart**: For the opportunity to build sustainable shopping solutions
- **Environmental Organizations**: For inspiration and data on sustainability metrics
- **Open Source Community**: For the amazing libraries and tools used in this project

---

**Built with ❤️ for a sustainable future 🌍**

For support or questions, please open an issue or contact our team at [support@ecoacart.app](mailto:support@ecoacart.app)

Have a great day :) 
