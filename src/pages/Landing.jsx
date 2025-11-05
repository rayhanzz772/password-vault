import Header from '../components/Header';
import Hero from '../components/Hero';
import SecurityFeatures from '../components/SecurityFeatures';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <div id="features">
          <SecurityFeatures />
        </div>
        <div id="how-it-works">
          <HowItWorks />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
