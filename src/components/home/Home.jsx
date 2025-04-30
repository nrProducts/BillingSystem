import { Table, Input, Button, Spin } from 'antd';
import './Home.css';
import BillContainer from './BillPreview/BillPerviewContainer';

const Home = ({ filteredItems, loader, itemColumns, selectedItems, search, setSearch, setSelectedItems, handleRemove }) => {

  return (
    <div className="home-container">
      <div className="catalog-section">
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
            rowClassName={(record) => (record?.is_active == false ? 'inactive-row' : '')}
          />
        </Spin>
      </div>
      <BillContainer
        itemColumns={itemColumns}
        setSelectedItems={setSelectedItems}
        filteredItems={filteredItems}
        selectedItems={selectedItems}
        handleRemove={handleRemove}
      />
    </div>
  );
};

export default Home;
