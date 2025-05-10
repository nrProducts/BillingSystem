import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Spin, Modal, Input, Radio, message, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './tableManager.css';
import { addTable, deleteTable, fetchTables, updateTable } from '../../api/tables';

const TableManager = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');

  const [tables, setTables] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [error, setError] = useState({});
  const [tableForm, setTableForm] = useState({});

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoader(true);
      const data = await fetchTables();
      setTables(data?.data ?? []);
    } finally {
      setLoader(false);
    }
  };

  const handleAdd = async () => {
    setLoader(true);
    const addPayload = { ...tableForm };
    addPayload.user_id = userId;
    const result = await addTable(addPayload);
    if (result?.success) {
      await loadTables();
      notification.success({
        message: "Success",
        description: "Tables added successfully.",
        placement: "topRight",
      });
      setLoader(false);
      setShowModal(false);
      setTableForm({});
      setError({});
    } else {
      notification.error({
        message: "Error",
        description: "Failed to add",
        placement: "topRight",
      });
      setLoader(false);
    }
  };

  const handleUpdate = async () => {
    setLoader(true);
    const addPayload = { ...tableForm };
    const result = await updateTable(addPayload?.id, addPayload);
    if (result?.success) {
      await loadTables();
      notification.success({
        message: "Success",
        description: "Tables updated successfully.",
        placement: "topRight",
      });
      setLoader(false);
      setShowModal(false);
      setTableForm({});
      setError({});
    } else {
      notification.error({
        message: "Error",
        description: "Failed to update",
        placement: "topRight",
      });
      setLoader(false);
    }
  };

  const openAddModal = () => {
    setTableForm({});
    setError({});
    setIsEdit(false);
    setShowModal(true);
  };

  const openEditModal = (table) => {
    setTableForm(table);
    setIsEdit(true);
    setError({});
    setSelectedTable(table);
    setShowModal(true);
  };

  const onFormChange = (key, value) => {
    let tempForm = { ...tableForm };
    tempForm[key] = value;
    setTableForm(tempForm);
  };

  const handleSubmit = async () => {
    let tempError = {};

    if (!tableForm?.name.trim()) {
      tempError.name = 'Table name is required';
    }

    if (!tableForm?.zone) {
      tempError.zone = 'Please select a zone';
    }
    setError({ ...tempError });

    if (Object?.keys(tempError)?.length > 0) {
      message.error(Object.values(tempError).join(', '));
      return;
    }

    if (isEdit) {
      await handleUpdate();
    } else {
      await handleAdd();
    }

    setShowModal(false);
  };

  const removeTable = async (id) => {
    setLoader(true);
    const result = await deleteTable(id);
    if (result?.success) {
      await loadTables();
      notification.success({
        message: "Success",
        description: "Table deleted successfully.",
        placement: "topRight",
      });
      setLoader(false);
      setShowModal(false);
      setTableForm({});
      setError({});
    } else {
      notification.error({
        message: "Error",
        description: "Failed to delete",
        placement: "topRight",
      });
      setLoader(false);
    }
  };

  const goToBilling = (id) => {
    if (!id) {
      navigate('/itemBilling');
    } else {
      navigate(`/itemBilling/${id}`);
    }
  };

  const manageItems = (record, action) => {
    if (action === 'Edit') openEditModal(record);
    if (action === 'Remove') removeTable(record.id);
  };

  const menuItems = () => [
    { key: '1', label: 'Edit', value: 'Edit' },
    { key: '2', label: 'Remove', value: 'Remove' },
  ];

  const getMenu = (record) => (
    <Menu
      onClick={(e) => manageItems(record, menuItems(record).find((x) => x.key === e.key)?.value)}
      items={menuItems(record)}
    />
  );

  // Filter AC and Non-AC tables
  const acTables = tables.filter(t => t.zone === 'AC');
  const nonAcTables = tables.filter(t => t.zone === 'Non AC');

  return (
    <div className="shared-layout-container">
      <div className="shared-table-section">
        <div className="header-c">
          <h3 className='title'>Restaurant Table Management</h3>
          <div className="button-container">
            <Button className="takeaway" onClick={() => goToBilling()}>
              Take Away
            </Button>
            <Button className="add-table" onClick={openAddModal}>
              Add Table
            </Button>
          </div>
        </div>


        <Modal
          title={isEdit ? 'Edit Table' : 'Add Table'}
          open={showModal}
          onOk={handleSubmit}
          onCancel={() => setShowModal(false)}
          okText="Save"
          width={420}
        >
          <div className="custom-form">
            <label>Table Name:</label>
            <Input
              value={tableForm?.name}
              placeholder="Enter table name"
              onChange={(e) => onFormChange('name', e.target.value)}
              style={{ border: error?.name ? '1px solid red' : '' }}
            />

            <label style={{ marginTop: '0.5rem' }}>Zone:</label>
            <Radio.Group
              onChange={(e) => onFormChange('zone', e.target.value)}
              value={tableForm?.zone}
              style={{
                border: error?.zone ? '1px solid red' : 'none',
                padding: 5,
                borderRadius: 5,
                transition: 'border-color 0.3s ease-in-out'
              }}
            >
              <Radio value="AC">AC</Radio>
              <Radio value="Non AC">Non AC</Radio>
            </Radio.Group>
          </div>
        </Modal>

        <Spin spinning={loader}>
          {/* Show the grid only if there are AC tables */}
          {(acTables.length > 0 || nonAcTables.length > 0) ? (
            <div className="table-cards-section">
              {/* AC Zone */}
              {acTables.length > 0 && (
                <div className="table-category">
                  <h4>AC Tables</h4>
                  <div className="table-cards-container ac-zone">
                    {acTables.map((table) => (
                      <div key={table.id} className="table-card" onClick={() => goToBilling(table.id)}>
                        <div className="table-name">{table.name} ({table.zone})</div>
                        <div className="menu-dropdown" onClick={(e) => e.stopPropagation()}>
                          <Dropdown overlay={getMenu(table)} trigger={['click']}>
                            <Button type="text" icon={<EllipsisOutlined style={{ fontSize: '16px' }} />} />
                          </Dropdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Non AC Zone */}
              {nonAcTables.length > 0 && (
                <div className="table-category">
                  <h4>Non AC Tables</h4>
                  <div className="table-cards-container nonac-zone">
                    {nonAcTables.map((table) => (
                      <div key={table.id} className="table-card" onClick={() => goToBilling(table.id)}>
                        <div className="table-name">{table.name} ({table.zone})</div>
                        <div className="menu-dropdown" onClick={(e) => e.stopPropagation()}>
                          <Dropdown overlay={getMenu(table)} trigger={['click']}>
                            <Button type="text" icon={<EllipsisOutlined style={{ fontSize: '16px' }} />} />
                          </Dropdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="no-tables-message">
              No tables found. Click the <bold style={{color:"#d6085e"}}>Add Table</bold> button to create your first table.
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default TableManager;
