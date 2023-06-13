import urllib
import requests
from bs4 import BeautifulSoup
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from sqlalchemy import Column, Integer, String
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "mysql+mysqldb://root:admin@localhost/scrapy"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class SLink(Base):
    __tablename__ = "s_link"

    id = Column(Integer, primary_key=True, autoincrement=True)
    link = Column(String)
class PharmacityLink(Base):
    __tablename__ = "pharmacity_link"

    id = Column(Integer, primary_key=True, autoincrement=True)
    link = Column(String)


class SLinkList(BaseModel):
    s_links: list[str]


@app.post("/s_link")
async def save_s_links(s_links: SLinkList):
    session = SessionLocal()

    saved_links = []
    for s_link in s_links.s_links:
        new_s_link = SLink(link=s_link)

        session.add(new_s_link)
        session.commit()

        saved_links.append(new_s_link)
    session.close()

    return "successful"

class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    price = Column(Integer)
    total = Column(Integer)

@app.get("/hasaki")
def get_all_products():
    db = SessionLocal()
    products = db.query(Product).all()
    db.close()
    return products


@app.get("/{keyWord}")
async def get_data(keyWord: str):
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (HTML, like Gecko) Chrome/105.0.0.0 '
                      'Safari/537.36'
    })
    encode_string = urllib.parse.quote(keyWord)
    res = f"https://hasaki.vn/catalogsearch/result/?q={encode_string}"
    resp = session.get(res)
    if resp.status_code != 200:
        return {"error": f"bad status code {resp.status_code}"}

    soup = BeautifulSoup(resp.content, "html.parser")
    product_list = []
    product_elements = soup.find_all("div", class_="item_list_cate")
    id = 0
    for product_element in product_elements:
        product_info = {"name": product_element.find("div", class_="vn_names").text.strip()}
        product_info["id"] = id
        id += 1
        brand_element = product_element.find("div", class_="width_common txt_color_1 space_bottom_3")
        if brand_element:
            product_info["brand_name"] = brand_element.text.strip()
        else:
            product_info["brand_name"] = None

        price_element = product_element.find("strong", class_="item_giamoi")
        if price_element:
            product_info["price"] = price_element.text.strip().replace(" ", "").replace("₫", "").replace(".", "")
        else:
            product_info["price"] = None

        quantity_element = product_element.find("span", class_="item_count_by")
        if quantity_element:
            product_info["quantity"] = quantity_element.text.strip()
        else:
            product_info["quantity"] = None

        link_element = product_element.find("a", class_="block_info_item_sp width_common")
        if link_element:
            href = link_element.get('href')
            product_info["link"] = href
        else:
            product_info["link"] = None

        product_list.append(product_info)

    return product_list
@app.post("/linkPharmacity")
async def save_s_links(s_links: SLinkList):
    session = SessionLocal()

    saved_links = []
    for s_link in s_links.s_links:
        new_s_link = PharmacityLink(link=s_link)

        session.add(new_s_link)
        session.commit()

        saved_links.append(new_s_link)
    session.close()

    return "successful"

class Pharmacity(Base):
    __tablename__ = "pharmacity"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    price = Column(Integer)
    total = Column(Integer)

@app.get("/pharmacity")
def get_all_products():
    db = SessionLocal()
    products = db.query(Pharmacity).all()
    db.close()
    return products



