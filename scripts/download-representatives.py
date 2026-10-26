import json
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.parse import quote
from concurrent.futures import ThreadPoolExecutor
root=Path(__file__).resolve().parents[1]
people=[]
for name,role,district,doc in [('Sherry Hu','Mayor','Citywide',24608),('Jean Josey','Vice Mayor','At-large',19868),('Kashef Qaadri','Councilmember','At-large',32839),('Michael McCorriston','Councilmember','District 1',24607),('John Morada','Councilmember','District 3',38561)]:
 people.append(dict(cityId='dublin',name=name,role=role,district=district,profileUrl='https://www.dublin.ca.gov/71/Mayor-City-Council',photoSource=f'https://www.dublin.ca.gov/ImageRepository/Document?documentId={doc}'))
for name,role,district,file,slug in [('Mark Armstrong','Mayor','At-large','Armstrong_sq.jpg','mayor_mark_armstrong'),('Marisol Rubio','Vice Mayor','District 4','Rubio_4607_sq.jpg','vice_mayor_marisol_rubio'),('Robert Jweinat','Councilmember','District 1','Jweinat-2025.jpeg','councilmember_robert_jweinat'),('Richard Adler','Councilmember','District 2','Adler_4652_sq.jpg','councilmember_richard_adler'),('Sridhar Verose','Councilmember','District 3','Verose_4719_sq.jpg','councilmember_sridhar_verose')]:
 people.append(dict(cityId='san-ramon',name=name,role=role,district=district,profileUrl='https://www.sanramon.ca.gov/our_city/city_council/'+slug,photoSource='https://www.sanramon.ca.gov'+quote('/UserFiles/Servers/Server_10826046/Image/Our City/City Council/'+file)))
def download(p):
 with urlopen(Request(p['photoSource'],headers={'User-Agent':'Mozilla/5.0'}),timeout=30) as r:
  mime=r.headers.get_content_type();data=r.read()
 if mime not in ['image/jpeg','image/png','image/webp']:raise ValueError(mime)
 ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[mime]
 p['image']='/images/representatives/'+p['name'].lower().replace(' ','-')+'.'+ext
 (root/'public'/p['image'].lstrip('/')).write_bytes(data)
 p['verifiedAt']='2026-10-24'
 print(p['name'],len(data))
with ThreadPoolExecutor(max_workers=5) as pool:list(pool.map(download,people))
(root/'src/data/representatives.json').write_text(json.dumps(people,indent=2)+'\n')
