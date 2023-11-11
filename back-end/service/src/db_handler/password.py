from hashlib import sha256


class PasswordHandler:
    def __init__(self, encoding: str) -> None:
        self.encoding = encoding

    def hash_password(self, password: str) -> str:
        return sha256(password.encode(self.encoding)).hexdigest()
