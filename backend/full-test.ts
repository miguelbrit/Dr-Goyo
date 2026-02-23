
async function testCycle() {
  const email = "test@drgoyo.com";
  const password = "Password123!";
  
  // 1. Register
  console.log("Registering...");
  const regRes = await fetch('http://localhost:5000/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      name: "Test",
      surname: "User",
      type: "Paciente"
    })
  });
  console.log("Register status:", regRes.status);
  
  // 2. Login
  console.log("Logging in...");
  const loginRes = await fetch('http://localhost:5000/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const loginData = await loginRes.json();
  console.log("Login status:", loginRes.status);
  console.log("Login success:", loginData.success);
  if (!loginData.success) {
    console.log("Error message:", loginData.message);
  }
}

testCycle();
