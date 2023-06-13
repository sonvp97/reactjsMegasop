import subprocess
import time

import schedule


def job():
    print("crawling")
    subprocess.call(["scrapy", "runspider", "spider.py"])


schedule.every(1).minutes.do(job)

while True:
    schedule.run_pending()
    print("working and waiting")
    time.sleep(5)
