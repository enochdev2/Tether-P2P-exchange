import React, { useEffect, useState } from "react";
import InquiryModal from "../components/InquiryModal";
import LoadingSpiner from "../components/LoadingSpiner";

const Support = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowModal(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);


  if (isLoading) return <LoadingSpiner />;

  return (
    <>
      <InquiryModal
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        // onSubmit={handleSubmit}
      />
    </>
  );
};

export default Support;
