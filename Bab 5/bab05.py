def skor_kuis(jawaban_pertama, jawaban_kedua):
    """Kembalikan skor 0-20 untuk kuis dua pilihan a/b."""
    pertama = jawaban_pertama.strip().lower()
    kedua = jawaban_kedua.strip().lower()
    skor = 0
    if pertama == "a":
        skor += 10
    elif pertama not in ("a", "b"):
        pass
    if kedua == "b":
        skor += 10
    elif kedua not in ("a", "b"):
        pass
    return skor


def predikat_nilai(nilai):
    if not isinstance(nilai, (int, float)) or isinstance(nilai, bool):
        raise TypeError("Nilai harus berupa angka")
    if not 0 <= nilai <= 100:
        raise ValueError("Nilai harus 0 sampai 100")
    if nilai >= 80:
        return "A"
    if nilai >= 70:
        return "B"
    if nilai >= 60:
        return "C"
    return "D"


def main():
    skor = 0
    jawab = input("1. Struktur LIFO adalah a) stack b) queue\nJawaban: ").strip().lower()
    if jawab == "a":
        skor += 10
        print("Benar")
    elif jawab == "b":
        print("Salah")
    else:
        print("Tidak valid, gunakan a atau b")
    jawab = input("2. Hasil 7 % 3 adalah a) 2 b) 1\nJawaban: ").strip().lower()
    if jawab == "b":
        skor += 10
        print("Benar")
    elif jawab == "a":
        print("Salah")
    else:
        print("Tidak valid, gunakan a atau b")
    print(f"Skor akhir: {skor}/20")


if __name__ == "__main__":
    main()
