import { Input, Spin, Table } from "antd";
import React from "react";

const User = (props) => {
    return <div className="shared-layout-container">
        <div className="item-table-section">
            <h3 className="title">User Management</h3>
            <Spin spinning={props?.loader} tip={"Loading..."}>
                <div className="table-controls">
                    <Input
                        placeholder="Search user"
                        value={props?.search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </div>

                <Table
                    dataSource={props?.filteredItems}
                    columns={props?.column}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Spin>
        </div>
    </div >
}

export default User;