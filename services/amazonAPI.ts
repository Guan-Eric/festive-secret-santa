// services/amazonAPI.ts
import Constants from 'expo-constants';

// Configuration - Replace these with your actual Amazon Associate credentials
const AMAZON_ASSOCIATE_TAG = Constants.expoConfig?.extra?.amazonAssociateTag;

export const searchAmazonProducts = async (query: string) => {
  // Return a manual entry option with direct Amazon search
  return [
    {
      id: 'manual-entry',
      asin: '',
      title: '🔍 Search Amazon for "' + query + '"',
      price: 'Click to browse',
      image: null,
      url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AMAZON_ASSOCIATE_TAG}`,
      affiliateUrl: `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AMAZON_ASSOCIATE_TAG}`,
    },
    {
      id: 'manual-entry-2',
      asin: '',
      title: '✍️ Manually add a wishlist item',
      price: 'Custom entry',
      image: null,
      url: '',
      affiliateUrl: '',
      isManual: true,
    }
  ];
};

const getMockProducts = (query: string) => {
  // Keep your existing mock products as fallback
  return [
    {
      id: `1-${Date.now()}`,
      asin: '',
      title: `${query} - Premium Quality`,
      price: '$29.99',
      image: null,
      url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AMAZON_ASSOCIATE_TAG}`,
      affiliateUrl: `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AMAZON_ASSOCIATE_TAG}`,
    },
    // ... more mock products
  ];
};