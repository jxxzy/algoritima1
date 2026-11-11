"""Perhitungan nilai akhir berbobot untuk tugas, UTS, dan UAS."""

from math import isfinite
from typing import NamedTuple


BOBOT_TUGAS = 0.30
BOBOT_UTS = 0.30
BOBOT_UAS = 0.40


class RincianNilai(NamedTuple):
    komponen_tugas: float
    komponen_uts: float
    komponen_uas: float
    nilai_akhir: float


def _validasi_nilai(tugas: float, uts: float, uas: float) -> None:
    nilai = (tugas, uts, uas)
    if any(isinstance(item, bool) or not isinstance(item, (int, float)) for item in nilai):
        raise TypeError("Semua nilai harus berupa angka.")
    if any(not 0 <= item <= 100 for item in nilai):
        raise ValueError("Seluruh nilai harus berada pada rentang 0 sampai 100.")
    if any(isinstance(item, float) and not isfinite(item) for item in nilai):
        raise ValueError("Seluruh nilai harus berada pada rentang 0 sampai 100.")


def hitung_nilai_akhir(tugas: float, uts: float, uas: float) -> RincianNilai:
    _validasi_nilai(tugas, uts, uas)
    komponen_tugas = tugas * BOBOT_TUGAS
    komponen_uts = uts * BOBOT_UTS
    komponen_uas = uas * BOBOT_UAS
    nilai_akhir = komponen_tugas + komponen_uts + komponen_uas
    return RincianNilai(komponen_tugas, komponen_uts, komponen_uas, nilai_akhir)


def hitung_nilai_akhir_pengembangan(tugas: float, uts: float, uas: float) -> RincianNilai:
    """Varian pembanding 25% tugas, 25% UTS, dan 50% UAS."""
    _validasi_nilai(tugas, uts, uas)
    komponen_tugas = tugas * 0.25
    komponen_uts = uts * 0.25
    komponen_uas = uas * 0.50
    nilai_akhir = komponen_tugas + komponen_uts + komponen_uas
    return RincianNilai(komponen_tugas, komponen_uts, komponen_uas, nilai_akhir)


def main() -> None:
    try:
        tugas = float(input("Nilai tugas (0-100): "))
        uts = float(input("Nilai UTS (0-100): "))
        uas = float(input("Nilai UAS (0-100): "))
        rincian = hitung_nilai_akhir(tugas, uts, uas)
    except ValueError as kesalahan:
        print(f"Input tidak valid: {kesalahan}")
        return

    print(
        "Komponen: "
        f"{rincian.komponen_tugas:.2f}, "
        f"{rincian.komponen_uts:.2f}, "
        f"{rincian.komponen_uas:.2f}"
    )
    print(f"Nilai akhir: {rincian.nilai_akhir:.2f}")


if __name__ == "__main__":
    main()
