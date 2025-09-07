import requests
from bs4 import BeautifulSoup
import psycopg2 as psycopg2
import uuid

# ---------------------------
# Database connection
# ---------------------------
conn = psycopg2.connect(
    host="ep-snowy-block-afsmbphj.c-2.us-west-2.aws.neon.tech",
    database="neondb",
    user="neondb_owner",
    password="npg_WIOEUwB6Hc4s",
    port=5432)
cur = conn.cursor()

# ---------------------------
# Scrape products
# ---------------------------
URL = "https://www.glanzbruch.ch/onlineshop/ohrringe/"
BASE_URL = "https://www.glanzbruch.ch"

res = requests.get(URL)
soup = BeautifulSoup(res.text, "html.parser")

products = soup.find_all("li", class_="product")

for p in products:
    # title
    title_tag = p.find("h2")
    name = title_tag.get_text(strip=True) if title_tag else "Unbekannt"

    # price
    price_tag = p.find("span", class_="woocommerce-Price-amount")
    price_text = price_tag.get_text(strip=True) if price_tag else "0"
    price = float(price_text.replace("CHF", "").replace(",", ".").strip())

    # product URL
    link_tag = p.find("a", href=True)
    product_url = link_tag["href"] if link_tag else None

    # images
    img_tag = p.find("img", src=True)
    img_url = img_tag["src"] if img_tag else None
    image_urls = [img_url] if img_url else []

    # description placeholder (can be extended to scrape detail page)
    description = "Produktbeschreibung wird nachgetragen"

    # category placeholder
    category = "Ohrringe"

    # SKU placeholder
    sku = None

    # Insert into DB
    cur.execute(
        """
        INSERT INTO products (
            id, name, description, price, category, image_urls, sku
        ) VALUES (%s, %s, %s, %s, %s, %s, %s)
    """,
        (
            str(uuid.uuid4()),  # random UUID
            name,
            description,
            price,
            category,
            image_urls,
            sku))

conn.commit()
cur.close()
conn.close()

print("✅ All products imported!")
