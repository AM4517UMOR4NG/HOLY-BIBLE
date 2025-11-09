// Interactive Registration Test
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Test Registrasi User\n');
console.log('Password Requirements:');
console.log('✅ Minimal 8 karakter');
console.log('✅ Harus ada huruf KAPITAL (A-Z)');
console.log('✅ Harus ada huruf kecil (a-z)');
console.log('✅ Harus ada angka (0-9)\n');

rl.question('Email: ', (email) => {
  rl.question('Password: ', (password) => {
    rl.question('Nama: ', async (name) => {
      rl.close();
      
      console.log('\n⏳ Mengirim request...\n');
      
      try {
        const response = await fetch('http://localhost:4000/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log('✅ REGISTRASI BERHASIL!\n');
          console.log('User ID:', data.user.id);
          console.log('Email:', data.user.email);
          console.log('Nama:', data.user.name);
          console.log('Role:', data.user.role);
        } else {
          console.log('❌ REGISTRASI GAGAL!\n');
          console.log('Status:', response.status);
          console.log('Message:', data.message);
          
          if (data.errors) {
            console.log('\nError Details:');
            data.errors.forEach(err => {
              console.log(`  - ${err.field}: ${err.message}`);
            });
          }
        }
      } catch (error) {
        console.log('❌ ERROR:', error.message);
        console.log('\n⚠️  Pastikan backend running di http://localhost:4000');
      }
    });
  });
});
