import { Card, Button, Modal, Spin, Radio } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import Kitchen from '../../kitchen/kitchen';

const BillHeader = () => (
  <h3 className="bill-title">Bill Preview</h3>
);

export const BillPreview = ({
  selectedItems,
  handleRemove,
  billingDetails,
  handleGenerateBill,
  loader,
  handleKot,
  handleKotAndPrint,
  handleSaveStagedItems,
  enableSave,
  showPopConfirm,
  setShowPopConfirm,
  paymentMethod,
  onChoosePayment,
  paymentOptions,
  savePaymentMethod,
  tableDetails,
}) => {
  const { subtotal, gstAmount, total } = billingDetails;

  return (
    <div className="bill-container">
      <BillHeader />
      <div className="bill-body">
        <Spin spinning={loader} tip="Loading...">
          {selectedItems?.length === 0 ? (
            <p className="bill-empty">No items added yet.</p>
          ) : (
            <div className="bill-items">
              {selectedItems.map((item) => (
                <Card
                  key={item?.id}
                  className="bill-item-card"
                  bodyStyle={{ padding: '1rem' }}
                >
                  <div className="bill-item-header">
                    <strong>{item?.name}</strong>
                    <Button
                      size="small"
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => handleRemove(item?.id)}
                    />
                  </div>
                  <div className="bill-item-details">
                    <div>Qty : {item?.quantity}</div>
                    <div>Unit : ₹{item?.price.toFixed(2)}</div>
                    <div style={{ fontWeight: '600' }}>Subtotal : ₹{(item?.price * item?.quantity).toFixed(2)}</div>
                    <div style={{ color: '#0c7a0c' }}>GST Rate : {item?.gst_rate}%</div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Spin>
      </div>

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
        {
          enableSave ? (
            <Button onClick={() => handleSaveStagedItems()}>
              Save
            </Button>
          ) : (
            <>
              {tableDetails && (
                <Button
                  disabled={selectedItems?.length === 0}
                  onClick={() => handleKot()}
                >
                  Dine-In
                </Button>
              )}
              <Button
                disabled={selectedItems?.length === 0}
                onClick={() => handleKotAndPrint()}
              >
                Takeaway
              </Button>
            </>
          )
        }


        <Button
          type="primary"
          size="large"
          block
          disabled={selectedItems?.length === 0}
          onClick={() => handleGenerateBill()}
          className="bill-generate-btn"
        >
          Generate Bill
        </Button>

        <Modal
          title="Update the payment method"
          open={showPopConfirm}
          onOk={() => {
            savePaymentMethod()
          }}
          onCancel={() => {
            // do nothing or show a warning
          }}
          maskClosable={false} // prevent close on outside click
          keyboard={false} // prevent close on ESC key
          okText="Save"
          okButtonProps={{
            style: {
              backgroundColor: "#d6085e",
              color: "white",
            },
          }}
          footer={[
            <Button
              key="save"
              type="primary"
              onClick={() => {
                savePaymentMethod()
              }}
              style={{
                backgroundColor: "#d6085e",
                color: "white",
              }}
            >
              Save
            </Button>,
          ]}
        >
          <Radio.Group
            name="radiogroup"
            options={paymentOptions}
            onChange={(e) => onChoosePayment(e)}
            value={paymentMethod}
          />
        </Modal>
      </div>
    </div>
  );
};

export default BillPreview;
