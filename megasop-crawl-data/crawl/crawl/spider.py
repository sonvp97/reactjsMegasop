import scrapy
from bs4 import BeautifulSoup

from database import get_links_from_database
from items import SaveToDB


class SaveToDB(scrapy.Item):
    name = scrapy.Field()
    price = scrapy.Field()
    total = scrapy.Field()


class LinkSpider(scrapy.Spider):
    name = 'link-spider'

    def start_requests(self):
        links = get_links_from_database()
        for link in links:
            yield scrapy.Request(url=link, callback=self.parse)

    def parse(self, response, **kwargs):
        html_content = response.body
        soup = BeautifulSoup(html_content, "html.parser")
        span_element_name = soup.find('span', class_='product__title', itemprop="name")
        product_name = span_element_name.text.strip()
        print(product_name)
        span_element_price = soup.find('span', class_='txt_price')
        product_price = span_element_price.text.strip().replace("₫", "").replace(".", "")

        txt_color_2_elements = soup.find_all('span', class_='txt_color_2')
        numbers = [element.text.strip() for element in txt_color_2_elements]

        positive_numbers = []
        for num in numbers:
            if num.isdigit():
                integer_num = int(num)
                if integer_num > 0:
                    positive_numbers.append(integer_num)
        total_store = sum(positive_numbers)

        item = SaveToDB()
        item['name'] = product_name
        item['price'] = product_price
        item['total'] = total_store
        yield item
