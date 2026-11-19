def akumulasi_skor(urut):
    total = 0
    jumlah = 0
    ditolak = 0
    for skor in urut:
        if skor == -1:
            break
        if not isinstance(skor, int) or isinstance(skor, bool) or not 0 <= skor <= 100:
            ditolak += 1
            continue
        total += skor
        jumlah += 1
    rata = total / jumlah if jumlah > 0 else None
    return jumlah, total, rata, ditolak


def main():
    total = 0
    jumlah = 0
    while True:
        try:
            skor = int(input("Skor 0-100 (-1 selesai): "))
        except ValueError:
            print("Skor ditolak")
            continue
        if skor == -1:
            break
        if not 0 <= skor <= 100:
            print("Skor ditolak")
            continue
        total += skor
        jumlah += 1
    print(f"Jumlah valid: {jumlah}; total: {total}")
    if jumlah > 0:
        print(f"Rata-rata: {total / jumlah:.2f}")
    else:
        print("Belum ada skor valid")


if __name__ == "__main__":
    main()
