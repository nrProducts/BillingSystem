import React, { useEffect, useState } from 'react';
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
          date: new Date(b.date).toLocaleDateString(),
          total: parseFloat(b.total),
          gst: parseFloat(b.gst),
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
    <>
      <div className="shared-layout-container-dash">
        <div className="shared-row-dash">
          <div className="shared-table-section-dash">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <h3 style={{ margin: 0 }}>Total bills per date</h3>
              <ResponsiveContainer style={{ marginTop: 20 }} width="100%" height={250}>
                <BarChart data={billData}>
                  <XAxis
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#8884d8" barSize={20} />
                </BarChart>
              </ResponsiveContainer>

            </div>
          </div>
          <div className="shared-side-section-dash">
            <h3 style={{ margin: "0 0 0 0" }}>Sales by category</h3>
            <ResponsiveContainer style={{ marginTop: 20 }} width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categorySales}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value?.toFixed(2)}`}
                >
                  {categorySales.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="shared-side-section-dash">
          <BillsTable />
        </div>
      </div>
    </>
  );
};

export default BillingDashboard;