import { useEffect, useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import './Nav.css';
import { Modal } from 'antd';

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
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsModalVisible(false);
    await supabase.auth.signOut();
    sessionStorage.removeItem('userId');
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
                <NavLink to="/billingdashboard" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/itemBilling" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
                  Item Billing
                </NavLink>
              </li>
              <li>
                <NavLink to="/items" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
                  Manage Items
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
