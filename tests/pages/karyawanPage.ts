import { TEST_DATA } from '../data/testData';
import { BasePage } from './basePage';
import { expect, test } from '@playwright/test';
import { KaryawanData } from '../types/karyawan';

export class KaryawanPage extends BasePage {

    async openKaryawanMenu() {
        await test.step('Navigate to karyawan page', async () => {
            await this.page.goto(TEST_DATA.baseUrl + '/employee');
            console.log(await this.page.url());
            await expect(this.page.getByRole('heading', { name: 'Karyawan' })).toBeVisible({ timeout: 30000 });

        })
    }

    async assertKaryawanPageVisible() {
        await test.step('Karyawan page is visible', async () => {
            await expect(
                this.page.getByRole('heading', { name: 'Karyawan' })
            ).toBeVisible({ timeout: 20000 });

            await expect(this.page.getByRole('button', { name: 'Import Karyawan' })).toBeVisible();
            await expect(this.page.getByRole('button', { name: 'Export Karyawan' })).toBeVisible();
            await expect(this.page.getByRole('button', { name: 'Tambah Karyawan' })).toBeVisible();
            await expect(this.page.getByRole('textbox', { name: 'Cari karyawan' })).toBeVisible();
            await expect(this.page.getByText('Pilih departemen')).toBeVisible();
            await expect(this.page.getByText('Pilih status')).toBeVisible();
        })

    }

    async searchKaryawan(namaKaryawan: string) {
        await test.step(`Search karyawan with name ${namaKaryawan}`, async () => {
            await this.page.getByRole('textbox', { name: 'Cari karyawan' }).click();
            await this.page.getByRole('textbox', { name: 'Cari karyawan' }).fill(namaKaryawan);
            await this.page.getByRole('textbox', { name: 'Cari karyawan' }).press('Enter');
        })
    }

    async filterDepartemen(departemen: string) {
        await test.step(`Filter karyawan by departemen ${departemen}`, async () => {
            await this.page.getByText('Pilih departemen').click();
            await this.page.getByPlaceholder('Pilih departemen').click();
            await this.page.getByPlaceholder('Pilih departemen').fill(departemen);
            await this.page.getByPlaceholder('Pilih departemen').press('Enter');
            await this.page.getByPlaceholder('Pilih departemen').press('Escape');

        })
    }

    async filterStatus(status: string) {
        await test.step(`Filter karyawan by status ${status}`, async () => {
            await this.page.getByText('Pilih status').click();
            await this.page.getByPlaceholder('Pilih status').click();
            await this.page.getByPlaceholder('Pilih status').fill(status);
            await this.page.getByPlaceholder('Pilih status').press('Enter');
            await this.page.getByPlaceholder('Pilih status').press('Escape');
        })
    }

    async selectBirthMonth(monthName: string) {
        const months = [
            'januari',
            'februari',
            'maret',
            'april',
            'mei',
            'juni',
            'juli',
            'agustus',
            'september',
            'oktober',
            'november',
            'desember',
        ];

        const index = months.indexOf(monthName.toLowerCase());

        if (index === -1) {
            throw new Error(`Nama bulan tidak valid: ${monthName}`);
        }

        await this.page
            .getByLabel('Choose the Month')
            .selectOption(index.toString());
    }

    async tambahKarayawanBaru(data: KaryawanData) {
        await test.step('Buka form tambah karyawan baru', async () => {
            await this.page.getByRole('button', { name: 'Tambah Karyawan' }).click();
            await expect(this.page.getByText('Isi formulir di bawah untuk menambahkan karyawan baru')).toBeVisible({ timeout: 10000 });
        })

        await test.step('Mengisi nama karyawan', async () => {
            await this.page.getByRole('textbox', { name: 'Nama' }).click();
            await this.page.getByRole('textbox', { name: 'Nama' }).fill(data.nama);
        })

        await test.step('Mengisi tempat lahir', async () => {
            await this.page.getByRole('textbox', { name: 'Tempat Lahir' }).click();
            await this.page.getByRole('textbox', { name: 'Tempat Lahir' }).fill(data.tempatLahir);
        })

        await test.step('Memilih tanggal lahir', async () => {
            await this.page.getByRole('button', { name: 'Tanggal Lahir' }).click();
            await this.selectBirthMonth(data.bulanLahir);
            await this.page.getByLabel('Choose the Year').selectOption(data.tahunLahir);
            await this.page.getByRole('button', { name: `${data.tanggalLahir}` }).click();
        })

        await test.step('Memilih departemen', async () => {
            await this.page.getByRole('combobox', { name: 'Departemen' }).click();
            await this.page.getByRole('option', { name: data.departement }).click();
        })

        await test.step('Memilih divisi', async () => {
            await this.page.getByRole('combobox', { name: 'Division' }).click();
            await this.page.getByRole('option', { name: data.division }).click();
        })

        await test.step('Mengisi posisi karyawan', async () => {
            await this.page.getByRole('textbox', { name: 'Posisi' }).click();
            await this.page.getByRole('textbox', { name: 'Posisi' }).fill(data.posisi);
        })

        await test.step('Memilih status karyawan', async () => {
            await this.page.getByRole('combobox', { name: 'Status' }).click();
            await this.page.getByRole('option', { name: data.statusKaryawan }).click();
        })

        await test.step('Memilih tipe karyawan (Office/Non-Office)', async () => {
            if (data.tipe === 'Office') {
                await this.page.getByRole('radio', { name: 'Office', exact: true }).click();
            } else {
                await this.page.getByRole('radio', { name: 'Non-Office' }).click();
            }
        })

        await test.step('Memilih tanggal bergabung', async () => {
            await this.page.getByRole('button', { name: 'Tanggal Bergabung' }).click();
            await this.selectBirthMonth(data.bulangBergabung);
            await this.page.getByLabel('Choose the Year').selectOption(data.tahunBergabung);
            await this.page.getByRole('button', { name: data.tanggalBergabung }).click();
            await this.page.getByRole('button', { name: data.tanggalBergabung }).press('Enter');
        })

        await test.step('Mengunggah foto diri', async () => {
            const [fileChooser] = await Promise.all([
                this.page.waitForEvent('filechooser'),
                this.page.click('button:has-text("Pilih Foto")'),
            ]);

            await fileChooser.setFiles(data.fotoDiri);
        })

        await test.step('Memilih atasan langsung', async () => {
            await this.page.locator('div').filter({ hasText: /^Pilih atasan langsung$/ }).click();

        })

        await test.step('Klik simpan', async () => {
            await this.page.getByRole('button', { name: 'Simpan' }).click();

        })
    }

    async clickExportKaryawan() {
        await this.page.getByRole('button', { name: 'Export Karyawan' }).click();

    }
    async assertExportKaryawan() {
        await expect(this.page.getByText('Excel (.xlsx)', { exact: true })).toBeVisible();
        await expect(this.page.getByText('CSV (.csv)', { exact: true })).toBeVisible();
        await expect(this.page.getByText('Pilih format dan kolom yang')).toBeVisible();
        await expect(this.page.getByText('Kolom yang Diekspor')).toBeVisible();
        await expect(this.page.getByText('Informasi Export')).toBeVisible();
        await expect(this.page.getByText('Format Excel (.xlsx)')).toBeVisible();
        await expect(this.page.getByText('Format CSV (.csv) cocok untuk')).toBeVisible();
        await expect(this.page.getByText('Hanya kolom yang dipilih yang')).toBeVisible();
        await expect(this.page.getByText('File akan diunduh otomatis')).toBeVisible();
        await expect(this.page.getByLabel('Export Karyawan').getByText('Nama')).toBeVisible();
        await expect(this.page.getByText('NamaDepartemenDivisionPosisiStatusTipeTempat LahirTanggal LahirTanggal')).toBeVisible();
        await expect(this.page.getByText('Division')).toBeVisible();
        await expect(this.page.getByLabel('Export Karyawan').getByText('Status')).toBeVisible();
        await expect(this.page.getByText('Tempat Lahir')).toBeVisible();
        await expect(this.page.getByText('Tanggal Bergabung')).toBeVisible();
        await expect(this.page.getByLabel('Export Karyawan').getByText('Departemen')).toBeVisible();
        await expect(this.page.getByLabel('Export Karyawan').getByText('Posisi')).toBeVisible();
        await expect(this.page.getByLabel('Export Karyawan').getByText('Tipe')).toBeVisible();
        await expect(this.page.getByText('Tanggal Lahir')).toBeVisible();
        await expect(this.page.getByText('Atasan Langsung')).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Batal' })).toBeVisible();
    }

    async clickImportKaryawan() {
        await this.page.getByRole('button', { name: 'Import Karyawan' }).click();
    }

    async assertImportKaryawan() {
        await expect(this.page.getByText('Upload file Excel (.xlsx)')).toBeVisible();
        await expect(this.page.getByText('Drag & drop file Excel di sini')).toBeVisible();
        await expect(this.page.getByText('Format File Excel')).toBeVisible();
        await expect(this.page.getByText('File harus berformat .xlsx')).toBeVisible();
        await expect(this.page.getByText('Ukuran maksimal file adalah')).toBeVisible();
        await expect(this.page.getByText('Pastikan kolom sesuai dengan')).toBeVisible();
        await expect(this.page.getByText('Baris pertama harus berisi')).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Unduh Template Excel' })).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Batal' })).toBeVisible();
    }
}
