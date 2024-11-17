import React, { useRef, useState } from 'react';
import { Client, Databases, ID } from 'appwrite';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BeatLoader } from 'react-spinners';

const client = new Client();
client.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT).setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
const databases = new Databases(client);

const ChildDonation = () => {
  const [amount, setAmount] = useState<number>(0);
  const [receiptId, setReceiptId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const amountInputRef = useRef<HTMLInputElement | null>(null);
  const recipientNameInputRef = useRef<HTMLInputElement | null>(null);
  const recipientCityInputRef = useRef<HTMLInputElement | null>(null);
  const donorNameInputRef = useRef<HTMLInputElement | null>(null);
  const donorCityInputRef = useRef<HTMLInputElement | null>(null);
  const donorEmailInputRef = useRef<HTMLInputElement | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);

  const generateReceiptId = (donorName: string, amount: number, childName: string, childCity: string): string => {
    const timestamp = Date.now();
    return `${donorName}-${childName}-${childCity}-${amount}-${timestamp}`;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value);
    setAmount(newAmount);

    // Ensure that all the required fields are filled before generating the receiptId
    if (newAmount > 0 && recipientNameInputRef.current?.value && recipientCityInputRef.current?.value) {
      const donorName = donorNameInputRef.current?.value || '';
      const childName = recipientNameInputRef.current?.value || '';
      const childCity = recipientCityInputRef.current?.value || '';

      const generatedReceiptId = generateReceiptId(donorName, newAmount, childName, childCity);
      setReceiptId(generatedReceiptId);
    }
  };

   const storeDonation = async () => {
    if (
      !amount ||
      !recipientNameInputRef.current?.value ||
      !recipientCityInputRef.current?.value ||
      !donorNameInputRef.current?.value ||
      !donorCityInputRef.current?.value ||
      !donorEmailInputRef.current?.value
    ) {
      toast.error('Please fill in all required fields.', {
        position: 'top-right',
      });
      return;
    }

   const donationData = {
      donorName: donorNameInputRef.current?.value,
      donorCity: donorCityInputRef.current?.value,
      donorEmail: donorEmailInputRef.current?.value,
      amount,
      childName: recipientNameInputRef.current?.value,
      childCity: recipientCityInputRef.current?.value,
      receiptId,
      comment: commentInputRef.current?.value || '',
    };

    setLoading(true);

    try {
      const response = await databases.createDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_CHILD_DONATION_COLLECTION_ID,
        ID.unique(),
        donationData
      );
      console.log('Donation saved:', response);
      toast.success(`Donation successfully recorded with Receipt ID: ${receiptId}`, { position: "top-right" });
    } catch (error) {
      console.error('Error saving donation:', error);
      toast.error('Failed to save donation. Please try again.', { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto my-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Welcome to Our Child Donation Page</h2>
      <p className="text-center text-gray-700 mb-4">Every contribution makes a difference. Thank you for your support!</p>
      
      <div className="mb-4">
        <label className="block font-medium text-gray-600">Donation Amount:</label>
        <input
          ref={amountInputRef}
          type="number"
          value={amount > 0 ? amount : ''}
          onChange={handleAmountChange}
          placeholder="Enter donation amount"
          className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-600">Child Name:</label>
        <input
          ref={recipientNameInputRef}
          type="text"
          placeholder="Enter child's name"
          className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-600">Child City:</label>
        <input
          ref={recipientCityInputRef}
          type="text"
          placeholder="Enter child's city"
          className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-600">Donor Name:</label>
        <input
          ref={donorNameInputRef}
          type="text"
          placeholder="Enter your name"
          className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-600">Donor City:</label>
        <input
          ref={donorCityInputRef}
          type="text"
          placeholder="Enter your city"
          className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-600">Donor Email:</label>
        <input
          ref={donorEmailInputRef}
          type="email"
          placeholder="Enter your email"
          className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-600">Comment (optional):</label>
        <textarea
          ref={commentInputRef}
          placeholder="Write a message or comment"
          className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={3}
        />
      </div>

      {receiptId && (
        <div className="mb-4 bg-blue-100 p-4 rounded-lg text-center">
          <p className="font-bold text-blue-700">Your Donation Receipt ID:</p>
          <p className="text-gray-800">{receiptId}</p>
        </div>
      )}

      <button
        onClick={storeDonation}
        disabled={loading}
        className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
      >
        {loading ? <BeatLoader size={10} color="#fff" /> : 'Confirm Donation'}
      </button>
    </div>
  );
};

const styles = {
  donationContainer: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  inputContainer: {
    margin: '15px 0',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  inputField: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  confirmButton: {
    marginTop: '20px',
    padding: '10px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#0073e6',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
  },
  receiptContainer: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#e7f3fe',
    borderRadius: '5px',
    textAlign: 'center' as const,
  },
  receiptLabel: {
    marginBottom: '5px',
    fontWeight: 'bold' as const,
    color: '#0073e6',
  },
  receiptId: {
    fontSize: '14px',
    color: '#333',
  },
};

export default ChildDonation;