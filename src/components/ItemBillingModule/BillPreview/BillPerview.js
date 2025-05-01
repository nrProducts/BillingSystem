import { Card, Button, Divider, Spin } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';

const BillHeader = () => (
  <h2 className="bill-title">🧾 Bill Preview</h2>
);

export const BillPreview = ({ selectedItems, handleRemove, billingDetails, handleGenerateBill, loader }) => {
  const { subtotal, gstAmount, total } = billingDetails;

  return (
    <div className="bill-preview">
      <BillHeader />
      <div className="bill-body">
        <Spin spinning={loader} tip="Loading...">
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
        </Spin>
      </div>

      {/* Footer */}
      <div className="bill-footer">
        <div className="bill-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>GST Total:</span>
            <span>₹{gstAmount.toFixed(2)}</span>
          </div>
          <div className="summary-row total-row">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
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
