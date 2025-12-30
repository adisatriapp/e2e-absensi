import { test } from '../../fixtures/roles';
import { qase } from 'playwright-qase-reporter';

test.describe('Karyawan Menu Tests', () => {
    test('Menampilkan Halaman Karyawan (Tabel)', async ({ admin }) => {
        qase.id(1057);

        await admin.openKaryawanMenu();
        await admin.assertKaryawanPageVisible();
    });

    test('Filter Karyawan Berdasarkan Departemen', async ({ admin }) => {
        qase.id(1067)

        await admin.openKaryawanMenu();
        await admin.filterDepartemen('Finance');
    })

    test('Mencari Karyawan Berdasarkan Nama', async ({ admin }) => {
        qase.id(1058)

        await admin.openKaryawanMenu();
        await admin.searchKaryawan('Adisatria');
    })

    test('Filter Karyawan Berdasarkan Status', async ({ admin }) => {
        qase.id(1068)
        await admin.openKaryawanMenu();
        await admin.filterStatus('Aktif')
    })

    test('Menambahkan Karyawan Baru dengan Data Valid', async ({ admin }) => {
        qase.id(1060)

        await admin.openKaryawanMenu();
        await admin.tambahKarayawanBaru({
            nama: 'tahu bulat',
            tempatLahir: 'Bandung',
            tanggalLahir: 'Kamis, 8 Januari',
            bulanLahir: 'Januari',
            tahunLahir: '2015',
            departement: 'Finance',
            division: 'Sales',
            posisi: 'Tukang Goreng',
            statusKaryawan: 'Tetap',
            tipe: 'Office',
            tanggalBergabung: 'Kamis, 4 Januari',
            bulangBergabung: 'Januari',
            tahunBergabung: '2024',
            fotoDiri: 'tests/data/mang_tahu.jpg',
            atasanLangsung: 'Adi Satria',

        })
    })

    test.skip('Pagination Halaman Karyawan', async ({ admin }) => {
        qase.id(1060)

    })

    test('Export Data Karyawan', async ({ admin }) => {
        qase.id(1060)
        await admin.openKaryawanMenu()
        await admin.clickExportKaryawan()
        await admin.assertExportKaryawan()
    })


    test('Import Data Karyawan', async ({ admin }) => {
        qase.id(1071)
        await admin.openKaryawanMenu()
        await admin.clickImportKaryawan()
        await admin.assertImportKaryawan()
    })

})