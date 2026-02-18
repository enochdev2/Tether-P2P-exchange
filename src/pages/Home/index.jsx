import FeaturesSection from "../../components/FeaturesSection";
import Hero from "../../components/Hero";

const Home = () => {
  return (
    <div className="relative">
      {/* Absolute Moving Notice */}
       <div className="absolute top-0 left-0 w-full bg-[#110101] text-red-400 overflow-hidden z-10">
        <div className="flex whitespace-nowrap">
          <div className="marquee py-2 text-base font-bold">
            ⚠️ This business is currently on hold. The website is downgraded to a free server and may take up to 50 seconds to load initially.
          </div>
        </div>
      </div>

      <section>
        <Hero />
      </section>
      {/* <section>
        <CryptoBuyPage />
      </section> */}
      <section>
        <FeaturesSection />
      </section>
    </div>
  );
};

export default Home;
