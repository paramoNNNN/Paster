import time
import keyboard
from pymongo import MongoClient
client = MongoClient()
db = client.paster


def paster():
    tab = db.tabs.find_one({"status": True})
    if tab is not None:
        for field in tab['fields']:
            if field['status'] == True:
                for idx in range(int(field['paste_count'])):
                    time.sleep(0.1)
                    keyboard.write(str(field['paste_text']))
                    print(field['paste_text'])
                    time.sleep(0.1)
                    keyboard.send('enter')

keyboard.add_hotkey('ctrl+shift+alt', paster)

while 1:
    time.sleep(0.2)
