import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Package, Employee, Product } from '@/types';

interface BookingState {
  selectedPackage: Package | null;
  selectedEmployee: Employee | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedProducts: Product[];
  currentStep: number;
  bookingData: {
    name: string;
    email: string;
    phone: string | null;
    marketingConsent: boolean;
  } | null;
}

type BookingAction =
  | { type: 'SELECT_PACKAGE'; payload: Package }
  | { type: 'SELECT_EMPLOYEE'; payload: Employee }
  | { type: 'SELECT_DATE'; payload: Date }
  | { type: 'SELECT_TIME'; payload: string }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_BOOKING_DATA'; payload: BookingState['bookingData'] }
  | { type: 'RESET_BOOKING' };

const initialState: BookingState = {
  selectedPackage: null,
  selectedEmployee: null,
  selectedDate: null,
  selectedTime: null,
  selectedProducts: [],
  currentStep: 1,
  bookingData: null,
};

const BookingContext = createContext<{
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
} | null>(null);

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SELECT_PACKAGE':
      console.log('Selecting package:', action.payload);
      return {
        ...state,
        selectedPackage: action.payload,
      };
    case 'SELECT_EMPLOYEE':
      return { 
        ...state, 
        selectedEmployee: action.payload 
      };
    case 'SELECT_DATE':
      return { 
        ...state, 
        selectedDate: action.payload 
      };
    case 'SELECT_TIME':
      return { 
        ...state, 
        selectedTime: action.payload 
      };
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload
      };
    case 'SET_BOOKING_DATA':
      return {
        ...state,
        bookingData: action.payload
      };
    case 'RESET_BOOKING':
      console.log('Resetting booking state');
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}