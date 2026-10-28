"""Pendaftaran kartu peserta kampus dengan validasi seluruh kolom."""

from collections.abc import Mapping


def buat_kartu(data: Mapping[str, str]) -> tuple[str | None, list[str]]:
    kolom = ("nama", "NIM", "kelas", "kota")
    label = {"nama": "Nama", "NIM": "NIM", "kelas": "Kelas", "kota": "Kota"}
    nilai = {kolom_nama: data.get(kolom_nama, "").strip() for kolom_nama in kolom}
    kesalahan = [
        f"{label[kolom_nama]} belum diisi."
        for kolom_nama in kolom
        if not nilai[kolom_nama]
    ]

    waktu = data.get("waktu", "").strip().lower()
    if waktu not in ("pagi", "sore"):
        kesalahan.append("Waktu sapaan harus 'pagi' atau 'sore'.")

    if kesalahan:
        return None, kesalahan

    nilai["kelas"] = nilai["kelas"].upper()
    sapaan = "Selamat pagi" if waktu == "pagi" else "Selamat sore"
    kartu = "\n".join(
        (
            f"{sapaan}, {nilai['nama']}!",
            "KARTU PESERTA KEGIATAN KAMPUS",
            f"Nama : {nilai['nama']}",
            f"NIM  : {nilai['NIM']}",
            f"Kelas: {nilai['kelas']}",
            f"Kota : {nilai['kota']}",
        )
    )
    return kartu, []


def main() -> None:
    data = {
        "nama": input("Nama lengkap: "),
        "NIM": input("NIM: "),
        "kelas": input("Kelas: "),
        "kota": input("Kota asal: "),
        "waktu": input("Sapaan (pagi/sore): "),
    }
    kartu, kesalahan = buat_kartu(data)
    if kesalahan:
        print("Kartu belum dapat dibuat:")
        for pesan in kesalahan:
            print(f"- {pesan}")
        return
    print(kartu)


if __name__ == "__main__":
    main()
