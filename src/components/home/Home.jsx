import { useNavigate } from 'react-router-dom';
import './Home.css';
import HomeImg1 from '../../asserts/images/homeImg1.jpg';
import HomeImg2 from '../../asserts/images/homeImg2.jpg';

const Home = () => {

  const navigate = useNavigate();

  const onStartBilling = () => {
    navigate('/itemBilling');
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Smart Billing Manager</h1>
        <p className="home-description">
          Effortlessly manage your inventory and billing with a user-friendly interface.
          Add, update, and generate bills in just a few clicks. Perfect for itemized billing workflows.
        </p>

        <p className="home-extra-description">
          Our Smart Billing Manager streamlines your billing process, reducing errors and saving you time.
          Whether you're managing a small business or a large enterprise, our system scales with your needs.
          Try it now and see how easy it is to maintain accurate records.
        </p>

        <button className="start-button" onClick={onStartBilling}>Start Billing</button>
      </div>
    </div>

  );
};

export default Home;
