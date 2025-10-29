import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getRevenueChartData } from '../../services/adminService';
import './RevenueChart.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{label}</p>
        <p className="intro">Doanh thu: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const RevenueChart = () => {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRevenueChartData(period);
      setData(result);
    } catch (err) {
      setError('Không thể tải dữ liệu biểu đồ.');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatXAxis = (tickItem) => {
    if (period === '12m') {
      return `T${new Date(tickItem + '-02').getMonth() + 1}`;
    }
    return new Date(tickItem).getDate();
  }

  return (
    <div className="revenue-chart-wrap">
      <div className="chart-header">
        <h3 className="chart-title">Tổng Quan Doanh Thu</h3>
        <div className="chart-controls">
          <button onClick={() => setPeriod('7d')} className={period === '7d' ? 'active' : ''}>7 Ngày</button>
          <button onClick={() => setPeriod('30d')} className={period === '30d' ? 'active' : ''}>30 Ngày</button>
          <button onClick={() => setPeriod('12m')} className={period === '12m' ? 'active' : ''}>12 Tháng</button>
        </div>
      </div>
      <div className="chart-container">
        {loading ? (
          <p>Đang tải biểu đồ...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                fontSize={12}
                tickFormatter={formatXAxis}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12} 
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}tr`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "14px" }}/>
              <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
