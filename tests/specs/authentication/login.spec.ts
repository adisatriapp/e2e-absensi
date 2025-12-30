import { test } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { TEST_DATA } from '../../data/testData';
import { qase } from 'playwright-qase-reporter';

test.describe('Login Tests', () => {
  test('Login berhasil dengan kredensial valid', async ({ page }) => {
    qase.id(1051);
    const loginPage = new LoginPage(page);

    await loginPage.login({ email: TEST_DATA.emailLogin, password: TEST_DATA.passwordLogin });
    await loginPage.assertDashboardVisible();
  });

  test('Login dengan Remember Me aktif', async ({ page }) => {
    qase.id(1052);
    const loginPage = new LoginPage(page);

    await loginPage.loginRememberMe({ email: TEST_DATA.emailLogin, password: TEST_DATA.passwordLogin });
    await loginPage.assertDashboardVisible();
  });

  test('Login gagal dengan email tidak terdaftar', async ({ page }) => {
    qase.id(1053);
    const loginPage = new LoginPage(page);
    await loginPage.loginRememberMe({ email: TEST_DATA.emailLogin, password: TEST_DATA.passwordLogin });
    await loginPage.assertDashboardNotVisible()

  });

  test('Login dengan password kosong', async ({ page }) => {
    qase.id(1054);
    const loginPage = new LoginPage(page);
    await loginPage.login({ email: TEST_DATA.emailLogin, password: '' });
    await loginPage.assertDashboardNotVisible()

  });

});
