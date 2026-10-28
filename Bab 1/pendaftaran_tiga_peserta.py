"""Menerima tiga pendaftaran dengan satu alur yang diulang."""

from kartu_peserta import buat_kartu


def main() -> None:
    for nomor in range(1, 4):
        print(f"\nPeserta {nomor}")
        data = {
            "nama": input("Nama lengkap: "),
            "NIM": input("NIM: "),
            "kelas": input("Kelas: "),
            "kota": input("Kota asal: "),
            "waktu": input("Sapaan (pagi/sore): "),
        }
        kartu, kesalahan = buat_kartu(data)
        if kesalahan:
            print("Pendaftaran ditolak:")
            for pesan in kesalahan:
                print(f"- {pesan}")
            continue
        print(kartu)


if __name__ == "__main__":
    main()
