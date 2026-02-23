
async function testLogin() {
  const payload = {
    email: "test_patient_17718007992847@example.com", // The one that worked in previous test
    password: "Password123!"
  };

  console.log("Attempting login with:", payload.email);

  try {
    const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Response Status:", response.status);
    console.log("Response Data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

testLogin();
