"""Konversi Celsius ke Fahrenheit dan Kelvin."""

from math import isfinite


CELSIUS_MINIMUM = -273.15


def konversi_suhu(celsius: float) -> tuple[float, float]:
    if isinstance(celsius, bool) or not isinstance(celsius, (int, float)):
        raise TypeError("Suhu Celsius harus berupa angka.")

    try:
        celsius = float(celsius)
    except OverflowError:
        raise ValueError("Suhu harus berupa angka terbatas.") from None

    if not isfinite(celsius):
        raise ValueError("Suhu harus berupa angka terbatas.")
    if celsius < CELSIUS_MINIMUM:
        raise ValueError("Suhu tidak boleh di bawah nol mutlak (-273.15 C).")

    fahrenheit = celsius * 9 / 5 + 32
    kelvin = celsius + 273.15
    if not isfinite(fahrenheit) or not isfinite(kelvin):
        raise ValueError("Hasil konversi berada di luar rentang angka.")
    return fahrenheit, kelvin


def main() -> None:
    try:
        celsius = float(input("Suhu Celsius: "))
    except ValueError:
        print("Input suhu harus berupa angka.")
        return

    try:
        fahrenheit, kelvin = konversi_suhu(celsius)
    except ValueError as kesalahan:
        print(kesalahan)
        return

    print(f"Fahrenheit: {fahrenheit:.2f} F")
    print(f"Kelvin: {kelvin:.2f} K")
    print("Tipe input setelah konversi:", type(celsius).__name__)


if __name__ == "__main__":
    main()
