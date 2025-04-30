import { Card, Button, Divider, Spin } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';

const BillHeader = () => (
  <h2 className="bill-title">🧾 Bill Preview</h2>
);

export const BillPreview = ({ selectedItems, handleRemove, billingDetails, handleGenerateBill, loader }) => {

  const { subtotal, gstAmount, total } = billingDetails;

  return (
    <div className="bill-preview">
      {/* Header */}
      <BillHeader />

      {/* Scrollable Body */}
      <div className="bill-body">
        {selectedItems?.length === 0 ? (
          <p className="bill-empty">No items added yet.</p>
        ) : (
          <div className="bill-items">
            {selectedItems.map((item) => (
              <Card
                key={item.id}
                className="bill-item-card"
                bodyStyle={{ padding: '1rem' }}
              >
                <div className="bill-item-header">
                  <strong>{item.name}</strong>
                  <Button
                    size="small"
                    type="text"
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => handleRemove(item.id)}
                  />
                </div>
                <div className="bill-item-details">
                  <div>Qty: {item.quantity}</div>
                  <div>Unit: ₹{item.price.toFixed(2)}</div>
                  <div>Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</div>
                  <div>GST Rate: {item.gst_rate}%</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Spin spinning={loader} tip="Loading..." />
      {/* Footer with GST and totals */}
      <div className="bill-footer">
        <Divider style={{ margin: '8px 0' }} />
        <div className="bill-summary">
          <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
          <div>GST Total: ₹{gstAmount.toFixed(2)}</div>
          <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
            Total: ₹{total.toFixed(2)}
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          block
          disabled={selectedItems?.length === 0}
          onClick={handleGenerateBill}
          className="bill-generate-btn"
        >
          ✅ Generate Bill
        </Button>
      </div>
    </div>
  );
};

export default BillPreview;
