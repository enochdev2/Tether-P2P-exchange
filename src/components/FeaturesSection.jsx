import React, { useEffect } from "react";
import { Globe, Send, Users } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from 'react-i18next';

const FeaturesSection = () => {
  const { t } = useTranslation(); // Access translation function

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const features = [
    {
      title: t('features.tradeWorldwide'),
      description: t('features.descriptionTradeWorldwide'),
      icon: <Globe className="mx-auto text-green-600" size={48} />,
    },
    {
      title: t('features.sendMoneyInstantly'),
      description: t('features.descriptionSendMoneyInstantly'),
      icon: <Send className="mx-auto text-green-600" size={48} />,
    },
    {
      title: t('features.accessTheGlobe'),
      description: t('features.descriptionAccessTheGlobe'),
      icon: <Users className="mx-auto text-green-600" size={48} />,
    },
  ];

  return (
    <section
      className="relative bg-black text-white py-20"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1612831811300-e8fba3b4fa22?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-75 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-14"
          data-aos="fade-up"
        >
          {t('features.largestP2PMarketplace')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-gray-900/40 hover:bg-gray-800/60 transition-transform duration-75 ease-in-out transform hover:scale-105 p-6 rounded-2xl shadow-lg text-center"
            >
              <div>{feature.icon}</div>
              <h3 className="text-lg md:text-xl font-semibold mt-4 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-base sm:text-md md:text-md">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
