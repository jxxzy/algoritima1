def game_tebak(tebakan_urut, rahasia=7, batas=3):
    """Telusuri urutan tebakan dan kembalikan jumlah percobaan serta status."""
    percobaan = 0
    for tebakan in tebakan_urut:
        if percobaan >= batas:
            break
        percobaan += 1
        if tebakan == rahasia:
            return percobaan, True
    return percobaan, False


def main():
    rahasia = 7
    batas = 3
    percobaan = 0
    menang = False
    while percobaan < batas:
        try:
            tebakan = int(input("Tebak angka 1-10: "))
        except EOFError:
            print("Input berakhir.")
            return
        except ValueError:
            print("Masukkan angka bulat 1-10.")
            continue
        if not 1 <= tebakan <= 10:
            print("Angka harus 1-10.")
            continue
        percobaan += 1
        if tebakan == rahasia:
            menang = True
            print("Benar!")
            break
        if tebakan < rahasia:
            print("Terlalu kecil")
        else:
            print("Terlalu besar")
    print(f"Percobaan: {percobaan}")
    if not menang:
        print(f"Kesempatan habis. Jawaban: {rahasia}")


if __name__ == "__main__":
    main()
