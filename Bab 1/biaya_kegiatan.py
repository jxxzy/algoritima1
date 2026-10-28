"""Menghitung rencana biaya kegiatan untuk jumlah peserta positif."""

BIAYA_TETAP = 50_000
KONSUMSI_PER_ORANG = 12_000


def hitung_biaya(peserta: int) -> tuple[int, int]:
    if isinstance(peserta, bool) or not isinstance(peserta, int):
        raise TypeError("Jumlah peserta harus berupa bilangan bulat.")
    if peserta <= 0:
        raise ValueError("Peserta harus lebih dari nol.")
    konsumsi = peserta * KONSUMSI_PER_ORANG
    total = BIAYA_TETAP + konsumsi
    return konsumsi, total


def main() -> None:
    try:
        peserta = int(input("Banyak peserta: "))
    except ValueError:
        print("Input peserta harus berupa bilangan bulat.")
        return

    try:
        konsumsi, total = hitung_biaya(peserta)
    except ValueError as kesalahan:
        print(kesalahan)
        return

    print(f"Peserta: {peserta}")
    print(f"Biaya tetap: Rp{BIAYA_TETAP}")
    print(f"Konsumsi: Rp{konsumsi}")
    print(f"Total rencana: Rp{total}")


if __name__ == "__main__":
    main()
