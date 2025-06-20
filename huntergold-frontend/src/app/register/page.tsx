import Layout from '@/components/Layout';
import RegisterForm from '@/components/Auth/RegisterForm';

export default function RegisterPage() {
  return (
    <Layout>
      <div style={{ textAlign: 'center' }}>
        <h2>Create Your Account</h2>
      </div>
      <RegisterForm />
    </Layout>
  );
}
