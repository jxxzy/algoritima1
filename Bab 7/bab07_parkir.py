def biaya_parkir(jam):
    """Hitung rupiah untuk jam bulat minimal satu."""
    if not isinstance(jam, int) or isinstance(jam, bool):
        raise TypeError("Jam harus integer")
    if jam < 1:
        raise ValueError("Jam minimal satu")
    return 3000 + (jam - 1) * 2000


def main():
    try:
        jam = int(input("Durasi (jam bulat): "))
    except ValueError:
        print("Durasi tidak valid")
        return
    if jam < 1:
        print("Durasi tidak valid")
        return
    biaya = biaya_parkir(jam)
    print(f"Biaya: Rp{biaya}")
    print(f"Biaya jika tambah 1 jam: Rp{biaya_parkir(jam + 1)}")


if __name__ == "__main__":
    main()
