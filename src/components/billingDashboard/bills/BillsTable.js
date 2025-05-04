import React, { useEffect, useState } from 'react';
import { Table, Input, DatePicker, Space, Modal, Button } from 'antd';
import dayjs from 'dayjs';
import { getBills } from '../../../api/bills';
import GenerateReport from '../generateReport/GenerateReport';


const BillsTable = () => {
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [loading, setLoading] = useState(false);
  const [sorter, setSorter] = useState({});
  const [dateRange, setDateRange] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);


  const fetchData = async (params = {}) => {
    setLoading(true);
    const res = await getBills({
      page: params.pagination?.current || 1,
      pageSize: params.pagination?.pageSize || 5,
      sortField: params.sorter?.field,
      sortOrder: params.sorter?.order,
      // search: params.search,
      startDate: params.startDate,
      endDate: params.endDate,
    });

    setTableData(res.data);
    setPagination({
      current: res.page,
      pageSize: res.pageSize,
      total: res.total,
    });
    setLoading(false);
  };


  useEffect(() => {
    fetchData({ pagination, sorter });
  }, []);

  // const handleTableChange = (newPagination, _, newSorter) => {
  //   setPagination(newPagination);
  //   setSorter(newSorter);
  //   fetchData({ pagination: newPagination, sorter: newSorter, search });
  // };
  const handleTableChange = (newPagination, _, newSorter) => {
    setPagination(newPagination);
    setSorter(newSorter);
    fetchData({
      pagination: newPagination,
      sorter: newSorter,
      // search,
      startDate: dateRange[0]?.startOf('day').toISOString(),
      endDate: dateRange[1]?.endOf('day').toISOString(),
    });
  };


  // const handleSearch = (e) => {
  //   const value = e.target.value;
  //   setSearch(value);
  //   fetchData({ pagination: { ...pagination, current: 1 }, sorter, search: value });
  // };

  const handleDateChange = (dates) => {
    setDateRange(dates);
    const [start, end] = dates || [];
    fetchData({
      pagination: { ...pagination, current: 1 },
      sorter,
      // search,
      startDate: start?.startOf('day').toISOString(),
      endDate: end?.endOf('day').toISOString(),
    });
  };

  useEffect(() => {
    fetchData({
      pagination,
      sorter,
      // search,
      startDate: dateRange[0] ? dateRange[0].startOf('day').toISOString() : null,
      endDate: dateRange[1] ? dateRange[1].endOf('day').toISOString() : null,
    });
  }, []);


  const columns = [
    { title: 'Bill ID', dataIndex: 'id', sorter: true },
    {
      title: 'Items',
      dataIndex: 'item_names',
      key: 'item_names',
      ellipsis: true,
      render: (text) => (
        <span title={text}>
          {text}
        </span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'created',
      sorter: true,
      render: (val) => dayjs(val).format('YYYY-MM-DD'),
    },
    {
      title: 'GST Total',
      dataIndex: 'total_gst',
      sorter: true,
      render: (val) => `₹${val?.toFixed?.(2) ?? '0.00'}`,
    },
    {
      title: 'Grand Total',
      dataIndex: 'grand_total',
      sorter: true,
      render: (val) => `₹${val?.toFixed?.(2) ?? '0.00'}`,
    },
  ];

  return (
    <div className=".bill_table">
      <h3 style={{ margin: 0 }}>Bill Details</h3>
      <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 15, flexWrap: 'wrap' }}>
        <DatePicker.RangePicker
          value={dateRange}
          onChange={handleDateChange}
          format="YYYY-MM-DD"
          allowClear
          style={{ minWidth: 250 }}
        />
        <Button
          type="primary"
          onClick={() => setModalOpen(true)}
          style={{ marginTop: 8, height: 40}}
        >
          Generate Report
        </Button>
      </Space>


      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      <Modal
        title="Generate Report"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <GenerateReport setModalOpen={setModalOpen} />
      </Modal>
    </div>
  );
};

export default BillsTable;
