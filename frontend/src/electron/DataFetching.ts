import { SubmitEvent } from "react";
import { URLSearchParams } from "url";

export async function signInUser(signInParams: SignInParams) {
  const signInData = new URLSearchParams(signInParams);
  try {
    const response = await fetch("http://localhost:8000/auth/signin", {
      method: "POST",
      body: signInData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return { success: true, data: userData };
    } else {
      const error = await response.json();
      return { success: false, data: error };
    }
  } catch (error) {
    console.log(JSON.stringify(error));
    return { success: false, data: error };
  }
}

export async function getCurrentAngles() {
  try {
    const response = await fetch("http://localhost:8000/gpio/servo-angle");
    if (response.ok) {
      const servoData = await response.json();
      return servoData;
    } else {
      const error = await response.json();
      console.log(JSON.stringify(error));
      return null;
    }
  } catch (error) {
    console.log(JSON.stringify(error));
    return null;
  }
}

export async function registerUser(registerCredentials: RegisterCredentials) {
  try {
    const response = await fetch("http://localhost:8000/auth/create", {
      method: "POST",
      body: JSON.stringify(registerCredentials),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return { success: true, data: userData };
    } else {
      const error = await response.json();
      console.log(JSON.stringify(error));
      return { success: false, data: error };
    }
  } catch (error) {
    console.log(JSON.stringify(error));
    return { success: false, data: error };
  }
}
