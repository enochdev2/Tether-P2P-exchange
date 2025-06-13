import FeaturesSection from "../../components/FeaturesSection";
import Hero from "../../components/Hero";

const Home = () => {

  return (
    <div className="">
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
