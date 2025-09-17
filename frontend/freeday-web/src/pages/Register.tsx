import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Button from '@/components/common/Button';
import { useToast } from '@/components/common/useToast';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import type { User } from '@/types/user';

// Schema validation using Zod
const registerSchema = z.object({
  name: z.string().min(1, 'Họ và tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu của bạn'),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'Bạn phải đồng ý với điều khoản',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'], // path to show error
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    setError, // Get setError from useForm
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      
      const { accessToken } = res.data;
      
      // Decode token to get user info
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const user: User = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        name: data.name, // Get name from form data as it's not in token
      };
      
      setUser(accessToken, user);
      
      toast.showToast('Đăng ký thành công!', 'success');
      navigate('/', { replace: true });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';

      // Handle specific server-side errors
      if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('email')) {
        setError('email', {
          type: 'server',
          message: 'Email này đã tồn tại hoặc không hợp lệ.'
        });
      } else {
        toast.showToast(errorMessage, 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-2">
            Tạo tài khoản
          </h2>
          <p className="text-lg text-neutral-600">
            Hoặc{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
              đăng nhập nếu đã có tài khoản
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                Họ và tên
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register('name')}
                className={`input ${errors.name ? 'input-error' : ''}`}
                placeholder="Nhập họ và tên"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="Nhập email của bạn"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register('password')}
                className={`input ${errors.password ? 'input-error' : ''}`}
                placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Nhập lại mật khẩu"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  type="checkbox"
                  {...register('agreeTerms')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="text-neutral-900">
                  Tôi đồng ý với{' '}
                  <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-500">
                    Điều khoản sử dụng
                  </Link>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeTerms.message}</p>}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Đăng ký
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 