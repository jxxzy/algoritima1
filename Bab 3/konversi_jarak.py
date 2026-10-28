"""Mengubah jarak meter menjadi kilometer dan sisa meter."""


METER_PER_KILOMETER = 1_000


def konversi_jarak(jarak_meter: int) -> tuple[int, int]:
    if isinstance(jarak_meter, bool) or not isinstance(jarak_meter, int):
        raise TypeError("Jarak harus berupa bilangan bulat meter.")
    if jarak_meter < 0:
        raise ValueError("Jarak tidak boleh negatif.")

    kilometer = jarak_meter // METER_PER_KILOMETER
    sisa_meter = jarak_meter % METER_PER_KILOMETER
    return kilometer, sisa_meter


def main() -> None:
    try:
        jarak_meter = int(input("Jarak (meter bulat): "))
    except ValueError:
        print("Jarak harus berupa bilangan bulat.")
        return

    try:
        kilometer, sisa_meter = konversi_jarak(jarak_meter)
    except ValueError as kesalahan:
        print(kesalahan)
        return

    print(f"Jarak: {kilometer} km {sisa_meter} m")


if __name__ == "__main__":
    main()
