import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      title: "Trade worldwide",
      description:
        "Buy and sell local and digital currencies including Bitcoin, Ethereum, Tether, and USDC – across 140 markets with 500+ payment methods.",
      icon: "📱", // Replace with appropriate icon
    },
    {
      title: "Send money instantly",
      description:
        "Send cash or cryptocurrency to anyone, anytime – with faster, cheaper, and simpler transactions powered by the blockchain.",
      icon: "💸", // Replace with appropriate icon
    },
    {
      title: "Access the globe",
      description:
        "Rely on Paxful to overcome local infrastructure constraints and access the global economy, even without a bank account.",
      icon: "🌍", // Replace with appropriate icon
    },
    {
      title: "Escape volatility",
      description:
        "Swap high-inflating fiat currencies for digital stores of value like BTC or stablecoins to hedge against inflation or protect against banking issues.",
      icon: "⚡", // Replace with appropriate icon
    },
    {
      title: "Supply global markets",
      description:
        "Become a peer-to-peer market maker and benefit from arbitrage trading opportunities across regions and payment methods.",
      icon: "💰", // Replace with appropriate icon
    },
    {
      title: "Scale your business",
      description:
        "Leverage Paxful’s liquidity, market reach, payment diversification, and security features to rapidly expand your business to new heights.",
      icon: "📈", // Replace with appropriate icon
    },
  ];

  return (
    <div className="bg-black text-white py-20">
      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="text-4xl font-semibold text-center mb-16">
          The world's largest P2P marketplace
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900/30 p-8 rounded-lg shadow-lg text-center"
            >
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
