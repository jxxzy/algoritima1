"""Contoh kartu praktikum dasar dengan nama, NIM, dan kelas wajib."""


def buat_kartu_praktikum(
    nama: str, nim: str, kelas: str
) -> tuple[str | None, list[str]]:
    data = {
        "Nama": nama.strip(),
        "NIM": nim.strip(),
        "Kelas": kelas.strip().upper(),
    }
    kesalahan = [
        f"{kolom} belum diisi."
        for kolom, nilai in data.items()
        if not nilai
    ]
    if kesalahan:
        return None, kesalahan
    kartu = "\n".join(
        (
            "KARTU PESERTA PRAKTIKUM",
            f"Nama : {data['Nama']}",
            f"NIM  : {data['NIM']}",
            f"Kelas: {data['Kelas']}",
        )
    )
    return kartu, []


def main() -> None:
    kartu, kesalahan = buat_kartu_praktikum(
        input("Nama lengkap: "),
        input("NIM: "),
        input("Kelas: "),
    )
    if kesalahan:
        print("Kartu belum dapat dibuat:")
        for pesan in kesalahan:
            print(f"- {pesan}")
        return
    print(kartu)


if __name__ == "__main__":
    main()
