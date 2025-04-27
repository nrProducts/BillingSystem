import { Table, Input, Button } from 'antd';
import './Home.css';
import BillContainer from './BillPreview/BillPerviewContainer';

const Home = ({ filteredItems, itemColumns, selectedItems, search, setSearch, total, handleRemove }) => {

  return (
    <div className="home-container">
      <div className="catalog-section">
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
          pagination={{ pageSize: 5 }}
        />
      </div>

      <div className="bill-preview">
        <BillContainer
          itemColumns={itemColumns}
          total={total}
          filteredItems={filteredItems}
          selectedItems={selectedItems}
          handleRemove={handleRemove}
        />
      </div>
    </div>
  );
};

export default Home;
