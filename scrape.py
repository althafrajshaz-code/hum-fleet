import urllib.request
import urllib.parse
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

query = """
[out:json][timeout:25];
area["name"="Ernakulam"]->.searchArea;
(
  node["amenity"~"hospital|clinic|pharmacy|restaurant|cafe|college|school|bank"](area.searchArea);
  node["shop"~"supermarket|mall"](area.searchArea);
  node["public_transport"~"station"](area.searchArea);
);
out center 1500;
"""

url = "https://overpass-api.de/api/interpreter"
data = urllib.parse.urlencode({"data": query}).encode("utf-8")
req = urllib.request.Request(url, data=data)
req.add_header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")

print("Fetching data from OSM...")
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        if response.status == 200:
            data = json.loads(response.read().decode())
            elements = [e for e in data.get("elements", []) if "tags" in e and "name" in e["tags"] and "lat" in e and "lon" in e]
            print(f"Found {len(elements)} valid locations.")
            
            success_count = 0
            for e in elements:
                loc = {
                    "name": e["tags"]["name"] + (" (" + e["tags"]["amenity"] + ")" if "amenity" in e["tags"] else ""),
                    "lat": e["lat"],
                    "lng": e["lon"]
                }
                
                try:
                    post_req = urllib.request.Request("https://hum-fleet-api.onrender.com/api/locations", data=json.dumps(loc).encode("utf-8"), headers={"Content-Type": "application/json"})
                    with urllib.request.urlopen(post_req) as post_res:
                        if post_res.status == 200:
                            success_count += 1
                except Exception as ex:
                    pass
                    
            print(f"Successfully added {success_count} locations to the live database!")
        else:
            print(f"Failed: {response.status}")
except Exception as e:
    print(e)
