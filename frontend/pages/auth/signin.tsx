import AuthForm from '../../components/authForm';
import { useAuth } from '@/hooks/useAuth';

export default function SigninPage() {
    const { signin } = useAuth();
    return <AuthForm mode="signin" onSubmit={signin} />;
}