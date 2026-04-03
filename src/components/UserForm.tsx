import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { userService } from '../services/user.service';

const schema = z.object({
  fullName: z.string().min(1, 'Họ và tên không được để trống'),
  cccd: z.string().regex(/^\d{12}$/, 'CCCD phải gồm đúng 12 chữ số'),
  email: z.string().email('Email không đúng định dạng'),
  phone: z.string().regex(/^(0[3|5|7|8|9])\d{8}$/, 'Số điện thoại không hợp lệ (10 số, đầu số VN)'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSuccess: () => void;
}

export function UserForm({ onSuccess }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await userService.createUser(data);
      alert('Thêm mới thành công');
      reset();
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi thêm mới');
    }
  };

  return (
    <div className="form-container">
      <h2>Thêm Người Dùng</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="user-form">
        <div className="form-group">
          <label>Họ và tên</label>
          <input {...register('fullName')} placeholder="Nhập họ và tên" />
          {errors.fullName && <span className="error">{errors.fullName.message}</span>}
        </div>

        <div className="form-group">
          <label>CCCD</label>
          <input {...register('cccd')} placeholder="Nhập 12 số CCCD" />
          {errors.cccd && <span className="error">{errors.cccd.message}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input {...register('email')} placeholder="Nhập email" />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input {...register('phone')} placeholder="Nhập số điện thoại" />
          {errors.phone && <span className="error">{errors.phone.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang xử lý...' : 'Thêm mới'}
        </button>
      </form>
    </div>
  );
}
