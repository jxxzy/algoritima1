def jalur_petualangan(tempat, aksi):
    tempat = str(tempat).strip().lower()
    aksi = str(aksi).strip().lower()
    if tempat == "perpustakaan":
        if aksi == "baca":
            return "Anda menemukan referensi algoritma."
        if aksi == "diskusi":
            return "Anda menyusun rencana bersama teman."
        return "Aksi perpustakaan tidak valid."
    if tempat == "laboratorium":
        if aksi == "kode":
            return "Anda membangun prototipe."
        if aksi == "uji":
            return "Anda menemukan sebuah bug."
        return "Aksi laboratorium tidak valid."
    return "Tujuan tidak valid."


def main():
    tempat = input("Tujuan (perpustakaan/laboratorium): ")
    aksi = input("Aksi (baca/diskusi atau kode/uji): ")
    print(jalur_petualangan(tempat, aksi))


if __name__ == "__main__":
    main()
