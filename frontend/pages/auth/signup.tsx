import AuthForm from '../../components/authForm';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
    const { signup } = useAuth();
    return <AuthForm mode="signup" onSubmit={signup} />;
}