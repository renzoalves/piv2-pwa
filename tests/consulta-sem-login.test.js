const { Builder, By, Key, until } = require('selenium-webdriver');

let descricoes = ['BATATA', 'ARROZ', 'FEIJÃO', 'ALFACE', 'AGUA', 'KAUT'];

module.exports = async function consultaSemLogin() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    console.log('Iniciando teste de limite de consulta sem login') 
    await driver.get('http://localhost:5173/');
    await driver.findElement(By.name('search-home')).sendKeys(descricoes[0], Key.RETURN);
    await driver.wait(until.titleIs('Portal iMendes - Consulta Gestor Tributário'), 2000);

    let hasLimitMessage = await checkForLimitMessage(driver);
    if (hasLimitMessage) {
      console.log('Limite de consultas atingido.');
      return;
    }

    await driver.wait(until.elementLocated(By.name('input-consulta')), 5000);
    
    for (let i = 1; i < descricoes.length; i++) {
      let descricao = descricoes[i];

      let inputConsulta = await driver.findElement(By.name('input-consulta'));
      await inputConsulta.clear();
      await inputConsulta.sendKeys(descricao, Key.RETURN);
    
      let hasLimitMessage = await checkForLimitMessage(driver);
      if (hasLimitMessage) {
        console.log('Limite de consultas atingido.');
        break;
      }

    }
    
    console.log('Teste concluído com sucesso!');
  } catch(error) {
    console.log('Ocorreu um erro durante o teste:', error);  
    await driver.quit();
  } finally {
    await driver.quit();
  }
};

async function checkForLimitMessage(driver) {
  let alertContainer = await driver.findElements(By.css('.alert-container'));

  if (alertContainer.length > 0) {
    // Agora que sabemos que o elemento está presente, podemos esperar por ele
    await driver.wait(until.elementIsVisible(alertContainer[0]), 5000);

    let alertMessage = await alertContainer[0].getText();
    return alertMessage.includes('Você ultrapassou o limite de consultas diárias sem Login.');
  } else {
    return false;
  }
}


