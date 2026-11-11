"""Kalkulator belanja dan variasi aturan diskon Bab 4."""

from typing import NamedTuple


AMBANG_DISKON = 50_000
PERSEN_DISKON = 5
BIAYA_KEMASAN = 2_000
AMBANG_DISKON_CONTOH = 100_000
PERSEN_DISKON_CONTOH = 10
AMBANG_DISKON_ANGGOTA = 100_000
PERSEN_DISKON_ANGGOTA = 10


class RincianBelanja(NamedTuple):
    subtotal: int
    diskon: int
    setelah_diskon: int
    kemasan: int
    ongkir: int
    total: int


def _validasi_bilangan_bulat(nama: str, nilai: int, *, minimum: int) -> None:
    if isinstance(nilai, bool) or not isinstance(nilai, int):
        raise TypeError(f"{nama} harus berupa bilangan bulat.")
    if nilai < minimum:
        raise ValueError(f"{nama} minimal {minimum}.")


def hitung_belanja(harga: int, jumlah: int) -> RincianBelanja:
    """Diskon 5% mulai Rp50.000; kemasan Rp2.000 ditambahkan setelah diskon."""
    _validasi_bilangan_bulat("Harga", harga, minimum=1)
    _validasi_bilangan_bulat("Jumlah", jumlah, minimum=1)

    subtotal = harga * jumlah
    diskon = subtotal * PERSEN_DISKON // 100 if subtotal >= AMBANG_DISKON else 0
    setelah_diskon = subtotal - diskon
    total = setelah_diskon + BIAYA_KEMASAN
    return RincianBelanja(subtotal, diskon, setelah_diskon, BIAYA_KEMASAN, 0, total)


def hitung_belanja_contoh(harga: int, jumlah: int) -> RincianBelanja:
    """Contoh inti: diskon 10% mulai subtotal Rp100.000, tanpa biaya kemasan."""
    _validasi_bilangan_bulat("Harga", harga, minimum=1)
    _validasi_bilangan_bulat("Jumlah", jumlah, minimum=1)

    subtotal = harga * jumlah
    diskon = (
        subtotal * PERSEN_DISKON_CONTOH // 100
        if subtotal >= AMBANG_DISKON_CONTOH
        else 0
    )
    setelah_diskon = subtotal - diskon
    return RincianBelanja(subtotal, diskon, setelah_diskon, 0, 0, setelah_diskon)


def hitung_belanja_dengan_ongkir(
    harga: int,
    jumlah: int,
    ongkir: int,
    ambang_gratis_ongkir: int | None = None,
) -> RincianBelanja:
    """Tambahkan ongkir tetap; ambang gratis, bila ada, dinilai dari subtotal."""
    _validasi_bilangan_bulat("Ongkir", ongkir, minimum=0)
    if ambang_gratis_ongkir is not None:
        _validasi_bilangan_bulat("Ambang gratis ongkir", ambang_gratis_ongkir, minimum=1)

    rincian = hitung_belanja(harga, jumlah)
    ongkir_akhir = ongkir
    if ambang_gratis_ongkir is not None and rincian.subtotal >= ambang_gratis_ongkir:
        ongkir_akhir = 0
    total = rincian.total + ongkir_akhir
    return rincian._replace(ongkir=ongkir_akhir, total=total)


def hitung_belanja_anggota(harga: int, jumlah: int, anggota: bool) -> RincianBelanja:
    """Tantangan: diskon 10% hanya untuk anggota dengan subtotal minimal Rp100.000."""
    _validasi_bilangan_bulat("Harga", harga, minimum=1)
    _validasi_bilangan_bulat("Jumlah", jumlah, minimum=1)
    if not isinstance(anggota, bool):
        raise TypeError("Status anggota harus berupa bool.")

    subtotal = harga * jumlah
    layak = anggota and subtotal >= AMBANG_DISKON_ANGGOTA
    diskon = subtotal * PERSEN_DISKON_ANGGOTA // 100 if layak else 0
    setelah_diskon = subtotal - diskon
    total = setelah_diskon + BIAYA_KEMASAN
    return RincianBelanja(subtotal, diskon, setelah_diskon, BIAYA_KEMASAN, 0, total)


def hitung_diskon_bertingkat(subtotal: int) -> int:
    """Tantangan: pilih satu diskon, 10% atau 5%, tanpa menumpuk keduanya."""
    _validasi_bilangan_bulat("Subtotal", subtotal, minimum=0)
    if subtotal >= 100_000:
        persen = 10
    elif subtotal >= 50_000:
        persen = 5
    else:
        persen = 0
    return subtotal * persen // 100


def bandingkan_kebijakan_diskon(subtotal: int) -> tuple[int, int]:
    """Bandingkan diskon subtotal saja dengan diskon subtotal plus kemasan."""
    _validasi_bilangan_bulat("Subtotal", subtotal, minimum=0)
    dasar_subtotal = subtotal
    dasar_dengan_kemasan = subtotal + BIAYA_KEMASAN
    diskon_subtotal = (
        dasar_subtotal * PERSEN_DISKON // 100
        if dasar_subtotal >= AMBANG_DISKON
        else 0
    )
    diskon_dengan_kemasan = (
        dasar_dengan_kemasan * PERSEN_DISKON // 100
        if dasar_dengan_kemasan >= AMBANG_DISKON
        else 0
    )
    total_subtotal = dasar_subtotal - diskon_subtotal + BIAYA_KEMASAN
    total_dengan_kemasan = dasar_dengan_kemasan - diskon_dengan_kemasan
    return total_subtotal, total_dengan_kemasan


def main() -> None:
    try:
        harga = int(input("Harga satuan (Rp): "))
        jumlah = int(input("Jumlah barang: "))
        rincian = hitung_belanja(harga, jumlah)
    except ValueError as kesalahan:
        print(f"Input tidak valid: {kesalahan}")
        return

    print(f"Subtotal: Rp{rincian.subtotal}")
    print(f"Diskon: Rp{rincian.diskon}")
    print(f"Biaya kemasan: Rp{rincian.kemasan}")
    print(f"Total bayar: Rp{rincian.total}")


if __name__ == "__main__":
    main()
