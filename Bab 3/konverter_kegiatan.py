"""Menyusun laporan durasi dan jarak tanpa mencampur identitas dan ukuran."""

from konversi_durasi import konversi_durasi
from konversi_jarak import konversi_jarak


def buat_laporan_kegiatan(nama: str, menit: int, jarak_meter: int) -> str:
    if not isinstance(nama, str):
        raise TypeError("Nama peserta harus berupa teks.")
    nama = nama.strip()
    if not nama:
        raise ValueError("Nama peserta wajib diisi.")

    jam, sisa_menit, total_detik, rekonstruksi = konversi_durasi(menit)
    kilometer, sisa_meter = konversi_jarak(jarak_meter)
    return "\n".join(
        (
            f"Peserta: {nama}",
            f"Durasi: {jam} jam {sisa_menit} menit",
            f"Total detik: {total_detik}",
            f"Rekonstruksi durasi: {rekonstruksi} menit",
            f"Jarak: {kilometer} km {sisa_meter} m",
        )
    )


def main() -> None:
    nama = input("Nama peserta: ")
    try:
        menit = int(input("Durasi (menit bulat): "))
        jarak_meter = int(input("Jarak (meter bulat): "))
    except ValueError:
        print("Durasi dan jarak harus berupa bilangan bulat.")
        return

    try:
        laporan = buat_laporan_kegiatan(nama, menit, jarak_meter)
    except ValueError as kesalahan:
        print(kesalahan)
        return

    print(laporan)


if __name__ == "__main__":
    main()
