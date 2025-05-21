import React from "react";
import "./Home.css";
import { Typography, Button, Row, Col, Card } from "antd";
import {
  FileTextOutlined,
  AppstoreAddOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import imgHome from '../../asserts/images/pexels-karolina-grabowska-7680682.jpg'
import imgHome1 from '../../asserts/images/homeImg1.jpg'
import imgHome2 from '../../asserts/images/homeImg2.jpg'
import imgHome3 from '../../asserts/images/homeImg3.jpg'

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <AppstoreAddOutlined
          className="feature-icon"
          style={{ color: "#1890ff" }}
        />
      ),
      title: "Easy Item Management",
      description:
        "Add, update, categorize, and manage inventory items in just a few clicks.",
      path: "/items",
    },
    {
      icon: (
        <FileTextOutlined
          className="feature-icon"
          style={{ color: "#52c41a" }}
        />
      ),
      title: "Quick Billing",
      description:
        "Generate detailed itemized bills with automatic GST calculation and real-time totals.",
      path: "/itemBilling",
    },
    {
      icon: (
        <AreaChartOutlined
          className="feature-icon"
          style={{ color: "#faad14" }}
        />
      ),
      title: "Analytics Dashboard",
      description:
        "View sales trends, best-selling items, and generate reports to grow your business.",
      path: "/billingdashboard",
    },
  ];

  return (
    <div className="home-container">
      <div style={{ position: "relative", marginBottom: "40px" }}>
        <img
          src={imgHome2}
          alt="Billing System"
          className="billing-image"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: " 89%", // Apply gradient only to the bottom 70% of the image
            background: "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 100%)",
            borderRadius: "12px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center",
            color: "#fff",
            maxWidth: "90%",
          }}
        >
          <Title
            level={2}
            className="home-title"
            style={{ color: "#fff", margin: 0 }}
          >
            Welcome to Smart Billing Manager
          </Title>
          <Paragraph className="home-description">
            Streamline your billing and inventory management with a powerful,
            user-friendly solution. Smart Billing Manager is built for
            businesses that value speed, accuracy, and simplicity.
          </Paragraph>
        </div>
      </div>



      {/* <Button type="primary" size="large" style={{ marginBottom: '40px' }} onClick={() => navigate('/billing')}>
        Start Billing
      </Button> */}

      <Row gutter={[24, 24]}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              className="feature-card"
              hoverable
              onClick={() => navigate(feature.path)}
            >
              <div className="feature-content">
                {feature.icon}
                <Title level={4}>{feature.title}</Title>
                <Paragraph>{feature.description}</Paragraph>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="why-choose">
        <Title level={3}>Why Choose Us?</Title>
        <Paragraph>
          With Smart Billing Manager, you eliminate manual errors and reduce
          billing time. Whether you're a solo entrepreneur or managing a chain
          of stores, our platform adapts to your scale. Everything from
          real-time tax computation to seamless item tracking is integrated in
          one place.
        </Paragraph>
      </div>
    </div>
  );
};

export default Home;
