import Layout from '@/components/Layout';
import LoginForm from '@/components/Auth/LoginForm';

export default function LoginPage() {
  return (
    <Layout>
      <div style={{ textAlign: 'center' }}>
        <h2>Login to HunterGold</h2>
      </div>
      <LoginForm />
    </Layout>
  );
}
