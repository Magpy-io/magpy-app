describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {});

  it('should test something', async () => {
    await element(by.id('emailEntry')).typeText('issam@gg.io');
    await element(by.id('passwordEntry')).typeText('12345aG!');
    await element(by.id('loginButton')).tap();

    const p = new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });

    await p;
  });
});
