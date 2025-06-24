import os
import json
import shap
import random
import subprocess
import numpy as np
import pandas as pd
import tensorflow as tf
from pathlib import Path
from sklearn.preprocessing import StandardScaler

BASE_DIR = Path(__file__).resolve().parent.parent
ZK_DIR = BASE_DIR / "zk"


def cleanup_zk_files():
    """
    Removes all generated ZK/EZKL files from previous runs.
    """
    files_to_remove = [
        ZK_DIR / "ezkl" / "network.ezkl",
        ZK_DIR / "ezkl" / "settings.json",
        ZK_DIR / "ezkl" / "pk.key",
        ZK_DIR / "ezkl" / "vk.key",
        ZK_DIR / "ezkl" / "proof.key",
        ZK_DIR / "ezkl" / "proof.json",
        ZK_DIR / "ezkl" / "witness.json",
    ]
    for path in files_to_remove:
        try:
            path = Path(path)
            if path.exists():
                path.unlink()
                print(f"🧹 Deleted {path}")
            else:
                print(f"⚠️ File not found (skipping): {path}")
        except Exception as e:
            print(f"❌ Failed to delete {path}: {e}")


def sample_row(top_n=32):
    """
    Samples a random row from the ember_test.parquet dataset,
    returns the features, prediction, and SHAP XAI explanation for this sample.
    """
    BASE_DIR = Path(__file__).resolve().parent.parent
    ZK_DIR = BASE_DIR / "zk"
    TEST_DATA_PATH = BASE_DIR / "data/ember_test.parquet"
    TRAIN_DATA_PATH = BASE_DIR / "data/ember_train.parquet"

    print("Loading data...")
    train_df = pd.read_parquet(TRAIN_DATA_PATH)
    test_df = pd.read_parquet(TEST_DATA_PATH)

    # Drop rows with label -1
    train_df = train_df[train_df["label"] != -1]
    test_df = test_df[test_df["label"] != -1]

    y_train = train_df.pop("label").values
    X_train = train_df.values
    y_test = test_df.pop("label").values
    X_test = test_df.values

    # Standardize
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # Get feature names for XAI
    feature_names = list(train_df.columns)

    # Pick a random test sample
    idx = random.randrange(X_test.shape[0])
    sample_input = X_test[idx : idx + 1]  # shape (1, n_features)
    orig_row = test_df.iloc[idx]  # for raw values if needed

    # Load model
    MODEL_PATH = BASE_DIR / "model/model_nn.keras"
    model = tf.keras.models.load_model(MODEL_PATH)

    # Predict
    prediction = int(model.predict(sample_input)[0][0] > 0.5)

    # XAI: SHAP values for this sample (uses DeepExplainer for keras)
    try:
        explainer = shap.DeepExplainer(
            model, X_train[:100]
        )  # use a small background for speed
        shap_values = explainer.shap_values(sample_input)
        if isinstance(shap_values, list):
            # For binary models, shap_values is a list of arrays
            shap_values = shap_values[0]
        shap_vals = shap_values[0]  # for the single sample
    except Exception as e:
        print(f"SHAP computation failed: {e}")
        shap_vals = np.zeros(sample_input.shape[1])

    # Prepare XAI output: feature, value, shap
    feature_imp = []
    for i, name in enumerate(feature_names):
        feature_imp.append(
            {
                "feature": name,
                "value": float(sample_input[0][i]),
                "shap": float(shap_vals[i]),
            }
        )

    # Sort by absolute SHAP value (importance)
    feature_imp = sorted(feature_imp, key=lambda x: abs(x["shap"]), reverse=True)[
        :top_n
    ]

    sample_data = {
        "features": sample_input[0].tolist(),
        "expected_output": prediction,
        "xai": feature_imp,
    }

    # # Save for logging/app
    # with open(BASE_DIR / "input.json", "w") as f:
    #     json.dump(sample_data, f, indent=2)

    # Prepare EZKL-compatible input
    ezkl_input = {"input_data": [sample_data["features"]]}
    (ZK_DIR / "build").mkdir(parents=True, exist_ok=True)
    with open(ZK_DIR / "build/input.json", "w") as f:
        json.dump(ezkl_input, f, indent=2)

    print(f"✅ EZKL input saved to '{ZK_DIR / 'build' / 'input.json'}'")
    return sample_data


def predict_with_model(features):
    """
    Given a list of features, predicts the label using the pre-trained model.
    Returns the predicted label.
    """
    import joblib

    if features is None:
        raise ValueError(
            "❌ 'features' cannot be None. Make sure the input data is provided."
        )

    MODEL_PATH = BASE_DIR / "model/model_nn.keras"
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded successfully from", MODEL_PATH)

    # Flatten if nested list
    if isinstance(features[0], list):
        features = features[0]

    expected_num_features = 2381  # or get this from model.input_shape[-1]
    if len(features) != expected_num_features:
        raise ValueError(
            f"❌ Expected {expected_num_features} features, but got {len(features)}."
        )

    input_array = np.array(features, dtype=np.float32).reshape(1, -1)
    print("Input shape to model:", input_array.shape)

    y_pred = (model.predict(input_array) > 0.5).astype(int)
    prediction = int(y_pred[0][0])
    print("Prediction result:", prediction)
    return prediction


def generate_proof_ezkl():
    """
    Runs the EZKL pipeline conditionally based on whether model, circuit, settings, SRS, and keys already exist.
    Cleans up old files before each run.
    """
    cleanup_zk_files()  # Clean up old files before starting
    # All EZKL outputs go to backend/zk/ezkl/
    ezkl_dir = ZK_DIR / "ezkl"
    ezkl_dir.mkdir(parents=True, exist_ok=True)  # Create dir if missing

    # Define all paths relative to ezkl_dir
    input_path = ZK_DIR / "build/input.json"
    model_path = BASE_DIR / "model/model_nn.onnx"
    compiled_model_circuit_path = ezkl_dir / "network.ezkl"
    settings_path = ezkl_dir / "settings.json"
    pk_path = ezkl_dir / "pk.key"
    vk_path = ezkl_dir / "vk.key"
    proof_path = ezkl_dir / "proof.json"
    witness_path = ezkl_dir / "witness.json"
    srs_path = ezkl_dir / "kzg18.srs"

    print("🔄 Starting EZKL pipeline...")

    def run(cmd, desc=None):
        print(f"\n📦 Running: {desc or cmd}")
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        print(result.stdout)
        if result.returncode != 0:
            print(result.stderr)
            raise RuntimeError(f"Command failed: {cmd}")

    try:

        run(
            f'ezkl gen-settings --model "{model_path}" --settings-path "{settings_path}"',
            "Generate settings",
        )
        run(
            f'ezkl calibrate-settings --model "{model_path}" --data "{input_path}" --settings-path "{settings_path}"',
            "Calibrate settings",
        )

        # 2. Compile circuit
        if not compiled_model_circuit_path.exists():
            run(
                f'ezkl compile-circuit --model "{model_path}" --compiled-circuit "{compiled_model_circuit_path}" --settings-path "{settings_path}"',
                "Compile model",
            )
        else:
            print("⚠️ Circuit already compiled.")

        # 3. Download SRS if not present
        if not srs_path.exists():
            run("ezkl get-srs", "Download SRS")
        else:
            print("⚠️ SRS already exists.")

        # 4. Setup keys
        if not pk_path.exists() or not vk_path.exists():
            run(
                f'ezkl setup --compiled-circuit "{compiled_model_circuit_path}" --vk-path "{vk_path}" --pk-path "{pk_path}" --srs-path "{srs_path}"',
                "Setup proving/verification keys",
            )
        else:
            print("⚠️ Proving and verification keys already exist, skipping setup.")

        # 5. Generate witness
        run(
            f'ezkl gen-witness --compiled-circuit "{compiled_model_circuit_path}" --data "{input_path}" --output "{witness_path}"',
            "Generate witness",
        )

        # 6. Generate proof
        run(
            f'ezkl prove --compiled-circuit "{compiled_model_circuit_path}" --pk-path "{pk_path}" --proof-path "{proof_path}" --witness "{witness_path}" --srs-path "{srs_path}"',
            "Generate proof",
        )

        # run(
        #     f"ezkl create-evm-verifier --vk-path {vk_path} --srs-path {srs_path}",
        #     "Generate evm verifier for proof",
        # )

        print("\n✅ ZK pipeline completed successfully!")
        print("Ready to verify proof...")
        print(f"Proof saved to: {proof_path}")
        print(f"Verification key saved to: {vk_path}")

        # Return proof JSON
        with open(proof_path) as pf:
            return json.load(pf)

    except Exception as e:
        print(f"\n❌ Pipeline failed: {e}")
        return {"error": str(e)}


def verify_proof_ezkl():
    original_dir = os.getcwd()  # Save current directory
    os.chdir(
        "/Users/bishalbist/Desktop/zkcticopy/backend/zk/ezkl"
    )  # Change to target dir

    try:
        cmd = ["ezkl", "verify", "--proof-path", "proof.json", "--vk-path", "vk.key"]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(result.stdout)
        return {"verified": True}
    except subprocess.CalledProcessError as e:
        print(f"❌ Verification failed: {e.stderr}")
        print(f"STDOUT: {e.stdout}")
        return {"verified": False, "error": e.stderr}
    finally:
        os.chdir(original_dir)  # Restore original directory

if __name__ == "__main__":
    cleanup_zk_files()