import React, { useRef, useState } from 'react';
import { Client, Databases, ID } from 'appwrite';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BeatLoader } from 'react-spinners';

const client = new Client();
client.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT).setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
const databases = new Databases(client);

const OrphanageDonation = () => {
  const [amount, setAmount] = useState<number>(0);
  const [receiptId, setReceiptId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false); // Track if data is saved

  const amountInputRef = useRef<HTMLInputElement | null>(null);
  const orphanageNameInputRef = useRef<HTMLInputElement | null>(null);
  const donorNameInputRef = useRef<HTMLInputElement | null>(null);
  const donorCityInputRef = useRef<HTMLInputElement | null>(null);
  const donorEmailInputRef = useRef<HTMLInputElement | null>(null);
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const generateReceiptId = (donorName: string, amount: number, orphanageName: string) => {
    const timestamp = Date.now();
    return `${donorName}-${orphanageName}-${amount}-${timestamp}`;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value);
    setAmount(newAmount);
  };

  const storeDonation = async () => {
    const donorName = donorNameInputRef.current?.value || '';
    const orphanageName = orphanageNameInputRef.current?.value || '';
    const donorCity = donorCityInputRef.current?.value || '';
    const donorEmail = donorEmailInputRef.current?.value || '';
    const comment = commentInputRef.current?.value || '';

    if (!amount || !donorName || !orphanageName || !donorCity || !donorEmail) {
      toast.error('Please fill in all the required fields.', { position: "top-right" });
      return;
    }

    const generatedReceiptId = generateReceiptId(donorName, amount, orphanageName);
    setReceiptId(generatedReceiptId);

    const donationData = {
      donorName,
      donorCity,
      amount,
      orphanageName,
      receiptId: generatedReceiptId,
      donorEmail,
      comment,
    };

    setLoading(true);

    try {
      const response = await databases.createDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ORPHANAGE_DONATION_COLLECTION_ID,
        ID.unique(),
        donationData
      );
      console.log('Donation saved:', response);
      toast.success(`Donation successfully recorded with Receipt ID: ${generatedReceiptId}`, { position: "top-right" });
      setIsSaved(true); // Mark as saved
    } catch (error) {
      console.error('Error saving donation:', error);
      toast.error('Failed to save donation. Please try again.', { position: "top-right" });
      setIsSaved(false);
    } finally {
      setLoading(false);
    }
  };

  const paymentLink = "https://donate.stripe.com/test_cN20292fLasQbGU9AA";

  return (
    <div style={styles.donationContainer}>
      <h2>Donate to Orphanage</h2>

      <div style={styles.inputContainer}>
        <label>Donation Amount:</label>
        <input
          ref={amountInputRef}
          type="number"
          value={amount > 0 ? amount : ''}
          onChange={handleAmountChange}
          placeholder="Enter donation amount"
          style={styles.inputField}
        />
      </div>

      <div style={styles.inputContainer}>
        <label>Orphanage Name:</label>
        <input
          ref={orphanageNameInputRef}
          type="text"
          placeholder="Enter orphanage name"
          style={styles.inputField}
        />
      </div>

      <div style={styles.inputContainer}>
        <label>Donor Name:</label>
        <input
          ref={donorNameInputRef}
          type="text"
          placeholder="Enter your name"
          style={styles.inputField}
        />
      </div>

      <div style={styles.inputContainer}>
        <label>Donor Email:</label>
        <input
          ref={donorEmailInputRef}
          type="email"
          placeholder="Enter your email"
          style={styles.inputField}
        />
      </div>

      <div style={styles.inputContainer}>
        <label>Comment (Optional):</label>
        <input
          ref={commentInputRef}
          type="text"
          placeholder="Enter a comment (optional)"
          style={styles.inputField}
        />
      </div>

      <div style={styles.inputContainer}>
        <label>Donor City:</label>
        <input
          ref={donorCityInputRef}
          type="text"
          placeholder="Enter your city"
          style={styles.inputField}
        />
      </div>

      {receiptId && (
        <div style={styles.receiptContainer}>
          <p style={styles.receiptLabel}>Your Donation Receipt ID:</p>
          <strong style={styles.receiptId}>{receiptId}</strong>
        </div>
      )}

      <button style={styles.confirmButton} onClick={storeDonation} disabled={loading}>
        {loading ? <BeatLoader size={10} color="#fff" /> : 'Confirm Donation'}
      </button>

      {isSaved && (
        <div className="mt-6 text-center">
          <a
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-white bg-green-500 px-6 py-3 rounded-lg hover:bg-green-600"
          >
            Go to Payment Page
          </a>
        </div>
      )}
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

export default OrphanageDonation;
