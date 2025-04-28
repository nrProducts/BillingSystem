import { Card, Button, Divider } from 'antd';
import './../Home.css';
import {
    MinusCircleOutlined
  } from '@ant-design/icons';

const BillPreview = ({ selectedItems, total, handleRemove }) => {
    //❌
    return (
        <div style={{ maxWidth: 600, margin: '40px auto', padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 30 }}>🧾 Bill Preview</h2>

            {selectedItems?.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No items added.</p>
            ) : (
                <>
                    {selectedItems?.map((item) => (
                        <Card key={item?.id} style={{ marginBottom: 15 }} bodyStyle={{ padding: 15 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                <div><strong>Item:</strong> {item?.name}</div>
                                <Button size="small" onClick={() => handleRemove(item?.id)}> <MinusCircleOutlined  style={{ color: 'red' }}/> </Button> 
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555' }}>
                                <div>Qty: {item?.quantity}</div>
                                <div>Unit Price: ${item?.price?.toFixed(2)}</div>
                                <div>Subtotal: ${(item?.price?.toFixed(2) * item?.quantity).toFixed(2)}</div>
                            </div>
                        </Card>
                    ))}
                    <Divider />
                    <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 18 }}>
                        Total: ${total?.toFixed(2)}
                    </div>
                </>
            )}

            <Button
                type="primary"
                block
                disabled={selectedItems?.length === 0}
                onClick={() => alert('Bill generated!')}
                style={{ marginTop: 20 }}
            >
                ✅ Generate Bill
            </Button>
        </div>
    );
};

export default BillPreview;
