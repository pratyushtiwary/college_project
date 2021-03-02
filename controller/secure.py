from sjcl import SJCL
import json
import base64

salt = "95403pwoensff93w8euiasol"

def encode(string):
    """
        Encodes the passed string to base64 encoded string
    """
    encoded_str = string.encode("ascii")
    encoded_str = base64.b64encode(encoded_str)
    encoded_str = str(encoded_str,"utf8")
    encoded_str["salt"] = str(encoded_str["salt"],"utf8")
    encoded_str["ct"] = str(encoded_str["ct"],"utf8")
    encoded_str["iv"] = str(encoded_str["iv"],"utf8")
    return encoded_str

def decode(string):
    """
        Decodes a base64 encoded string
    """
    decoded_str = bytes(string,"utf8")
    decoded_str = base64.b64decode(decoded_str)
    decoded_str = str(decoded_str,"utf8")
    decoded_str = json.loads(decoded_str)
    decoded_str["salt"] = bytes(decoded_str["salt"],"utf8")
    decoded_str["ct"] = bytes(decoded_str["ct"],"utf8")
    decoded_str["iv"] = bytes(decoded_str["iv"],"utf8")
    return decoded_str

def encrypt(txt,salt=salt):
    """
        Encrypts a given string by provided salt(optional)
    """
    return encode(json.dumps(SJCL().encrypt(bytes(txt,"utf8"),salt)))

def decrypt(etxt,salt=salt):
    """
        Decrypts a given string by provided salt(optional)
    """
    etxt = decode(etxt)
    return SJCL().decrypt(etxt,salt)

def dec_e2e(etxt):
    """
        Used for decrypting the data sent from frontend
    """
    return decrypt(etxt,salt="738wishfna8ey")

def enc_e2e(txt):
    """
        Used for encrypting the data sent from frontend

        It is not used in this project but just so that dec_e2e() don't feel lonely i've added it :)
    """
    return encrypt(txt,salt="738wishfna8ey")