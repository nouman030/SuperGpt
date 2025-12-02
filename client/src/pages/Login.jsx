import React from 'react'
import LoginForm from '../components/login-form'
import Loader from '../components/Loading'

const Login = () => {
    const [loading, setLoading] = React.useState(false);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[--color-bg-primary]">
                <Loader />
            </div>
        );
    }

    return (
        <div className=' flex justify-center items-center w-full h-screen text-text-primary'>
            <LoginForm setLoading={setLoading} />
        </div>
    )
}

export default Login