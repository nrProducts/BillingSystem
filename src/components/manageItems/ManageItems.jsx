import AddItemsModal from "./add/AddItemsModal";
import ItemForm from "./add/ItemForm";
import { Table, Input, Spin } from "antd";

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
}) => {
  return (
    <div>
      {/* <ItemForm
        onSubmit={editingItem ? handleUpdate : handleAdd}
        initialData={editingItem}
        isEditing={!!editingItem}
        onCancel={() => setEditingItem(null)}
      /> */}

      <AddItemsModal/>

      <div className="catalog-section">
        <Spin spinning={loader} tip={"Loding..."}>
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
            rowClassName={(record) =>
              record?.is_active == false ? "inactive-row" : ""
            }
          />
        </Spin>
      </div>
    </div>
  );
};

export default ManageItems;
