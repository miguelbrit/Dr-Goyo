import 'dotenv/config';

async function testLabUpdate() {
  const loginUrl = 'http://localhost:5001/api/users/login';
  const updateUrl = 'http://localhost:5001/api/users/update-profile';

  try {
    console.log("1. Logging in as Laboratory...");
    const loginRes = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'bio@labgoyo.com', password: 'lab123456' })
    });
    const loginData = await loginRes.json();
    if (!loginData.success) {
      console.error("Login failed:", loginData);
      return;
    }
    const token = loginData.token;
    console.log("Login success.");

    console.log("2. Attempting laboratory profile update...");
    const updateRes = await fetch(updateUrl, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: "Bio-Laboratorio Goyo Express",
        city: "Los Teques",
        businessName: "Goyo Express Labs",
        testTypes: "COVID-19, Hematología, Orina"
      })
    });
    
    const updateData = await updateRes.json();
    if (updateData.success) {
        console.log("Update Success!");
        console.log("New Name (Profile):", updateData.data.name);
        console.log("New businessName (Lab Table):", updateData.data.laboratory.businessName);
        console.log("New City (Lab Table):", updateData.data.laboratory.city);
        console.log("New Test Types:", updateData.data.laboratory.testTypes);
    } else {
        console.error("Update failed:", updateData);
    }

  } catch (error) {
    console.error("Error testing laboratory update:", error);
  }
}

testLabUpdate();
