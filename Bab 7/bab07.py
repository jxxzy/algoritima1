def hitung_diskon(subtotal):
    if not isinstance(subtotal, int) or isinstance(subtotal, bool):
        raise TypeError("Subtotal harus integer")
    if subtotal < 0:
        raise ValueError("Subtotal tidak boleh negatif")
    if subtotal >= 100000:
        return subtotal * 10 // 100
    return 0


def hitung_bayar(subtotal):
    return subtotal - hitung_diskon(subtotal)


def main():
    try:
        subtotal = int(input("Subtotal (Rp): "))
    except ValueError:
        print("Subtotal harus bilangan bulat.")
        return
    if subtotal < 0:
        print("Subtotal tidak boleh negatif.")
        return
    print(f"Diskon: Rp{hitung_diskon(subtotal)}")
    print(f"Bayar: Rp{hitung_bayar(subtotal)}")


if __name__ == "__main__":
    main()
