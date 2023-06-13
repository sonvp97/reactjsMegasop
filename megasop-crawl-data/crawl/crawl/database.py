from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+mysqldb://root:admin@localhost/scrapy"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class SLink(Base):
    __tablename__ = "s_link"

    id = Column(Integer, primary_key=True)
    link = Column(String)


def get_links_from_database():
    session = SessionLocal()
    links = session.query(SLink.link).all()
    session.close()
    return [link[0] for link in links]


