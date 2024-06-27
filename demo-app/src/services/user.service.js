const addAddress = async (userId, newAddress) => {
  try {
    const res = await fetch(
      `http://localhost:8800/api/user/addAddress/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAddress),
      }
    );
    const data = await res.json();
    if (res.ok) {
      return { success: true, message: data.message, payload: data.user };
    } else {
      return { success: false, message: data.message };
    }
  } catch (e) {
    console.log(e);
  }
};

const removeAddress = async (userId, addressId) => {
  try {
    const res = await fetch(
      `http://localhost:8800/api/user/removeAddress/${userId}/${addressId}`,
      {
        method: "post",
      }
    );
    const data = await res.json();
    if (res.ok) {
      return { success: true, message: data.message, payload: data.user };
    } else {
      return { success: false, message: data.message };
    }
  } catch (e) {
    console.log(e);
  }
};

export default {
  addAddress,
  removeAddress,
};
