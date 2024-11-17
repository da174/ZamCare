import React, { createContext, useState, useContext, ReactNode } from 'react';

interface DonationContextType {
  amount: number | '';
  recipientType: 'child' | 'orphanage' | '';
  recipientId: string;
  recipientName: string;
  recipientCity: string;
  donorName: string;
  donorEmail: string;
  donorCity: string;
  comment: string;
  isProcessing: boolean;
  setAmount: (amount: number | '') => void;
  setRecipientType: (recipientType: 'child' | 'orphanage' | '') => void;
  setRecipientId: (recipientId: string) => void;
  setRecipientName: (recipientName: string) => void;
  setRecipientCity: (recipientCity: string) => void;
  setDonorName: (donorName: string) => void;
  setDonorEmail: (donorEmail: string) => void;
  setDonorCity: (donorCity: string) => void;
  setComment: (comment: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

interface DonationProviderProps {
  children: ReactNode;
}

export const DonationProvider: React.FC<DonationProviderProps> = ({ children }) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [recipientType, setRecipientType] = useState<'child' | 'orphanage' | ''>('');
  const [recipientId, setRecipientId] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientCity, setRecipientCity] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorCity, setDonorCity] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  return (
    <DonationContext.Provider
      value={{
        amount,
        recipientType,
        recipientId,
        recipientName,
        recipientCity,
        donorName,
        donorEmail,
        donorCity,
        comment,
        isProcessing,
        setAmount,
        setRecipientType,
        setRecipientId,
        setRecipientName,
        setRecipientCity,
        setDonorName,
        setDonorEmail,
        setDonorCity,
        setComment,
        setIsProcessing,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};

export const useDonationContext = (): DonationContextType => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonationContext must be used within a DonationProvider');
  }
  return context;
};
