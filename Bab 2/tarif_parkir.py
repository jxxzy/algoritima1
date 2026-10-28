"""Menghitung tarif latihan parkir dengan batas maksimum harian."""

TARIF_JAM_PERTAMA = 3_000
TARIF_PER_JAM_TAMBAHAN = 2_000
BATAS_HARIAN = 15_000


def hitung_tarif(jam: int) -> tuple[int, int, int]:
    if isinstance(jam, bool) or not isinstance(jam, int):
        raise TypeError("Durasi harus berupa jam bulat.")
    if jam < 1:
        raise ValueError("Durasi minimal satu jam.")

    jam_tambahan = jam - 1
    biaya_awal = TARIF_JAM_PERTAMA + jam_tambahan * TARIF_PER_JAM_TAMBAHAN
    biaya_akhir = min(biaya_awal, BATAS_HARIAN)
    return jam_tambahan, biaya_awal, biaya_akhir


def main() -> None:
    try:
        jam = int(input("Durasi parkir (jam bulat): "))
    except ValueError:
        print("Durasi harus berupa bilangan bulat.")
        return

    try:
        jam_tambahan, biaya_awal, biaya_akhir = hitung_tarif(jam)
    except ValueError as kesalahan:
        print(kesalahan)
        return

    print(f"Jam tambahan: {jam_tambahan}")
    print(f"Biaya awal: Rp{biaya_awal}")
    print(f"Tarif akhir (maksimal Rp{BATAS_HARIAN}): Rp{biaya_akhir}")


if __name__ == "__main__":
    main()
