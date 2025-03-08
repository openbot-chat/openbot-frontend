import { Seo } from '@/components/Seo';
import AuthLayout from '@/layout/auth';


export default function SignUpPage() {
  return (
    <AuthLayout>
      <Seo title="注册" />
    </AuthLayout>
  );
}