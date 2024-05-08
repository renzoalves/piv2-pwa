const loginTest = require('./login.test');
const consultaSemLoginTest = require('./consulta-sem-login.test');

async function runTests() {
    await consultaSemLoginTest();
    // await loginTest();
}

runTests().catch(error => {
  console.error('Erro ao executar testes:', error);
});
