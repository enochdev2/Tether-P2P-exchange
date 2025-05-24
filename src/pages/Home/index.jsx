import { useState } from "react";
import React from "react";
import Hero from "../../components/Hero";
import CryptoBuyPage from "../../components/CryptoBuyPage";
import FeaturesSection from "../../components/FeaturesSection";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="">
      <section>
        <Hero />
      </section>
      <section>
        <CryptoBuyPage />
      </section>
      <section>
        <FeaturesSection />
      </section>
    </div>
  );
};

export default Home;
