declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';

interface Group {
  accent: string;
  id: string;
  name: string;
  emoji: string;
  members: number;
  memberIds: string[];
  assignedTo: string;
  assignedToName: string;
  colors: string[];
  budget?: string;
  exchangeDate?: string;
  createdBy: string;
  createdAt: any;
}

interface WishlistItem {
  id: string;
  userId: string;
  groupId: string;
  name: string;
  price: string;
  emoji: string;
  amazonUrl: string;
  affiliateLink: string;
  createdAt: any;
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: any;
}