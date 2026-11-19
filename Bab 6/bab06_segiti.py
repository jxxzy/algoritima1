def segitiga(n):
    if not isinstance(n, int) or isinstance(n, bool):
        raise TypeError("Tinggi harus integer")
    if not 1 <= n <= 6:
        raise ValueError("Tinggi harus 1 sampai 6")
    baris = []
    cetak = 0
    for indeks_baris in range(1, n + 1):
        angka = list(range(1, indeks_baris + 1))
        baris.append(" ".join(str(angka) for angka in angka))
        cetak += len(angka)
    return baris, cetak


def main():
    try:
        n = int(input("Tinggi segitiga (1-6): "))
        if not 1 <= n <= 6:
            print("Tinggi harus 1 sampai 6.")
            return
        baris, cetak = segitiga(n)
        for item in baris:
            print(item)
        print(f"Jumlah angka tercetak: {cetak}")
    except ValueError:
        print("Tinggi harus 1 sampai 6.")


if __name__ == "__main__":
    main()
