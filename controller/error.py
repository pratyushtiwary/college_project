import json
errors = {
    "1062": "Username already exists!",
    "1063": "Email is invalid!",
    "1064": "Password needs to be >= 10",
    "1065": "Some error occurred while sending the email!",
    "1067": "Unable to send email!",
    "1068": "Unable to change password, try again later!",
    "1069": "Invalid OTP!",
    "1070": "Username not found!",
    "1071": "Facing internal issues! Please try after sometime"
}

def error(error_code,e=""):
    """
        Returns a json encoded error string!
    """
    if str(error_code) in errors:
        return json.dumps({"error":{"code":error_code,"msg":errors[str(error_code)]}})
    else:
        return e