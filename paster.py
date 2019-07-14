#!/usr/bin/env python3
import keyboard
import time
from pymongo import MongoClient
from bson import ObjectId
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.config['SECRECT_KEY'] = 's3cr3t!@#$'
client = MongoClient(host="localhost", port=27017)
db = client.paster

@app.route("/", methods=['GET', 'POST', 'DELETE'])
def index():
    print(request.method)
    if request.method == "GET":
        tabs = db.tabs
        print(tabs.find_one())

        return render_template('index.html', tabs=tabs)
    elif request.method == "POST":
        if request.form['action'] == "field_add":
            tab_id = request.form['tab_id']
            field_id = request.form['field_id']
            name = request.form['name']
            text = request.form['text']
            count = request.form['count']
            print(request.form['action'], tab_id, field_id, name, text, count)

            db.tabs.update({"_id": ObjectId(tab_id)},
                               {"$push": {
                                     "fields": {"Id": int(field_id), 'name': name, 'paste_text': text, 'paste_count': count, 'status': True}
                                     }
                               })
            return jsonify({"result": "ok"}), 200

        elif request.form['action'] == "field_update":
            tab_id = request.form['tab_id']
            field_id = request.form['field_id']
            name = request.form['name']
            text = request.form['text']
            count = request.form['count']
            print(request.form['action'], tab_id, field_id, name, text, count)

            db.tabs.update_one({"_id": ObjectId(tab_id), "fields.Id": int(field_id)},
                                   {"$set":
                                        {"fields.$.name": name, "fields.$.paste_text": text, "fields.$.paste_count": count, "fields.$.status": True}
                                    }
                                )
            return jsonify({"result": "ok"}), 200

        elif request.form['action'] == "field_remove":
            tab_id = request.form['tab_id']
            field_id = request.form['field_id']

            db.tabs.update_one({"_id": ObjectId(tab_id)}, {"$pull": {"fields": {'Id': int(field_id)}}})
            return jsonify({"result": "ok"}), 200

        elif request.form['action'] == "field_enable":
            tab_id = request.form['tab_id']
            field_id = request.form['field_id']
            db.tabs.update_one({"_id": ObjectId(tab_id), "fields.Id": int(field_id)},
                                   {"$set":
                                        {"fields.$.status": True}
                                    }
                                )
        elif request.form['action'] == "field_disable":
            tab_id = request.form['tab_id']
            field_id = request.form['field_id']
            db.tabs.update_one({"_id": ObjectId(tab_id), "fields.Id": int(field_id)},
                                   {"$set":
                                        {"fields.$.status": False}
                                    }
                                )

        elif request.form['action'] == "tab_add":
            tab_id = db.tabs.insert({"title": "new tab", "status": False, "fields": []})
            print(tab_id)
            return jsonify({"tab_id": str(tab_id)}), 200

        elif request.form['action'] == "tab_active":
            tab_id = request.form['tab_id']
            print(tab_id)
            db.tabs.update_many({}, {"$set": {"status": False}})
            db.tabs.update_one({"_id": ObjectId(tab_id)}, {"$set": {"status": True}})
            return jsonify({"result": "ok"}), 200


        return jsonify({"result": ">_< that hurts! report to 'taha'"}), 422



# def paster():
#     time.sleep(0.5)
#     tab = db.tabs.find_one({"status": True})
#     if tab is not None:
#         for field in tab['fields']:
#             if field['status'] == True:
#                 for idx in range(int(field['paste_count'])):
#                     keyboard.write(str(field['paste_text']))
#                     keyboard.send('enter')
#                     time.sleep(0.3)





if __name__ == '__main__':
    app.run(host="127.0.0.1", port=6567, debug=1)
