import model.vars as vars
import pymysql
import hashlib
import json
# import controller.secure as secure
import re
from controller.error import error
import smtplib
import random
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

class User:
    def __init__(self):
        """
            Used for working with user!
        """
        self.__connection = pymysql.connect(host=vars.host,
            user = vars.username,
            password = vars.password,
            db = vars.db,
            charset = "utf8mb4",
            cursorclass = pymysql.cursors.DictCursor
        )

    def __save_otp(self,username,otp):
        otp = hashlib.md5(str(otp).encode()).hexdigest()
        sql = f"SELECT `Code` FROM `otp` WHERE `Username`='{username}';"
        with self.__connection.cursor() as cursor:
            try:
                stmt = cursor.execute(sql)
                if stmt:
                    sql = f"UPDATE `otp` SET `Code`='{otp}' WHERE `Username`='{username}';"
                    stmt1 = cursor.execute(sql)
                    if stmt1:
                        self.__connection.commit()
                        cursor.close()
                        return 1
                    else:
                        return 0
                else:
                    sql = f"INSERT INTO `otp`(`Username`,`Code`) VALUES('{username}','{otp}');"
                    stmt = cursor.execute(sql)
                    if stmt:
                        self.__connection.commit()
                        cursor.close()
                        return 1
                    else:
                        return 0
            except pymysql.Error as e:
                print(e.args[1])
                return 0

    def __send_mail(self,username,email):
        """
            Sends mail to the passed email
        """
        try:
            s = smtplib.SMTP("smtp.gmail.com",587)
            s.starttls()
            s.login(vars.email["username"],vars.email["password"])
            otp = random.randint(111111,999999)
            message = MIMEMultipart()
            message["From"] = vars.email["username"]
            message["To"] = email
            message["Subject"] = "otp"
            body = MIMEText("otp :- "+str(otp))
            message.attach(body)
            if self.__save_otp(username,otp):
                s.sendmail(vars.email["username"],email,message.as_string())
                s.quit()
                return "1"
            else:
                return error(1065)
        except Exception as e:
            print(vars.email)
            print(e)
            return error(1067)


    def __fetch_email(self,username):
        """
            Get user email by their username
        """
        sql = f"SELECT `Email` from `users` WHERE `Username`='{username}';"
        with self.__connection.cursor() as cursor:
            try:
                stmt = cursor.execute(sql)
                if stmt:
                    c = cursor.fetchone()
                    cursor.close()
                    return c["Email"]
                else:
                    print(stmt)
                    return 0
            except pymysql.Error as e:
                print(e.args[1])
                print("ERROR",sql)
                return 0

    def forgot(self,username):
        email = self.__fetch_email(username)
        if email:
            return self.__send_mail(username,email)
        else:
            return error(1070)

    def __verify_otp(self, username,otp):
        otp = hashlib.md5(str(otp).encode()).hexdigest()
        sql = f"SELECT `Code` FROM `otp` WHERE `Username`='{username}';"
        with self.__connection.cursor() as cursor:
            try:
                stmt = cursor.execute(sql)
                if stmt:
                    c = cursor.fetchone()
                    cursor.close()
                    if c["Code"]==otp:
                        return 1
                    else:
                        return 0
                else:
                    return 0
            except:
                return 0

    def __del_otp(self,username):
        sql = f"DELETE FROM `otp` WHERE `Username`='{username}';"
        with self.__connection.cursor() as cursor:
            try:
                stmt = cursor.execute(sql)
                if stmt:
                    self.__connection.commit()
                    cursor.close()
                    return 1
                return 0
            except:
                return 0

    def __change_pass(self,username,new_pass):
        password = hashlib.md5(new_pass.encode()).hexdigest()
        sql = f"UPDATE `users` SET `Password`='{password}' WHERE `users`.`Username`='{username}';"
        with self.__connection.cursor() as cursor:
            try:
                stmt = cursor.execute(sql)
                k = self.__del_otp(username)
                if stmt and k:
                    self.__connection.commit()
                    cursor.close()
                    return "1"
                elif not stmt and k:
                    return "1"
                return error(1068)
            except pymysql.Error as e:
                print(e.args[1])
                return error(1068)

    def reset_pass(self,username,otp,new_pass):
        u = self.__verify_otp(username,otp)
        if u:
            return self.__change_pass(username,new_pass)
        return error(1069)

    def authenticate(self,username,password):
        """
            authenticates a user in the database
        """
        password = hashlib.md5(password.encode()).hexdigest()
        sql = f"SELECT * FROM `users` WHERE `Username`='{username}';"
        with self.__connection.cursor() as cursor:
            try:
                stmt = cursor.execute(sql)
                if stmt:
                    c = cursor.fetchone()
                    cursor.close()
                    print(c)
                    username = c["Username"]
                    email = c["Email"]
                    pwd = c["Password"]
                    data = {
                            "username": username,
                            "email": email
                    }
                    if pwd == password:
                        return json.dumps(data)
                    else:
                        return "0"
                else:
                    return "2"
            except pymysql.Error as e:
                print(e.args[1])
                return error(1071)


    def __validate_email(self,mail):
        """
            Validates the provided email addr
        """
        if re.match(r"[\w\W]*@+[\w\W]*[.]+[\w]{2,4}",mail):
            return True
        return False

    def store(self,username,email,password):
        """
            saves a user in the database
        """
        if len(password)<10:
            return error(1064)
        password = hashlib.md5(password.encode()).hexdigest()
        if not self.__validate_email(email):
            return error(1063)
        sql = f"INSERT INTO `users`(`Username`,`Email`,`Password`) VALUES ('{username}','{email}','{password}');"
        with self.__connection.cursor() as cursor:
            try:
                stmt = cursor.execute(sql)
                if stmt:
                    self.__connection.commit()
                    cursor.close()
                    return "1"
                return "0"
            except pymysql.Error as e:
                if e.args[0]==1062:
                    return error(1062)
                return error(1071)

        def __del__(self):
            self.__connection.close()