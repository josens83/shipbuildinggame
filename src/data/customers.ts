import type { Customer } from '../types';

export const INITIAL_CUSTOMERS: Customer[] = [
  // 컨테이너 선사
  {
    id: 'MAERSK',
    name: 'Maersk Line',
    country: 'Denmark',
    reputation: 95,
    creditRating: 'AAA',
    relationshipScore: 50,
    totalOrders: 0,
    defaultRisk: 0.01,
  },
  {
    id: 'MSC',
    name: 'Mediterranean Shipping Company',
    country: 'Switzerland',
    reputation: 92,
    creditRating: 'AA',
    relationshipScore: 50,
    totalOrders: 0,
    defaultRisk: 0.02,
  },
  {
    id: 'CMA_CGM',
    name: 'CMA CGM',
    country: 'France',
    reputation: 88,
    creditRating: 'AA',
    relationshipScore: 50,
    totalOrders: 0,
    defaultRisk: 0.02,
  },

  // 벌크/탱커 선사
  {
    id: 'SHELL',
    name: 'Shell Shipping',
    country: 'Netherlands',
    reputation: 94,
    creditRating: 'AAA',
    relationshipScore: 50,
    totalOrders: 0,
    defaultRisk: 0.01,
  },
  {
    id: 'EXXON',
    name: 'ExxonMobil Marine',
    country: 'USA',
    reputation: 90,
    creditRating: 'AAA',
    relationshipScore: 50,
    totalOrders: 0,
    defaultRisk: 0.01,
  },
  {
    id: 'COSCO',
    name: 'COSCO Shipping',
    country: 'China',
    reputation: 85,
    creditRating: 'A',
    relationshipScore: 50,
    totalOrders: 0,
    defaultRisk: 0.03,
  },

  // LNG 선사
  {
    id: 'QATARGAS',
    name: 'Qatar Gas Transport',
    country: 'Qatar',
    reputation: 91,
    creditRating: 'AA',
    relationshipScore: 50,
    totalOrders: 0,
    defaultRisk: 0.02,
  },
  {
    id: 'TOTAL',
    name: 'TotalEnergies Marine',
    country: 'France',
    reputation: 89,
    creditRating: 'AA',
    relationshipScore: 50,
    totalOrders: 0,
    defaultRisk: 0.02,
  },

  // 크루즈 선사
  {
    id: 'CARNIVAL',
    name: 'Carnival Corporation',
    country: 'USA',
    reputation: 87,
    creditRating: 'A',
    relationshipScore: 50,
    totalOrders: 0,
    defaultRisk: 0.04,
  },
  {
    id: 'ROYAL_CARIBBEAN',
    name: 'Royal Caribbean',
    country: 'USA',
    reputation: 86,
    creditRating: 'A',
    relationshipScore: 50,
    totalOrders: 0,
    defaultRisk: 0.04,
  },

  // 해양 에너지
  {
    id: 'TRANSOCEAN',
    name: 'Transocean',
    country: 'Switzerland',
    reputation: 84,
    creditRating: 'BBB',
    relationshipScore: 50,
    totalOrders: 0,
    defaultRisk: 0.05,
  },

  // 중소형 선사
  {
    id: 'REGIONAL_1',
    name: 'Pacific Shipping Co.',
    country: 'South Korea',
    reputation: 75,
    creditRating: 'BBB',
    relationshipScore: 60,
    totalOrders: 0,
    defaultRisk: 0.06,
  },
  {
    id: 'REGIONAL_2',
    name: 'Baltic Carriers Ltd.',
    country: 'Norway',
    reputation: 72,
    creditRating: 'BB',
    relationshipScore: 55,
    totalOrders: 0,
    defaultRisk: 0.08,
  },
  {
    id: 'REGIONAL_3',
    name: 'Mediterranean Marine',
    country: 'Greece',
    reputation: 68,
    creditRating: 'BB',
    relationshipScore: 50,
    totalOrders: 0,
    defaultRisk: 0.10,
  },
];

export const getCustomerById = (id: string): Customer | undefined => {
  return INITIAL_CUSTOMERS.find(c => c.id === id);
};

export const getCustomersByCountry = (country: string): Customer[] => {
  return INITIAL_CUSTOMERS.filter(c => c.country === country);
};

export const getCustomersByCreditRating = (rating: string): Customer[] => {
  return INITIAL_CUSTOMERS.filter(c => c.creditRating === rating);
};
