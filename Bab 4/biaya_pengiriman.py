"""Perhitungan ongkir paket berdasarkan pembulatan berat ke atas."""


TARIF_PER_KG = 8_000
BIAYA_KEMASAN = 2_000
GRAM_PER_KG = 1_000


def hitung_biaya_pengiriman(berat_gram: int) -> tuple[int, int, int]:
    if isinstance(berat_gram, bool) or not isinstance(berat_gram, int):
        raise TypeError("Berat harus berupa bilangan bulat gram.")
    if berat_gram <= 0:
        raise ValueError("Berat harus lebih besar dari nol.")

    kilogram_tagihan = (berat_gram + GRAM_PER_KG - 1) // GRAM_PER_KG
    ongkir = kilogram_tagihan * TARIF_PER_KG
    total = ongkir + BIAYA_KEMASAN
    return kilogram_tagihan, ongkir, total


def main() -> None:
    try:
        berat_gram = int(input("Berat paket (gram): "))
        kilogram, ongkir, total = hitung_biaya_pengiriman(berat_gram)
    except ValueError as kesalahan:
        print(f"Input tidak valid: {kesalahan}")
        return

    print(f"Berat tertagih: {kilogram} kg")
    print(f"Ongkir: Rp{ongkir}")
    print(f"Biaya kemasan: Rp{BIAYA_KEMASAN}")
    print(f"Total bayar: Rp{total}")


if __name__ == "__main__":
    main()
