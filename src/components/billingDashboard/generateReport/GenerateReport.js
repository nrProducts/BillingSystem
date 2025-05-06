import React, { useState, useEffect } from 'react';
import { Select, DatePicker, Button, message } from 'antd';
import dayjs from 'dayjs';
import { fetchReportData } from '../../../api/bills';
import { sendReportByEmail } from '../../../api/emailService';
import { Card, Typography } from 'antd';
const { Title } = Typography;


const { Option } = Select;
const { RangePicker } = DatePicker;

const GenerateReport = ({ setModalOpen }) => {
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState(null);
    const [range, setRange] = useState([]);
    const [action, setAction] = useState(null);

    const getDefaultRange = (reportType) => {
        const today = dayjs();
        if (reportType === 'daily') return [today, today];
        if (reportType === 'weekly') return [today.startOf('week'), today.startOf('week').add(6, 'day')];
        if (reportType === 'monthly') return [today.startOf('month'), today.endOf('month')];
        return [];
    };

    useEffect(() => {
        if (type) {
            setRange(getDefaultRange(type));
        }
    }, [type]);

    const isValidRange = () => {
        if (!range || range.length !== 2) return false;
        if (type === 'weekly') {
            return dayjs(range[1]).diff(dayjs(range[0]), 'day') === 6;
        }
        return true;
    };

    const resetInputs = () => {
        setType(null);
        setRange([]);
        setAction(null);
    };

    const handleGenerate = async () => {
        if (!type || !range.length || !action) {
            message.error('Please fill all fields');
            return;
        }

        if (!isValidRange()) {
            message.error('Weekly report must be exactly 7 days.');
            return;
        }

        setLoading(true);
        try {
            const [startDate, endDate] = range;
            const from = dayjs(startDate).startOf('day').toISOString();
            const to = dayjs(endDate).endOf('day').toISOString();

            const data = await fetchReportData(from, to);
            const csvContent = generateCSV(data);

            if (action === 'download') {
                downloadCSV(csvContent, type);
            } else if (action === 'email') {
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const reader = new FileReader();

                reader.onloadend = async () => {
                    const base64String = reader.result.split(',')[1];

                    const body = {
                        to: 'nrofficialproducts@gmail.com',
                        subject: `Your Billing Report for ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`,
                        message: `
                      <p>Dear Customer,</p>
                      <p>Please find attached your billing report for the selected period.</p>
                      <p>If you have any questions regarding this report, feel free to reach out to our support team.</p>
                      <p>Best regards,<br/>The NRproducts Team</p>
                    `,
                        attachment: {
                            filename: 'report.csv',
                            content: base64String,
                        },
                    };

                    await sendReportByEmail(body);
                };

                reader.readAsDataURL(blob);
            }


            message.success('Report generated successfully!');
            resetInputs();
            setModalOpen(false);
        } catch (err) {
            console.info(err);
            message.error('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const generateCSV = (data) => {
        const rows = [
            ['Bill ID', 'Date', 'Item', 'Qty', 'Price', 'GST%', 'GST Amt', 'Total']
        ];

        data.forEach((bill) => {
            bill.bill_items.forEach((item) => {
                rows.push([
                    bill.id,
                    dayjs(bill.created).format('YYYY-MM-DD'),
                    item.items?.name || '',
                    item.quantity,
                    item.price,
                    item.gst_rate,
                    item.gst_amount,
                    item.total_amount
                ]);
            });
        });

        return rows.map((r) => r.join(',')).join('\n');
    };

    const downloadCSV = (csvContent, type) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${type}-${dayjs().format('YYYYMMDD-HHmmss')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 8 }}>Report Type</label>
                    <Select
                        value={type}
                        placeholder="Select type"
                        onChange={setType}
                        style={{ width: '100%' }}
                    >
                        <Option value="daily">Daily</Option>
                        <Option value="weekly">Weekly</Option>
                        <Option value="monthly">Monthly</Option>
                    </Select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 8 }}>Select Date(s)</label>
                    <RangePicker
                        value={range}
                        onChange={setRange}
                        picker={type === 'monthly' ? 'month' : 'date'}
                        format={type === 'monthly' ? 'YYYY-MM' : 'YYYY-MM-DD'}
                        style={{ width: '100%' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 8 }}>Action</label>
                    <Select
                        value={action}
                        placeholder="Select action"
                        onChange={setAction}
                        style={{ width: '100%' }}
                    >
                        <Option value="download">Download</Option>
                        <Option value="email">Send to Email</Option>
                    </Select>
                </div>

                <Button
                    type="primary"
                    onClick={handleGenerate}
                    loading={loading}
                    block
                    style={{ marginTop: 12 }}
                >
                    Generate
                </Button>
            </div>
        </div>
    );
};

export default GenerateReport;
