"""Mengubah jarak kilometer menjadi meter."""

from math import isfinite


METER_PER_KILOMETER = 1_000


def kilometer_ke_meter(jarak_kilometer: int | float) -> float:
    if isinstance(jarak_kilometer, bool) or not isinstance(jarak_kilometer, (int, float)):
        raise TypeError("Jarak harus berupa angka kilometer.")
    try:
        jarak_km = float(jarak_kilometer)
    except OverflowError as kesalahan:
        raise ValueError("Jarak kilometer harus berupa angka terbatas.") from kesalahan
    if not isfinite(jarak_km) or jarak_km < 0:
        raise ValueError("Jarak kilometer harus terbatas dan tidak negatif.")

    jarak_meter = jarak_km * METER_PER_KILOMETER
    if not isfinite(jarak_meter):
        raise ValueError("Hasil konversi di luar rentang angka.")
    return jarak_meter


def main() -> None:
    try:
        jarak_km = float(input("Jarak (kilometer): "))
    except ValueError:
        print("Jarak harus berupa angka kilometer.")
        return

    try:
        jarak_meter = kilometer_ke_meter(jarak_km)
    except ValueError as kesalahan:
        print(kesalahan)
        return

    print(f"Jarak: {jarak_meter:g} meter")


if __name__ == "__main__":
    main()
