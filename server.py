import datetime
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)
global popular_constellations
correct = [0,0,0,0]
userInput = []
popular_constellations = [
    {
        'id': 1,
        'name': 'Ursa Major',
        'season': 'Spring',
        'hemisphere': 'Northern',
        'number of stars': '19',
        'brightest star': 'Alioth',
        'characteristics': 'The Big Dipper is one of the most recognizable constellations in the sky. It is a circumpolar constellation, meaning it is visible year-round in the Northern Hemisphere. The Big Dipper is part of the Ursa Major constellation, which is the third largest constellation in the sky. The Big Dipper is made up of seven bright stars that form a shape that looks like a large ladle or dipper. The two stars that form the front of the ladle are called the Pointers because they point to the North Star, Polaris. The Big Dipper is also known as the Plough in the United Kingdom and Ireland.',
        'image': '/view/UrsaMajor.png',
        'imagel': '/learn/UrsaMajor.png',
        'imageq': '/quiz/UrsaMajor.png',
        'key':' Relation to Polaris & bear conslation',
        'namesake': 'The Big Dipper is named after its resemblance to a large ladle or dipper. The word "dipper" comes from the Old English word "dyppan," which means "to dip." The word "ladle" comes from the Old English word "hlædel," which means "a vessel for drawing out liquid." The Big Dipper is also known as the Plough in the United Kingdom and Ireland.',
        'points': [[606,430],[673,341],[465,366],[477,273],[402,199],[352,122],[215,95],[241,468],[90,324],[542,73],[823,53],[880,260],[823,458]],
        'answers': [[1,2],[0,3],[0,3],[1,2,4],[3,5],[4,6],[5],[],[],[],[],[],[]],
    },
    {
        'id': 2,
        'name': 'Ursa Minor (Little Dipper)',
        'season': 'Spring',
        'hemisphere': 'Northern',
        'number of stars': '7',
        'brightest star': 'Polaris',
        'characteristics': 'The Little Dipper is a circumpolar constellation, meaning it is visible year-round in the Northern Hemisphere. It is part of the Ursa Minor constellation, which is the 56th largest constellation in the sky. The Little Dipper is made up of seven bright stars that form a shape that looks like a small ladle or dipper. The two stars that form the front of the ladle are called the Guardians because they guard the North Star, Polaris. The Little Dipper is also known as the Little Bear in Latin.',
        'image': '/view/UrsaMinor.png',
        'imagel': '/learn/UrsaMinor.png',
        'imageq': '/quiz/UrsaMinor.png',
        'key':'Relation to Polaris & Little Bear',
        'namesake': 'The Little Dipper is named after its resemblance to a small ladle or dipper. The word "dipper" comes from the Old English word "dyppan," which means "to dip." The word "ladle" comes from the Old English word "hlædel," which means "a vessel for drawing out liquid." The Little Dipper is also known as the Little Bear in Latin.',
        'points': [[716,363],[658,268],[542,401],[528,306],[384,298],[255,194],[180,103],[241,468],[90,324],[542,73],[823,53],[880,260],[823,458]],
        'answers': [[1,2],[0,3],[0,3],[1,2,4],[3,5],[4,6],[5],[],[],[],[],[],[]],
    },
    {
        'id': 3,
        'name': 'Cygnus (Northern Cross)',
        'season': 'Summer',
        'hemisphere': 'Northern',
        'number of stars': '10',
        'brightest star': 'Deneb',
        'characteristics': 'Cygnus is a prominent constellation in the Northern Hemisphere. It is known for its distinctive shape, which resembles a cross or a swan in flight. Cygnus is also known as the Northern Cross because of its shape. The constellation is home to several bright stars, including Deneb, the brightest star in Cygnus. Cygnus is part of the Hercules family of constellations and is located near the Summer Triangle, a prominent asterism in the summer sky. Cygnus is best seen in the summer months in the Northern Hemisphere.',
        'image': '/view/Cygnus.png',
        'imagel': '/learn/Cygnus.png',
        'imageq': '/quiz/Cygnus.png',
        'namesake': 'Cygnus is named after the Latin word for swan. In Greek mythology, Cygnus is associated with several myths, including the story of Zeus and Leda. According to legend, Zeus transformed himself into a swan to seduce Leda, the queen of Sparta. The union between Zeus and Leda produced several children, including Helen of Troy and the twins Castor and Pollux. Cygnus is also associated with the story of Orpheus, a legendary musician who was transformed into a swan after his death.',
        'key':'Near symmetry +, and bird like wings',
        'points': [[295, 323],[422,282],[536,228],[617,205],[404,170],[351,142],[337,115],[482,374],[472,444],[241,468],[90,324],[542,73],[823,53],[880,260],[823,458]],
        'answers': [[1],[0,2,7,4],[1,3],[2],[1,5],[6,4],[5],[1,8],[7],[],[],[],[],[],[]],
    },
    {
        'id': 4,
        'name': 'Cassiopeia',
        'season': 'Fall',
        'hemisphere': 'Northern',
        'number of stars': '8',
        'brightest star': 'Schedar',
        'characteristics': 'Cassiopeia is a circumpolar constellation, meaning it is visible year-round in the Northern Hemisphere. It is named after the queen of Aethiopia in Greek mythology. Cassiopeia is known for its distinctive "W" shape, which is formed by five bright stars. The constellation is located near the North Star, Polaris, and is part of the Perseus family of constellations. Cassiopeia is one of the 48 constellations listed by the 2nd-century astronomer Ptolemy and remains one of the 88 modern constellations recognized by the International Astronomical Union.',
        'image': '/view/Cassiopeia.png',
        'imagel': '/learn/Cassiopeia.png',
        'imageq': '/quiz/Cassiopeia.png',
        'key':'Two Triangles or lying lady',
        'namesake': 'Cassiopeia is named after the queen of Aethiopia in Greek mythology. According to legend, Cassiopeia was the wife of King Cepheus and the mother of Princess Andromeda. She was known for her beauty and vanity, which ultimately led to her downfall. Cassiopeia was placed in the sky as a punishment for her arrogance, where she is forced to circle the North Star for eternity. The constellation is also known as the "Celestial W" because of its distinctive shape.',
        'points': [[294,360],[295,226],[402,236],[459,166],[590,174],[90,324],[100,74],[659,41],[823,52],[805,303],[486,349],[639,419],[823,458]],
        'answers': [[1],[0,2],[1,3],[2,4],[3],[],[],[],[],[],[],[],[]],
    },
]

@app.route('/')
def welcome():
    data_dict = {
        'page': 'welcome',
        'time': datetime.datetime.now()
    }
    userInput.append(data_dict)
    #print(userInput)
    return render_template('welcome.html')

# LEARN
@app.route('/learn/<int:id>')
def learn_item(id):
    item = next((item for item in popular_constellations if item['id'] == id), None)
    if item:
        data_dict = {
            'page': 'learn',
            'id': id,
            'time': datetime.datetime.now()
        }
        userInput.append(data_dict)
        return render_template('learn.html', item=item)
    else:
        return "Item not found", 404

@app.route('/quiz/<int:id>')
def quiz_item(id):
    item = next((item for item in popular_constellations if item['id'] == id), None)
    if item:
        data_dict = {
            'page': 'quiz',
            'id': id,
            'time': datetime.datetime.now()
        }
        userInput.append(data_dict)
        return render_template('quiz.html', item=item)
    else:
        return "Item not found", 404

@app.route('/submit-result', methods=['POST'])
def submit_result():
    json_data = request.get_json()  # Get JSON data sent from client
    if json_data is None:
        return jsonify({"status": "error", "message": "No data received"}), 400

    #print("Received result:", json_data)
    # Parsing the JSON data
    success_value = json_data['score']  # Convert boolean to int (True -> 1, False -> 0)
    name_key = int(json_data['id'])  # Assume 'name' key contains a list with at least one element
    connections = json_data['answer']
    correct[(name_key-1)] = success_value
    data_dict = {
        'page': 'submit-result',
        'id': name_key,
        'score': success_value,
        'input':connections,
        'time': datetime.datetime.now()
    }
    userInput.append(data_dict)
    return jsonify({
        "status": "success",
        "message": "Result processed successfully",
        "data": json_data
    }), 200

@app.route('/summary')
def summary():
    score = 0
    scoreBoard = []
    scores = []
    for constellation in popular_constellations:
        percentage = correct[(constellation['id']-1)]
        scores.append(int(percentage))
        scoreBoard.append((constellation['name'], str(correct[(constellation['id']-1)])+'%'))  # Add the name and score to the scoreboard
    if scores:
        score = sum(scores) / len(scores)
    else:
        score = 0
    data_dict = {
        'page': 'summary',
        'time': datetime.datetime.now()
    }
    userInput.append(data_dict)
    score = str(int(score))+'%'
    print(userInput)
    return render_template('summary.html', score=score, scoreBoard=scoreBoard)

@app.route('/hello')
def hello():
    data_dict = {
        'page': 'hello',
        'time': datetime.datetime.now()
    }
    userInput.append(data_dict)
    return render_template('welcome.html')

# VIEW
@app.route('/view/<int:id>')
def view_item(id):
    item = next((item for item in popular_constellations if item['id'] == id), None)
    if item:
        data_dict = {
            'page': 'view',
            'id': id,
            'time': datetime.datetime.now()
        }
        userInput.append(data_dict)
        return render_template('view.html', item=item)
    else:
        return "Item not found", 404


if __name__ == '__main__':
   app.run(debug = True)
