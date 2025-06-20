export interface MockMembershipCode {
  code: string;
  planName: string; // e.g., "Basic", "Premium", "Gold"
  durationHours: number; // Duration the plan is active for once code is used
  expiresAt: number; // Timestamp when the *code itself* expires (e.g., 30 mins after "generation")
  isUsed: boolean;
  usedByUserId?: string;
  activatedAt?: number; // Timestamp when the code was used to activate a membership
}

const MOCK_CODES_STORAGE_KEY = 'mockMembershipCodes';

// Get current time for expiry calculation
const now = Date.now();
const THIRTY_MINUTES_MS = 30 * 60 * 1000;

export const initialMockMembershipCodes: MockMembershipCode[] = [
  {
    code: 'GOLD30DAYACCESS', // Plan states "24 hours for activation" - this seems like a code name, not duration
    planName: 'Gold Tier',
    durationHours: 24, // As per plan: "Una vez activado, el sistema funcionará por 24 horas"
    expiresAt: now + THIRTY_MINUTES_MS * 48, // Code itself valid for 2 days from "generation" for testing
    isUsed: false,
  },
  {
    code: 'USER24HRTRIAL',
    planName: 'Standard Access',
    durationHours: 24,
    expiresAt: now + THIRTY_MINUTES_MS, // Code itself expires in 30 minutes from "generation"
    isUsed: false,
  },
  {
    code: 'EXPIREDCODE123',
    planName: 'Expired Plan',
    durationHours: 24,
    expiresAt: now - THIRTY_MINUTES_MS, // Already expired
    isUsed: false,
  },
  {
    code: 'USEDCODEABC',
    planName: 'Standard Access',
    durationHours: 24,
    expiresAt: now + THIRTY_MINUTES_MS * 48, // Code itself is valid
    isUsed: true,
    usedByUserId: 'mockUser123', // Example
    activatedAt: now - (12 * 60 * 60 * 1000) // Membership activated 12 hours ago
  },
];

export const initializeMockCodes = (): void => {
  if (typeof window !== 'undefined') {
    const storedCodes = localStorage.getItem(MOCK_CODES_STORAGE_KEY);
    if (!storedCodes) {
      localStorage.setItem(MOCK_CODES_STORAGE_KEY, JSON.stringify(initialMockMembershipCodes));
      console.log('Mock membership codes initialized in localStorage.');
    } else {
      // Optional: Could add logic here to merge or update codes if needed,
      // e.g., refresh expiry dates of unused codes for easier testing on subsequent loads.
      // For now, just log that they exist.
      console.log('Mock membership codes already exist in localStorage.');
    }
  }
};

export const getMockCodes = (): MockMembershipCode[] => {
  if (typeof window === 'undefined') return [];
  const codesJSON = localStorage.getItem(MOCK_CODES_STORAGE_KEY);
  return codesJSON ? JSON.parse(codesJSON) : [];
};

export const updateMockCode = (updatedCode: MockMembershipCode): boolean => {
  if (typeof window === 'undefined') return false;
  const codes = getMockCodes();
  const codeIndex = codes.findIndex(c => c.code === updatedCode.code);
  if (codeIndex !== -1) {
    codes[codeIndex] = updatedCode;
    localStorage.setItem(MOCK_CODES_STORAGE_KEY, JSON.stringify(codes));
    return true;
  }
  return false;
};
