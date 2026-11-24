import { useState } from "react";
import SignInForm from "../Components/SignInForm";
import RegisterForm from "../Components/RegisterForm";
import Icons from "../Utilities/Icons";
import clsx from "clsx";
import "./Auth.css";

type ToastMessage = {
  show: boolean;
  message: string;
  success: boolean;
};

const Auth = () => {
  const [loginScreen, setLoginScreen] = useState<boolean>(true);
  const [toast, setToast] = useState<ToastMessage>({
    show: false,
    message: "",
    success: true,
  });

  const toastClassName = clsx(
    "toast-container",
    toast.success ? "" : "toast-error",
    toast.show ? "" : "toast-hide",
  );

  function toggleForm() {
    setLoginScreen((prevScreen) => !prevScreen);
  }

  function showToast(success: boolean, message: string) {
    setToast({
      show: true,
      message: message,
      success: success,
    });
    setTimeout(
      () => setToast((prevToast) => ({ ...prevToast, show: false })),
      3000,
    );
  }

  function hideToast() {
    setToast((prev) => ({ ...prev, show: false }));
  }

  return (
    <main className="auth-main-container">
      <section className="logo-name-container">
        <Icons.AppLogo className="app-logo" />
        <h1>Trixie</h1>
      </section>
      {loginScreen ? (
        <SignInForm toggleForm={toggleForm} showToast={showToast} />
      ) : (
        <RegisterForm toggleForm={toggleForm} showToast={showToast} />
      )}
      <div className={toastClassName}>
        <Icons.Exit className="toast-exit-button" onClick={hideToast} />
        <p>{toast.message}</p>
      </div>
    </main>
  );
};

export default Auth;
