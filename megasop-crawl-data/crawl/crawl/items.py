import scrapy


class SaveToDB(scrapy.Item):
    name = scrapy.Field()
    price = scrapy.Field()
    total = scrapy.Field()
    quantity = scrapy.Field()
    brand_name = scrapy.Field()
