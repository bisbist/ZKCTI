import pandas as pd
import joblib
import json
import subprocess
import os

SCALE = 1000
SHIFT = 10000
POSEIDON_INPUT_SIZE = 16

DATA_PATH = "data/ember_test.parquet"
MODEL_PATH = "model/model_tree.pkl"
INPUT_JSON_PATH = "zk/input.json"
POSEIDON_HASHER_JS = "zk/poseidonHasher.js"

def preprocess(val):
    return int((val + SHIFT) * SCALE)

def generate_prediction_and_proof(random_row=False):
    """
    Samples a test row, predicts, computes Poseidon hash, and prepares ZK input.
    If random_row is True, samples a random row from the dataset.
    Otherwise, uses the first row of the dataset.
    """
    # Sample data row
    df = pd.read_parquet(DATA_PATH)
    df = df[df["label"] != -1]
    # row = df.sample(1).iloc[0]
    row = df.sample(1).iloc[0] if random_row else df.iloc[0]
    label = int(row["label"])
    features = row.drop("label")
    processed_features = [preprocess(f) for f in features]
    poseidon_input = processed_features[:POSEIDON_INPUT_SIZE]

    # Poseidon hash via JS
    hash_str = subprocess.check_output(
        ["node", POSEIDON_HASHER_JS, json.dumps(poseidon_input)]
    ).decode().strip()

    # Prepare ZK input.json
    input_json = {
        "features": processed_features,
        "expected_output": label,
        "input_hash": str(hash_str)
    }
    with open(INPUT_JSON_PATH, "w") as f:
        json.dump(input_json, f, indent=2)

    # Model prediction
    model = joblib.load(MODEL_PATH)
    pred = int(model.predict([list(features)])[0])

    return {
        "sample_features": processed_features[:10],
        "prediction": pred,
        "expected_output": label,
        "poseidon_input": poseidon_input,
        "poseidon_hash": hash_str,
        "zk_input_path": INPUT_JSON_PATH
    }
