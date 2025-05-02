import React, { useEffect, useState } from 'react';
import { Card, Table } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { getBillSummary, getSalesByCategory } from '../../api/bills';
import './BillingDashboard.css';
import BillsTable from './bills/BillsTable'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const BillingDashboard = () => {
  const [billData, setBillData] = useState([]);
  const [categorySales, setCategorySales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const bills = await getBillSummary();
      const categorySummary = await getSalesByCategory();

      setBillData(
        bills.map((b) => ({
          date: new Date(b.created).toLocaleDateString(),
          total: parseFloat(b.grand_total),
          gst: parseFloat(b.total_gst),
        }))
      );

      setCategorySales(
        Object.entries(categorySummary).map(([name, value]) => ({
          name,
          value: parseFloat(value),
        }))
      );
    };

    fetchData();
  }, []);

  return (
    <div className="billing-dashboard">
      <h1 className="text-2xl font-semibold mb-4">📊 Bill Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card title="Total Billing per Day">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={billData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Sales by Category">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categorySales}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {categorySales.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>    
        <BillsTable/>
    </div>
  );
};

export default BillingDashboard;
