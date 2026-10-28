"""Menghitung luas dan keliling persegi panjang dengan sisi positif."""

from math import isfinite


def hitung_geometri(panjang: float, lebar: float) -> tuple[float, float]:
    if (
        isinstance(panjang, bool)
        or isinstance(lebar, bool)
        or not isinstance(panjang, (int, float))
        or not isinstance(lebar, (int, float))
    ):
        raise TypeError("Panjang dan lebar harus berupa angka.")

    try:
        panjang = float(panjang)
        lebar = float(lebar)
    except OverflowError:
        raise ValueError("Panjang dan lebar harus berupa angka terbatas.") from None

    if not isfinite(panjang) or not isfinite(lebar):
        raise ValueError("Panjang dan lebar harus berupa angka terbatas.")
    if panjang <= 0 or lebar <= 0:
        raise ValueError("Sisi harus lebih besar dari nol.")

    luas = panjang * lebar
    keliling = 2 * (panjang + lebar)
    if not isfinite(luas) or not isfinite(keliling) or luas == 0:
        raise ValueError(
            "Hasil luas atau keliling berada di luar rentang float yang dapat "
            "direpresentasikan."
        )
    return luas, keliling


def hitung_geometri_dengan_panjang_cm(
    panjang_cm: float, lebar_m: float
) -> tuple[float, float]:
    if (
        isinstance(panjang_cm, bool)
        or not isinstance(panjang_cm, (int, float))
    ):
        raise TypeError("Panjang dalam sentimeter harus berupa angka.")

    try:
        panjang_m = float(panjang_cm) / 100
    except OverflowError:
        raise ValueError("Panjang dalam sentimeter harus terbatas.") from None

    return hitung_geometri(panjang_m, lebar_m)


def main() -> None:
    try:
        panjang = float(input("Panjang (m): "))
        lebar = float(input("Lebar (m): "))
    except ValueError:
        print("Panjang dan lebar harus berupa angka.")
        return

    try:
        luas, keliling = hitung_geometri(panjang, lebar)
    except ValueError as kesalahan:
        print(kesalahan)
        return

    print(f"Luas = {luas:.2f} m2")
    print(f"Keliling = {keliling:.2f} m")


if __name__ == "__main__":
    main()
