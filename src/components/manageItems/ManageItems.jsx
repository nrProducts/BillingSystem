import React from "react";
import AddItemsModal from "./add/AddItemsModal";
import { Table, Input, Spin, Button } from "antd";
import "./ManageItems.css"; // Import external CSS
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Label } from "@fluentui/react";

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
  categoryList,
  addCategoryForm,
  newCategory,
  handleCategory,
  submitCategory,
  setAddCategoryForm,
  categoryError,
  SetCategoryError
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
          categoryList={categoryList}
          handleUpdate={handleUpdate}
          handleAdd={handleAdd}
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
              pagination={{ pageSize: 10 }}
              rowClassName={(record) =>
                record?.is_active === false ? "inactive-row" : ""
              }
            />
          </Spin>
        </div>

        {/* Right: Category List Styled Like Bill Preview */}
        <div className="category-preview-section">
          <div className="category-card">
            <div className="category-header">
              <h3>📁 Category List</h3>
              <Button
                className={`fab-button ${addCategoryForm ? "rotated" : ""}`}
                type="primary"
                shape="circle"
                icon={<PlusOutlined />}
                onClick={() => { setAddCategoryForm(!addCategoryForm), SetCategoryError('') }}
              />
            </div>

            {addCategoryForm && (
              <div className="parent">
                <div className="child1">
                  <Label>Category Name :</Label>
                </div>
                <div className="child2">
                  <Input
                    value={newCategory}
                    placeholder="Category name"
                    onChange={(e) => handleCategory(e.target.value)}
                    style={categoryError ? { border: '1px solid red' } : {}}
                  />
                </div>
                <div className="child3">
                  <SaveOutlined
                    onClick={submitCategory}
                    // style={{
                    //   color: '#1890ff',
                    //   backgroundColor: '#1890ff',  // Added background color
                    //   fontSize: '36px',
                    //   cursor: 'pointer',
                    //   border: '1px solid red',
                    //   padding: '5px'
                    // }}
                    style={{
                      color: '#fff',                // White icon/text color
                      backgroundColor: '#1890ff',  // Matching background
                      fontSize: '33px',
                      cursor: 'pointer',
                      // border: '1px solid red',
                      borderRadius: '4px',
                      padding: '5px'
                    }}
                                        
                  />
                </div>
              </div>
            )}

            {categoryList?.length > 0 ? (
              <ul className="category-list">
                {categoryList?.map((cat) => (
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
