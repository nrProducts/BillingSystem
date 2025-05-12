import { Table, Input, Button, Spin, Switch, Card, Tag, Dropdown } from "antd";
import "./ItemBilling.css";
import BillContainer from "./BillPreview/BillPerviewContainer";
import {
  AppstoreOutlined,
  EllipsisOutlined,
  TableOutlined,
} from "@ant-design/icons"; // Import the icon
import imgIcon from "./../../asserts/images/img.png";

const ItemBilling = ({
  filteredItems,
  loader,
  itemColumns,
  selectedItems,
  search,
  setSearch,
  setSelectedItems,
  handleRemove,
  setViewMode,
  viewMode,
  getMenu,
  tableDetails,
    setExistedItems,
    categoryList, selectedCategory, setSelectedCategory
}) => {
  return (
    <div className="shared-layout-container">
      <div className="shared-table-section">
              <h3 style={{ margin: 0 }}>
                  Item Billing{" "}
                  {tableDetails && (
                      <>
                          -{" "}
                          <Tag
                              color={"#f8d7da"}
                              style={{
                                  color: "#721c24",
                                  fontSize: "12px",
                                  padding: "0 8px",
                                  borderRadius: "50px",
                              }}
                          >
                              {`   ${tableDetails.name}   `}
                          </Tag>
                      </>
                  )}
              </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e?.target?.value)}
            style={{ margin: '20px 0', width: 300 }}
          />
          <Button
            icon={
              viewMode === "grid" ? <AppstoreOutlined /> : <TableOutlined />
            }
            onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
            style={{
              backgroundColor: viewMode === "grid" ? "#a6a9aa" : "#d6085e",
              color: "white",
            }}
          >
            {viewMode === "grid" ? "Switch to Table" : "Switch to Grid"}
          </Button>
        </div>

        <div className='maindiv'>
          <div className='sideDiv1'>
            <div className="category">
              <ul className="category-list">
                <li
                  className={`category-item ${selectedCategory === null ? 'active' : ''}`}
                  key={'default'}
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </li>
                {categoryList?.map((cat) => (
                  <li
                    key={cat?.id}
                    className={`category-item ${selectedCategory?.id === cat?.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat?.name || "Uncategorized"}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className='sideDiv2'> <Spin spinning={loader} tip={'Loading...'}>
            {viewMode === 'table' ? (
              <Table
                className="custom-table"
                dataSource={filteredItems}
                columns={itemColumns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                rowClassName={(record) => (record?.is_active === false ? 'inactive-row' : '')}
              />
            ) : (
              <div className="item-grid-container">
                {filteredItems.map((item) => (
                  <Card
                    key={item?.id}
                    className="item-card blue-header-card"
                    title={null}
                    extra={(
                      <Dropdown overlay={getMenu(item)} trigger={['click']}>
                        <Button type="text" icon={<EllipsisOutlined />} />
                      </Dropdown>
                    )}
                    style={{ opacity: item?.is_active ? 1 : 0.5 }}
                  >
                    <div className="item-icon-wrapper">
                      <img
                        alt="Item Icon"
                        src={imgIcon}
                        className="item-icon"
                      />
                    </div>
                    <h3 style={{ marginBottom: 0, fontSize: 12 }}>{item?.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                      <p style={{ marginBottom: 0, fontSize: 12 }}><strong>Category:</strong> {item?.category ?? '-'}</p>
                      <p style={{ marginBottom: 0, fontSize: 12 }}><strong>Price:</strong> ${item?.price?.toFixed(2)}</p>
                    </div>

                    <div className="tag-button-row">
                      <Tag
                        color={item?.is_active ? '#d4edda' : '#f8d7da'}
                        style={{
                          color: item?.is_active ? '#155724' : '#721c24',
                          fontSize: '12px',
                          padding: '0 8px',
                          borderRadius: '50px'
                        }}
                      >
                        {item?.is_active ? 'Active' : 'Sold Out'}
                      </Tag>

                      <Button
                        type="primary"
                        className="bounce-button"
                        onClick={() => handleAddToBill(item)}
                        disabled={!item?.is_active}
                        size="small"
                      >
                        Add to Bill
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Spin></div>
        </div>

      </div>

      <div className="shared-side-section">
        <BillContainer
          itemColumns={itemColumns}
          setSelectedItems={setSelectedItems}
          filteredItems={filteredItems}
          selectedItems={selectedItems}
          handleRemove={handleRemove}
          tableDetails={tableDetails}
          setExistedItems={setExistedItems}
        />
      </div>
    </div>
  );
};

export default ItemBilling;
