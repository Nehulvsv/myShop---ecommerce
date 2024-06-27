const loginService = {
  async login(dataToSend) {
    try {
      const res = await fetch("http://localhost:8800/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      //   if (res.ok) {
      const data = await res.json();
      if (res.ok) {
        return { success: true, payload: data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.log(error);
    }
  },
};

const registerService = {
  async register(dataToSend) {
    try {
      const res = await fetch("http://localhost:8800/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: "User registered successfully" };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error registering user:", error);
      return {
        success: false,
        message: "An error occurred while registering user",
      };
    }
  },
};

const ForgetPasswordService = {
  async ForgetPassword(formdata) {
    try {
      const res = await fetch("http://localhost:8800/api/auth/forget", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (e) {
      console.error("Error Forgetting User Password:", e);
    }
  },
};

export default { loginService, registerService, ForgetPasswordService };
