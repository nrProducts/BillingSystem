import { useEffect, useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import './Nav.css';
import { Modal } from 'antd';
import billTime from '../../asserts/images/billTime.png'
import billTime1 from '../../asserts/images/billTime1.png'

const Navbar = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      sessionStorage.setItem('userId', session?.user?.id);
      sessionStorage.setItem('emailId', session?.user?.email);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsModalVisible(false);
    await supabase.auth.signOut();
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('emailId');
    navigate('/login');
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showLogoutModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <aside className="sidebar">
      <img src={billTime} alt="Logo" className="logo" width='200px' height='50px' ty />
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
              Home
            </NavLink>
          </li>
          {session ? (
            <>
              <li>
                <NavLink to="/billingDashboard" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/user" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
                  User Management
                </NavLink>
              </li>
              <li>
                <NavLink to="/tableManager" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
                  Table Manager
                </NavLink>
              </li>
              <li>
                <NavLink to="/itemBilling/:tableId?" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
                  Item Billing
                </NavLink>
              </li>
              <li>
                <NavLink to="/items" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
                  Manage Items
                </NavLink>
              </li>
              <li>
                <NavLink to="/kitchen" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
                  Kitchen
                </NavLink>
              </li>
              <li>
                <NavLink onClick={showLogoutModal} className="nav-link logout-btn">Logout</NavLink>
              </li>
              <Modal
                title="Confirm Logout"
                open={isModalVisible}
                onOk={handleLogout}
                onCancel={handleCancel}
                okText="Yes, Logout"
                cancelText="Cancel"
                okButtonProps={{
                  style: {
                    backgroundColor: '#d6085e', // Set the desired background color
                    color: 'white', // Set the text color (optional)
                  },
                }}
              >
                <p>Are you sure you want to logout?</p>
              </Modal>
            </>
          ) : (
            <li>
              <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Navbar;
