import Icons from "../Utilities/Icons";
import { type SubmitEvent, useContext, useState } from "react";
import AuthContext from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

interface SignInFormProps {
    toggleForm: () => void,
    showToast: (success: boolean, message: string) => void,
}

const SignInForm = ({ toggleForm, showToast } : SignInFormProps) => {

    const authContext = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const buttonClassName = clsx(
        'submit-button',
        loading ? 'loading' : '',
    );

    const buttonContent = loading ? 'Signing In...' : 'Sign In';

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        const formTarget = event.target;
        const signInCredentials = new FormData(formTarget);

        for(const [_key, value] of signInCredentials) {
            if (!value) {
                showToast(false, 'Input all the required fields.');
                return;
            }
        }

        setLoading(true)
        const responseData = await authContext.login(signInCredentials);

        if (responseData.success) {
            navigate('/dashboard');
            return;
        }
        showToast(
            false, 
            responseData.data instanceof Error ? 
                responseData.data.message : 
                    responseData.data.detail[0].msg ? 
                        responseData.data.detail[0].msg : responseData.data.detail
        );
        setLoading(false);
    }

  return (
    <article className="sign-in-container">
            <section className="sign-in-header">
                <h2>Welcome!</h2>
                <p>Sign in to Control your Robot.</p>
            </section>
            <form onSubmit={handleSubmit} className="sign-in-form space-top">
                <div className="input-field-container">
                    <label htmlFor="user-id">Student / Employee ID</label>
                    <div>
                        <Icons.Number className="input-icon" />
                        <input 
                            name="username" 
                            id="user-id" 
                            type="text"
                            className="input-field"
                            placeholder="XXXX-XXXX"
                        />
                    </div>
                </div>
                <div className="input-field-container space-above">
                    <label htmlFor="password">Password</label>
                    <div>
                        <Icons.Password className="input-icon"/>
                        <input 
                            name="password" 
                            id="password"
                            type="password"
                            className="input-field"
                            placeholder="••••••••••••••"
                        />
                    </div>
                </div>
                <a className="forgot-password">Forgot Password?</a>
                <button type="submit" className={buttonClassName}>
                    {buttonContent} {loading ? <Icons.Loading className="loading-circle" /> : <Icons.ArrowRight style={{verticalAlign: 'middle'}} />}
                </button>
            </form>
            <section className="create-account">
                <p>
                    Need an Account? &nbsp;
                    <a onClick={toggleForm}>Create Account</a>
                </p>
            </section>
        </article>
  )
}

export default SignInForm