import 'dotenv/config';

async function testPharmacyUpdate() {
  const loginUrl = 'http://localhost:5001/api/users/login';
  const updateUrl = 'http://localhost:5001/api/users/update-profile';

  try {
    console.log("1. Logging in as Pharmacy...");
    const loginRes = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'contacto@farmaciagoyo.com', password: 'farmacia123456' })
    });
    const loginData = await loginRes.json();
    if (!loginData.success) {
      console.error("Login failed:", loginData);
      return;
    }
    const token = loginData.token;
    console.log("Login success.");

    console.log("2. Attempting pharmacy profile update...");
    const updateRes = await fetch(updateUrl, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: "Farmacia Goyo Salud Actualizada",
        city: "Miranda",
        address: "Nueva dirección av bolivar"
      })
    });
    
    const updateData = await updateRes.json();
    if (updateData.success) {
        console.log("Update Success!");
        console.log("New Name:", updateData.data.name);
        console.log("New City (Pharmacy Table):", updateData.data.pharmacy.city);
    } else {
        console.error("Update failed:", updateData);
    }

  } catch (error) {
    console.error("Error testing pharmacy update:", error);
  }
}

testPharmacyUpdate();
