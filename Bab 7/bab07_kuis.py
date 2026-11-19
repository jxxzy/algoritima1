def skor_jawaban(jawaban, kunci):
    cocok = jawaban.strip().lower() == kunci.strip().lower()
    return 10 if cocok else 0


def tanya(soal, kunci):
    print(soal)
    jawaban = input("Jawaban: ")
    skor = skor_jawaban(jawaban, kunci)
    print("Benar" if skor == 10 else "Salah")
    return skor


def main():
    total = tanya("Hasil 2 + 3?", "5")
    total += tanya("Kata kunci fungsi Python?", "def")
    print(f"Total: {total}/20")


if __name__ == "__main__":
    main()
