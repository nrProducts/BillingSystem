import React from "react";
import AddItemsModal from "./add/AddItemsModal";
import { Modal, Input, Button, Table, Spin } from "antd";
import "./ManageItems.css"; // Import external CSS
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';

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
  SetCategoryError,
  showPopConfirm,
  setShowPopConfirm,
  itemToDelete,
  handleDelete,
  setLoader
}) => {
  return (
    <div>
      {visibleForm && (
        <AddItemsModal
          setVisibleForm={setVisibleForm}
          visibleForm={visibleForm}
          formItems={formItems}
          setFormItems={setFormItems}
          categoryList={categoryList}
          handleUpdate={handleUpdate}
          handleAdd={handleAdd}
          loader={loader}
        />
      )}

      <Modal
        title="Are you sure you want to delete this item?"
        open={showPopConfirm}
        onOk={() => handleDelete(itemToDelete)}
        onCancel={() => {
          setShowPopConfirm(false);
          setLoader(false);
        }}
        okText="Yes"
        cancelText="No"
        okButtonProps={{
          style: {
            backgroundColor: '#d6085e', // Set the desired background color
            color: 'white', // Set the text color (optional)
          },
        }}
      >
        <p>This action cannot be undone.</p>
      </Modal>

      <div className="shared-layout-container">
        <div className="shared-table-section">
          <div className="manage-items-container">
            {/* Left: Item Table Section */}
            <div className="item-table-section">
              <h3 className="title">Manage Your Items</h3>
              <Spin spinning={loader} tip={"Loading..."}>
                <div className="table-controls">
                  <Input
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: "100%" }}
                  />
                  <Button
                    type="primary"
                    onClick={onAddClicked}
                    style={{ marginLeft: "1rem", backgroundColor : "#d6085e", color : 'white' }}
                  >
                    Bulk Add Items
                  </Button>
                </div>

                <Table
                  dataSource={filteredItems}
                  columns={itemColumns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  // scroll={{ y: 'calc(75vh - 150px)' }} 
                  rowClassName={(record) =>
                    record?.is_active === false ? "inactive-row" : ""
                  }
                />
              </Spin>
            </div>
          </div>
        </div>
        <div className="shared-side-section">
          {/* Right: Category List Styled Like Bill Preview */}
          <div className="category-preview-section">
            <div className="category-card">
              <div className="category-header">
                <h3>Category List</h3>
                <Button
                  className={`fab-button ${addCategoryForm ? "rotated" : ""}`}
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined />}
                  style={{backgroundColor : "#d6085e", color : 'white'}}
                  onClick={() => { setAddCategoryForm(!addCategoryForm), SetCategoryError('') }}
                />
              </div>

              {addCategoryForm && (
                <div className="parent">
                  <div className="child2">
                    <Input
                      value={newCategory}
                      placeholder="Category name"
                      onChange={(e) => handleCategory(e.target.value)}
                      style={{
                        height: '32px',
                        padding: '4px 10px',
                        fontSize: '14px',
                        border: categoryError ? '1px solid red' : '1px solid #dcdcdc',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                  <div className="child3">
                    <CheckOutlined
                      onClick={submitCategory}
                      className="check-icon"
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
      </div></div>
  );
};

export default ManageItems;