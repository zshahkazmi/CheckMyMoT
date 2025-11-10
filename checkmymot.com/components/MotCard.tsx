import React from 'react';

interface MotCardProps {
  vehicleRegistration: string;
  motStatus: string;
  motExpiryDate: string;
}

const MotCard: React.FC<MotCardProps> = ({ vehicleRegistration, motStatus, motExpiryDate }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold">MOT Information</h2>
      <p className="mt-2"><strong>Vehicle Registration:</strong> {vehicleRegistration}</p>
      <p className="mt-1"><strong>MOT Status:</strong> {motStatus}</p>
      <p className="mt-1"><strong>MOT Expiry Date:</strong> {motExpiryDate}</p>
    </div>
  );
};

export default MotCard;