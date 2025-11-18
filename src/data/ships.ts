import type { ShipSpecification, ShipType } from '../types';

export const SHIP_SPECIFICATIONS: Record<string, ShipSpecification> = {
  // 컨테이너선
  'CONTAINER_SMALL': {
    id: 'CONTAINER_SMALL',
    type: 'CONTAINER',
    name: 'Small Feeder Container Ship',
    length: 150,
    width: 25,
    deadweight: 15000,
    capacity: 1000, // TEU
    estimatedCost: 25,
    estimatedDays: 180,
    requiredDockSize: 'SMALL',
    complexity: 3,
  },
  'CONTAINER_MEDIUM': {
    id: 'CONTAINER_MEDIUM',
    type: 'CONTAINER',
    name: 'Panamax Container Ship',
    length: 280,
    width: 32,
    deadweight: 65000,
    capacity: 5000,
    estimatedCost: 80,
    estimatedDays: 360,
    requiredDockSize: 'MEDIUM',
    complexity: 5,
  },
  'CONTAINER_LARGE': {
    id: 'CONTAINER_LARGE',
    type: 'CONTAINER',
    name: 'Ultra Large Container Ship',
    length: 400,
    width: 60,
    deadweight: 200000,
    capacity: 20000,
    estimatedCost: 150,
    estimatedDays: 540,
    requiredDockSize: 'MEGA',
    complexity: 8,
  },

  // 벌크선
  'BULK_HANDYSIZE': {
    id: 'BULK_HANDYSIZE',
    type: 'BULK_CARRIER',
    name: 'Handysize Bulk Carrier',
    length: 180,
    width: 28,
    deadweight: 35000,
    estimatedCost: 28,
    estimatedDays: 200,
    requiredDockSize: 'SMALL',
    complexity: 3,
  },
  'BULK_CAPESIZE': {
    id: 'BULK_CAPESIZE',
    type: 'BULK_CARRIER',
    name: 'Capesize Bulk Carrier',
    length: 300,
    width: 45,
    deadweight: 180000,
    estimatedCost: 55,
    estimatedDays: 320,
    requiredDockSize: 'LARGE',
    complexity: 5,
  },

  // 유조선
  'TANKER_PRODUCT': {
    id: 'TANKER_PRODUCT',
    type: 'TANKER',
    name: 'Product Tanker',
    length: 180,
    width: 32,
    deadweight: 45000,
    capacity: 50000,
    estimatedCost: 42,
    estimatedDays: 250,
    requiredDockSize: 'MEDIUM',
    complexity: 4,
  },
  'TANKER_VLCC': {
    id: 'TANKER_VLCC',
    type: 'TANKER',
    name: 'VLCC (Very Large Crude Carrier)',
    length: 330,
    width: 60,
    deadweight: 320000,
    capacity: 300000,
    estimatedCost: 95,
    estimatedDays: 420,
    requiredDockSize: 'MEGA',
    complexity: 7,
  },

  // LNG선
  'LNG_SMALL': {
    id: 'LNG_SMALL',
    type: 'LNG_CARRIER',
    name: 'Small Scale LNG Carrier',
    length: 150,
    width: 24,
    deadweight: 10000,
    capacity: 10000,
    estimatedCost: 80,
    estimatedDays: 400,
    requiredDockSize: 'SMALL',
    complexity: 7,
  },
  'LNG_LARGE': {
    id: 'LNG_LARGE',
    type: 'LNG_CARRIER',
    name: 'Large LNG Carrier',
    length: 290,
    width: 46,
    deadweight: 75000,
    capacity: 174000,
    estimatedCost: 200,
    estimatedDays: 600,
    requiredDockSize: 'LARGE',
    complexity: 9,
  },

  // 자동차운반선
  'RORO_MEDIUM': {
    id: 'RORO_MEDIUM',
    type: 'RORO',
    name: 'Car Carrier',
    length: 200,
    width: 32,
    deadweight: 20000,
    capacity: 6500, // cars
    estimatedCost: 65,
    estimatedDays: 300,
    requiredDockSize: 'MEDIUM',
    complexity: 5,
  },

  // 크루즈선
  'CRUISE_LUXURY': {
    id: 'CRUISE_LUXURY',
    type: 'CRUISE',
    name: 'Luxury Cruise Ship',
    length: 340,
    width: 40,
    deadweight: 25000,
    estimatedCost: 800,
    estimatedDays: 900,
    requiredDockSize: 'MEGA',
    complexity: 10,
  },

  // 해양플랜트
  'OFFSHORE_DRILLSHIP': {
    id: 'OFFSHORE_DRILLSHIP',
    type: 'OFFSHORE',
    name: 'Drillship',
    length: 230,
    width: 42,
    deadweight: 40000,
    estimatedCost: 600,
    estimatedDays: 750,
    requiredDockSize: 'LARGE',
    complexity: 10,
  },
};

export const getShipsByType = (type: ShipType): ShipSpecification[] => {
  return Object.values(SHIP_SPECIFICATIONS).filter(ship => ship.type === type);
};

export const getShipById = (id: string): ShipSpecification | undefined => {
  return SHIP_SPECIFICATIONS[id];
};
