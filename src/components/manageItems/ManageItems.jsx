import React, { useMemo } from "react";
import AddItemsModal from "./add/AddItemsModal";
import { Table, Input, Spin, Button } from "antd";
import "./ManageItems.css"; // Import external CSS

const categoryOptions = [
  { value: "general", label: "General" },
  { value: "electronics", label: "Electronics" },
  { value: "groceries", label: "Groceries" },
  { value: "clothing", label: "Clothing" },
];


const ManageItems = ({
  filteredItems,
  itemColumns,
  search,
  setSearch,
  loader,
  editingItem,
  handleUpdate,
  handleAdd,
  setEditingItem,
  visibleForm,
  setVisibleForm,
  onAddClicked,
  formItems,
  setFormItems,
  category
}) => {

  return (
    <div>
      <Button
        type="primary"
        onClick={onAddClicked}
        style={{ marginBottom: 16 }}
      >
        Bulk Add Items
      </Button>

      {visibleForm && (
        <AddItemsModal
          setVisibleForm={setVisibleForm}
          visibleForm={visibleForm}
          formItems={formItems}
          setFormItems={setFormItems}
          category = {category}
          handleUpdate = {handleUpdate}
          handleAdd = {handleAdd}
        />
      )}

      <div className="manage-items-container">
        {/* Left: Item Table Section */}
        <div className="item-table-section">
          <Spin spinning={loader} tip={"Loading..."}>
            <Input
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginBottom: 20, width: "100%" }}
            />
            <Table
              dataSource={filteredItems}
              columns={itemColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              rowClassName={(record) =>
                record?.is_active === false ? "inactive-row" : ""
              }
            />
          </Spin>
        </div>

        {/* Right: Category List Styled Like Bill Preview */}
        <div className="category-preview-section">
          <div className="category-card">
            <h3>📁 Category List</h3>
            {category.length > 0 ? (
              <ul className="category-list">
                {category.map((cat) => (
                  <li key={cat?.id} className="category-item">
                    {cat?.name || "Uncategorized"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-categories">No categories found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageItems;
