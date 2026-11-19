def status_peminjaman(aktif, terlambat, jumlah):
    aktif = str(aktif).strip().lower()
    terlambat = str(terlambat).strip().lower()
    if aktif not in ("ya", "tidak") or terlambat not in ("ya", "tidak"):
        return "Jawaban tidak valid. Jawaban harus ya atau tidak.", ["Jawaban tidak valid"]
    if not isinstance(jumlah, int) or isinstance(jumlah, bool) or jumlah < 0:
        return "Jumlah buku tidak valid.", ["Jumlah buku tidak valid"]
    alasan = []
    if aktif != "ya":
        alasan.append("Keanggotaan tidak aktif")
    if terlambat == "ya":
        alasan.append("Selesaikan keterlambatan")
    if jumlah >= 3:
        alasan.append("Batas pinjaman tercapai")
    if alasan:
        return "Peminjaman ditolak", alasan
    return "Peminjaman diizinkan", []


def main():
    aktif = input("Anggota aktif (ya/tidak): ")
    terlambat = input("Ada keterlambatan (ya/tidak): ")
    try:
        jumlah = int(input("Buku sedang dipinjam: "))
    except ValueError:
        print("Jumlah buku tidak valid.")
        return
    pesan, alasan = status_peminjaman(aktif, terlambat, jumlah)
    print(pesan)
    for item in alasan:
        print(item)


if __name__ == "__main__":
    main()
