import React, { useState } from 'react';
import SellOfferPage from '../../components/SellOfferPage';
import { X } from 'lucide-react';

const Modal = ({ isModalOpen, closeModal }) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-center z-50 ">
      
      {/* Square modal container */}
      <div className="relative bg-black/90 p-6 rounded-md w-[600px] h-[600px] shadow-lg flex flex-col items-center justify-between">
        <h3 className="text-2xl font-semibold mb-2 text-white">Place an Offer to Sell USDT</h3>
        {/* Content of the modal */}
        <SellOfferPage />
        <button
          onClick={closeModal}
          className="absolute top-5 bg-amber-50 right-10 mt-4 text-sm text-red-500 hover:underline cursor-pointer"
        > 
          <X/>
        </button>
      </div>
    </div>
  );
};
const TradingOffers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <h3 className="text-xl font-semibold">Trading & Offers</h3>
      <div className="mt-4">
        <button
          onClick={openModal}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Post New Offer
        </button>
        <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 mt-4">
          View Active Offers
        </button>
      </div>

      {/* Modal Component */}
      <Modal isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default TradingOffers;
