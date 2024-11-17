import React, { useState } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const VolunteerPhoneInput: React.FC = () => {
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [isValid, setIsValid] = useState<boolean>(true);

  const handlePhoneChange = (value: string | undefined) => {
    setPhone(value);
    setIsValid(isValidPhoneNumber(value || '')); // Check if the phone number is valid
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="phone" className="text-gray-700 font-semibold mb-2">Phone Number</label>
      <PhoneInput
        id="phone"
        value={phone}
        onChange={handlePhoneChange}
        defaultCountry="US" // You can set this to the user's default country
        international // Allows the user to input international phone numbers
        className={`p-2 border rounded-md ${isValid ? 'border-gray-300' : 'border-red-500'}`}
        placeholder="Enter phone number"
      />
      {!isValid && <span className="text-red-500 text-sm mt-1">Please enter a valid phone number.</span>}
    </div>
  );
};

export default VolunteerPhoneInput;
