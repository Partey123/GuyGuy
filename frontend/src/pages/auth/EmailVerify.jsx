import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { toast } from 'react-hot-toast';

const EmailVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      toast.error('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        setIsLoading(true);
        const response = await authApi.verifyEmail({ token });
        if (response?.success) {
          setIsVerified(true);
          toast.success('Email verified successfully!');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error) {
        console.error('Email verification failed:', error);
        toast.error(error.message || 'Email verification failed');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Email Verified Successfully!
            </h1>
            <p className="text-gray-600 mb-8">
              Your email has been verified. You can now log in to your account.
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800">
                <strong>Redirecting to login page...</strong>
              </p>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full bg-amber-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-white text-xl">
            GG
          </div>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
              Click the button below to verify your email address
            </p>
          </div>

          <button
            onClick={async () => {
              try {
                setIsLoading(true);
                const response = await api.post('/auth/verify-email', { token });
                if (response.success) {
                  setIsVerified(true);
                  toast.success('Email verified successfully!');
                }
              } catch (error) {
                console.error('Email verification failed:', error);
                toast.error(error.message || 'Email verification failed');
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="w-full bg-amber-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2">Verifying...</span>
              </div>
            ) : (
              'Verify Email'
            )}
          </button>

          <div className="text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-amber-600 hover:text-amber-700 text-sm font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Didn't receive the verification email?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Back to login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
