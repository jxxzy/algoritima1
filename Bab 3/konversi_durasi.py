"""Memecah durasi menit menjadi jam, menit sisa, dan detik."""


MENIT_PER_JAM = 60
DETIK_PER_MENIT = 60


def konversi_durasi(menit: int) -> tuple[int, int, int, int]:
    if isinstance(menit, bool) or not isinstance(menit, int):
        raise TypeError("Durasi harus berupa bilangan bulat menit.")
    if menit < 0:
        raise ValueError("Durasi tidak boleh negatif.")

    jam = menit // MENIT_PER_JAM
    sisa_menit = menit % MENIT_PER_JAM
    total_detik = menit * DETIK_PER_MENIT
    rekonstruksi_menit = jam * MENIT_PER_JAM + sisa_menit
    return jam, sisa_menit, total_detik, rekonstruksi_menit


def main() -> None:
    try:
        menit = int(input("Durasi (menit bulat): "))
    except ValueError:
        print("Durasi harus berupa bilangan bulat.")
        return

    try:
        jam, sisa_menit, total_detik, rekonstruksi = konversi_durasi(menit)
    except ValueError as kesalahan:
        print(kesalahan)
        return

    print(f"Durasi: {jam} jam {sisa_menit} menit")
    print(f"Total detik: {total_detik}")
    print(f"Rekonstruksi: {rekonstruksi} menit")


if __name__ == "__main__":
    main()
