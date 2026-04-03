import { useEffect, useState } from 'react';
import { userService } from '../services/user.service';
import type { UserResponse, PageResponse } from '../types/user';

interface Props {
  refreshKey: number;
}

export function UserTable({ refreshKey }: Props) {
  const [data, setData] = useState<PageResponse<UserResponse> | null>(null);
  const [page, setPage] = useState(0);
  const size = 10;
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsersPaginated(page, size);
      setData(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, refreshKey]);

  useEffect(() => {
    // Reset to page 0 if refreshKey changes
    if (page !== 0) {
      setPage(0);
    }
  }, [refreshKey]);

  return (
    <div className="table-container">
      <h2>Danh sách Người Dùng (Masked)</h2>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <table className="user-table">
            <thead>
              <tr>
                <th>Họ và tên</th>
                <th>CCCD (Masked)</th>
                <th>Email (Masked)</th>
                <th>SĐT (Masked)</th>
              </tr>
            </thead>
            <tbody>
              {data?.content.map((user, index) => (
                <tr key={index}>
                  <td>{user.fullName}</td>
                  <td>{user.maskedCccd}</td>
                  <td>{user.maskedEmail}</td>
                  <td>{user.maskedPhone}</td>
                </tr>
              ))}
              {(!data?.content || data.content.length === 0) && (
                <tr>
                  <td colSpan={4} className="text-center">Chưa có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>

          {data && data.totalPages > 1 && (
            <div className="pagination">
              <button 
                disabled={data.number === 0} 
                onClick={() => setPage(p => p - 1)}
              >
                Trước
              </button>
              <span>Trang {data.number + 1} / {data.totalPages}</span>
              <button 
                disabled={data.number >= data.totalPages - 1} 
                onClick={() => setPage(p => p + 1)}
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
