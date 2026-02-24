import 'dotenv/config';

async function reproduce() {
  const loginUrl = 'http://localhost:5001/api/users/login';
  const updateUrl = 'http://localhost:5001/api/users/update-profile';

  try {
    console.log("1. Logging in as Juan...");
    const loginRes = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'juan@gmail.com', password: '12345678' })
    });
    const loginData = await loginRes.json();
    if (!loginData.success) {
      console.error("Login failed:", loginData);
      return;
    }
    const token = loginData.token;
    console.log("Login success. Token obtained.");

    console.log("2. Attempting profile update...");
    const updateRes = await fetch(updateUrl, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: "Juan",
        surname: "Contreras Actualizado",
        city: "Caracas",
        birthDate: "1981-01-01"
      })
    });
    
    const updateData = await updateRes.json();
    console.log("Update response:", JSON.stringify(updateData, null, 2));

  } catch (error) {
    console.error("Reproduction error:", error);
  }
}

reproduce();
