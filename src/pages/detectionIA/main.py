from flask import Flask, flash, request, redirect, url_for, render_template, jsonify
from werkzeug.utils import secure_filename
import os
import numpy as np
from PIL import Image

app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads/'

app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

# Load the car detection model (Replace this with your model loading code)
def load_car_detection_model():
    # Replace this with your code to load the car detection model
    # Example:
    # model = your_model_loading_function()
    return None

def detect_car(image, model):
    # Replace this with your car detection logic using the loaded model
    # Example:
    # detection_result = model.detect(image)
    # return detection_result
    return np.random.rand(224, 224)  # Mocking detection outputs

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_and_predict():
    if request.method == 'POST':
        try:
            if 'file' not in request.files:
                flash('No file part')
                return redirect(request.url)
            file = request.files['file']
            if file.filename == '':
                flash('No image selected for uploading')
                return redirect(request.url)
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                # Load the car detection model
                model = load_car_detection_model()
                if model is None:
                    flash('Error: Failed to load car detection model')
                    return redirect(request.url)
                # Perform car detection
                image = Image.open(file_path).convert('RGB')
                detection_result = detect_car(image, model)
                # Save the result as an image
                output_image = Image.fromarray(detection_result.astype(np.uint8))
                output_image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'detection_' + filename)
                output_image.save(output_image_path)
                flash('Image successfully uploaded and car detection performed')
                # Send the path of the detected image as response
                return jsonify({'image_path': output_image_path})
            else:
                flash('Allowed image types are - png, jpg, jpeg, gif')
                return redirect(request.url)
        except Exception as e:
            print(f"Error in upload_and_predict function: {e}")
            return jsonify({'error': 'Internal Server Error'}), 500
    else:
        return render_template('index.html')

@app.route('/display/<filename>')
def display_image(filename):
    return redirect(url_for('static', filename='uploads/' + filename), code=301)

if __name__ == "__main__":
    app.run()
