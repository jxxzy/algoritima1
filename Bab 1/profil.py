"""Contoh program pertama: menyapa peserta dan menampilkan profil."""


def buat_profil(nama: str, prodi: str) -> tuple[str | None, str | None]:
    nama = nama.strip()
    prodi = prodi.strip()
    if not nama or not prodi:
        return None, "Nama dan program studi wajib diisi."
    return f"Halo, {nama}!\nProfil: {nama} | {prodi}", None


def main() -> None:
    pesan, kesalahan = buat_profil(
        input("Nama: "),
        input("Program studi: "),
    )
    if kesalahan:
        print(kesalahan)
        return
    print(pesan)


if __name__ == "__main__":
    main()
