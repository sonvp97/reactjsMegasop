import mysql.connector
from fastapi import FastAPI
app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]
# establish connection with the MySQL Server
cnx = mysql.connector.connect(user='root',
                              password='admin',
                              host='localhost',
                              database='scrapy')
@app.get("/products")
def get_all_products():
    cursor = cnx.cursor()
    cursor.execute("SELECT * FROM product")
    result = cursor.fetchall()
    cursor.close()
    cnx.close()
    return result