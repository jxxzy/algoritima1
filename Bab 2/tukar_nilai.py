"""Menukar dua nilai teks menggunakan variabel bantu."""


def tukar(a: str, b: str) -> tuple[str, str, str]:
    if not isinstance(a, str) or not isinstance(b, str):
        raise TypeError("Isi kedua wadah harus berupa teks.")
    sementara = a
    a = b
    b = sementara
    return a, b, sementara


def main() -> None:
    a = input("Isi wadah A: ")
    b = input("Isi wadah B: ")
    print(f"Sebelum: A={a}, B={b}")
    a, b, _ = tukar(a, b)
    print(f"Sesudah: A={a}, B={b}")


if __name__ == "__main__":
    main()
