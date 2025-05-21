import { Input, Spin, Table, Modal } from "antd";
import React from "react";

const User = ({
  loader,
  search,
  setSearch,
  userList,
  columns,
  showPopConfirm,
  setShowPopConfirm,
  setLoader,
  userId,
  handleDelete,
}) => {
  return (
    <div className="shared-layout-container">
      <div className="shared-table-section">
        <div className="item-table-section">
          <h3 className="title">User Management</h3>
          <Spin spinning={loader} tip={"Loading..."}>
            <div className="table-controls">
              <Input
                placeholder="Search user"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <Table
              dataSource={userList}
              columns={columns}
              rowKey="user_id"
              rowClassName={(record) =>
                record?.is_active === false ? "inactive-row" : ""
              }
              pagination={{ pageSize: 10 }}
            />
          </Spin>

          <Modal
            title="Are you sure you want to delete this item?"
            open={showPopConfirm}
            onOk={() => handleDelete(userId)}
            onCancel={() => {
              setShowPopConfirm(false);
              setLoader(false);
            }}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: {
                backgroundColor: "#d6085e",
                color: "white",
              },
            }}
          >
            <p>This action cannot be undone.</p>
          </Modal>
        </div>
      </div> </div>
  );
};

export default User;
