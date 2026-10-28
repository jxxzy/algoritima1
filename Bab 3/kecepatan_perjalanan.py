"""Menghitung kecepatan rata-rata dari kilometer dan menit."""

from math import isfinite


MENIT_PER_JAM = 60


def hitung_kecepatan(jarak_km: float, waktu_menit: float) -> tuple[float, float]:
    if (
        isinstance(jarak_km, bool)
        or isinstance(waktu_menit, bool)
        or not isinstance(jarak_km, (int, float))
        or not isinstance(waktu_menit, (int, float))
    ):
        raise TypeError("Jarak dan waktu harus berupa angka.")

    try:
        jarak_km = float(jarak_km)
        waktu_menit = float(waktu_menit)
    except OverflowError:
        raise ValueError("Jarak dan waktu harus berupa angka terbatas.") from None

    if not isfinite(jarak_km) or not isfinite(waktu_menit):
        raise ValueError("Jarak dan waktu harus berupa angka terbatas.")
    if jarak_km < 0:
        raise ValueError("Jarak tidak boleh negatif.")
    if waktu_menit <= 0:
        raise ValueError("Waktu harus lebih besar dari nol.")

    waktu_jam = waktu_menit / MENIT_PER_JAM
    if not isfinite(waktu_jam) or waktu_jam <= 0:
        raise ValueError("Waktu dalam jam berada di luar rentang angka.")

    kecepatan_km_per_jam = jarak_km / waktu_jam
    if not isfinite(kecepatan_km_per_jam):
        raise ValueError("Hasil kecepatan berada di luar rentang angka.")
    return waktu_jam, kecepatan_km_per_jam


def main() -> None:
    try:
        jarak_km = float(input("Jarak (km): "))
        waktu_menit = float(input("Waktu (menit): "))
    except ValueError:
        print("Jarak dan waktu harus berupa angka.")
        return

    try:
        waktu_jam, kecepatan = hitung_kecepatan(jarak_km, waktu_menit)
    except ValueError as kesalahan:
        print(kesalahan)
        return

    print(f"Waktu: {waktu_jam:.2f} jam")
    print(f"Kecepatan rata-rata: {kecepatan:.2f} km/jam")


if __name__ == "__main__":
    main()
