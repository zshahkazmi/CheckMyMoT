import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <h1>Welcome to CheckMyMoT.com</h1>
        <p>Your one-stop solution for checking MOT status and vehicle information.</p>
        {/* Additional content can be added here */}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;