/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Transaction {
  id: string;
  amount: number;
  category: "Groceries" | "Dining" | "Travel" | "Entertainment" | "Utilities" | "Shopping" | "Family" | "Miscellaneous";
  description: string;
  date: string;
  loggedBy: string; // "You", "Elena (partner)", "WhatsApp Bot", "Group Trip"
}

export interface FamilyMember {
  name: string;
  avatar: string;
  role: string;
  spentThisMonth: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  category: "Home" | "Vacation" | "Car" | "Emergency Fund";
  deadline: string;
}

export interface GroupExpenseSplit {
  memberName: string;
  amount: number;
  sharePercent: number;
}

export interface GroupExpense {
  id: string;
  title: string;
  totalAmount: number;
  splitType: "Equal" | "Custom";
  paidBy: string;
  splits: GroupExpenseSplit[];
  date: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  whatsappMessage: string;
  iconName: string;
  accentColor: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company?: string;
  rating: number;
  quote: string;
  avatar: string;
  tag: "Family Budgeting" | "WhatsApp Logging" | "AI Advisor";
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
