import Icons from "../Utilities/Icons";
import { type SubmitEvent, useContext, useState } from "react";
import AuthContext from "../Context/AuthContext";
import clsx from "clsx";

interface RegisterFormProps {
    toggleForm: () => void,
    showToast: (success: boolean, message: string) => void,
}

const RegisterForm = ({ toggleForm, showToast } : RegisterFormProps) => {

    const authContext = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(false);

    const buttonClassName = clsx(
            'submit-button',
            loading ? 'loading' : '',
        );
    
    const buttonContent = loading ? 'Registering...' : 'Register';

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        const registerCredentials = new FormData(event.target);

        for(const [_key, value] of registerCredentials) {
            if (!value) {
                showToast(false, 'Input all the required fields.');
                return;
            }
        }

        setLoading(true);
        const registerData = Object.fromEntries(registerCredentials);
        const registered = await authContext.register(registerData as unknown as RegisterCredentials);

        if (registered.success) {
            toggleForm();
            showToast(true, 'Registration Successful!');
        }
        showToast(
            false, 
            registered.data instanceof Error ? 
                registered.data.message : 
                    registered.data.detail[0].msg ? 
                        registered.data.detail[0].msg : registered.data.detail
        );
        setLoading(false);
    }

  return (
    <article className="sign-in-container">
                <section className="sign-in-header">
                    <h2>Register Account</h2>
                    <p>Create an account to Control your Robot.</p>
                </section>
                <section className="scrollable">
                    <form className="sign-in-form space-top" onSubmit={handleSubmit}>
                        <div className="input-field-container">
                            <label htmlFor="full-name">Full Name</label>
                            <div>
                                <Icons.Name className="input-icon" />
                                <input 
                                    name="name" 
                                    id="full-name" 
                                    type="text"
                                    className="input-field"
                                    placeholder="Juan Dela Cruz"
                                />
                            </div>
                        </div>
                        <div className="input-field-container space-above">
                            <label htmlFor="user-id">Student / Employee ID</label>
                            <div>
                                <Icons.Number className="input-icon"/>
                                <input 
                                    name="id" 
                                    id="user-id"
                                    type="text"
                                    className="input-field"
                                    placeholder="XXXX-XXXX"
                                />
                            </div>
                        </div>
                        <div className="input-field-container space-above">
                            <label htmlFor="email_address">Email Address</label>
                            <div>
                                <Icons.Email className="input-icon"/>
                                <input 
                                    name="email" 
                                    id="email_address"
                                    type="email"
                                    className="input-field"
                                    placeholder="email@lspu.edu.ph"
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
                        <div className="input-field-container space-above">
                            <label htmlFor="confirm_password">Confirm Password</label>
                            <div>
                                <Icons.Password className="input-icon"/>
                                <input 
                                    name="confirm_password" 
                                    id="confirm_password"
                                    type="password"
                                    className="input-field"
                                    placeholder="••••••••••••••"
                                />
                            </div>
                        </div>
                        <button type="submit" className={buttonClassName}>
                            {buttonContent} {loading ? <Icons.Loading className="loading-circle" /> : <Icons.ArrowRight style={{verticalAlign: 'middle'}} />}
                        </button>
                    </form>
                    <section className="create-account">
                        <p>
                            Already Have an Account? &nbsp;
                            <a onClick={toggleForm}>Sign In</a>
                        </p>
                    </section>
                </section>
            </article>
  )
}

export default RegisterForm