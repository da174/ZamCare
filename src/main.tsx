import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { DonationProvider } from '../src//components/DonationContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <DonationProvider>
        <App />
      </DonationProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
