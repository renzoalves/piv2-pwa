const { Builder, By, Key, until } = require('selenium-webdriver');

module.exports = async function login() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.get('http://localhost:5173/login');
    await driver.findElement(By.name('email-login')).sendKeys('jullia.weber@imendes.com.br');
    await driver.findElement(By.name('senha-login')).sendKeys('852741', Key.RETURN);
    await driver.wait(until.titleIs('Portal iMendes - Home'), 5000);
    console.log('Login efetuado com sucesso!');
  } catch(error) {
    console.log('Ocorreu um erro durante o teste:', error);  
  } finally {
    await driver.quit();
  }
};
