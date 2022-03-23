const BASE_URL = `http://localhost:8000`;
const success = document.getElementById("success-message");
const error = document.getElementById("error-message");

async function onSubmit() {
  const formData = readFormData();
  await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }).then(async (results) => {
    const res = await results.json();
    if (results.status === 201) {
      success.hidden = false;
      success.innerText = "User Created Successfully!";
      setTimeout(() => {
        document.getElementById("name").value = "";
        document.getElementById("gender").value = "GENDER";
        document.getElementById("dateOfBirth").value = "";
        document.getElementById("aadharNumber").value = "";
        document.getElementById("password").value = "";
        success.hidden = true;
      }, 3000);
    } else {
      error.hidden = false;
      error.innerText = res.message;
      setTimeout(() => {
        error.hidden = true;
      }, 3000);
    }
  });
}

function onLogin() {
  const formData = {};
  formData["aadharNumber"] = document.getElementById("aadharNumber").value;
  formData["password"] = document.getElementById("password").value;
  fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      aadharNumber: formData.aadharNumber,
      password: formData.password,
    }),
  }).then(async (result) => {
    const res = await result.json();
    if (result.status != 200) {
      error.hidden = false;
      error.innerText = res.message;
      setTimeout(() => {
        error.hidden = true;
      }, 3000);
    } else {
      localStorage.setItem("Token", res.Token);
      window.location.assign(`${BASE_URL}/dashboard.html`);
    }
  });
}

function readFormData() {
  const formData = {};
  formData["name"] = document.getElementById("name").value;
  formData["gender"] = document.getElementById("gender").value;
  formData["dateOfBirth"] = document.getElementById("dateOfBirth").value;
  formData["aadharNumber"] = document.getElementById("aadharNumber").value;
  formData["password"] = document.getElementById("password").value;
  return formData;
}
