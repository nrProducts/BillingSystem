import { Table, Input, Button, Spin } from 'antd';
import './ItemBilling.css';
import BillContainer from './BillPreview/BillPerviewContainer';

const ItemBilling = ({ filteredItems, loader, itemColumns, selectedItems, search, setSearch, setSelectedItems, handleRemove }) => {

  return (
    <div className="shared-layout-container">
      <div className="shared-table-section">
            <h3 style={{margin : '0 0 0 0'}}>Item Billing</h3>
            <Spin spinning={loader} tip={'Loding...'}>
              <Input
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: 20, width: 300 }}
              />

              <Table
                dataSource={filteredItems}
                columns={itemColumns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                // scroll={{ y: 'calc(75vh - 150px)' }} // Adjust height as needed
                // scroll={{ y: 400 }}
                rowClassName={(record) => (record?.is_active === false ? 'inactive-row' : '')}
              />

            </Spin>
        </div>
        <div className="shared-side-section">
          <BillContainer
            itemColumns={itemColumns}
            setSelectedItems={setSelectedItems}
            filteredItems={filteredItems}
            selectedItems={selectedItems}
            handleRemove={handleRemove}
          />
        </div>
      </div>
  );
};

export default ItemBilling;
