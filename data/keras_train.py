import time
import json
import pandas as pd
import numpy as np
from sklearn.metrics import classification_report
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential, save_model
from tensorflow.keras.layers import Dense, Dropout, Input
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
from pathlib import Path

# # Set random seeds for reproducibility
# np.random.seed(42)

print("Loading data...")
train_df = pd.read_parquet("ember_train.parquet")
test_df = pd.read_parquet("ember_test.parquet")

print("Data loaded. Splitting features and labels...")

# Filter out '-1' labels for binary classification
train_df = train_df[train_df["label"] != -1]
test_df = test_df[test_df["label"] != -1]

# Split features and labels
y_train = train_df.pop("label").values
X_train = train_df.values
print("Train data shape:", X_train.shape)
y_test = test_df.pop("label").values
X_test = test_df.values

# Show label distributions
print("\nTrain label distribution:\n", pd.Series(y_train).value_counts())
print("\nTest label distribution:\n", pd.Series(y_test).value_counts())

# Standardize features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Define neural network architecture
model = Sequential(
    [
        Input(shape=(X_train.shape[1],)),  # Proper input layer
        Dense(128, activation="relu"),
        Dropout(0.2),
        Dense(64, activation="relu"),
        Dropout(0.2),
        Dense(32, activation="relu"),
        Dense(1, activation="sigmoid"),
    ]
)

# Compile the model
model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss="binary_crossentropy",
    metrics=["accuracy"],
)

# Early stopping callback
early_stopping = EarlyStopping(
    monitor="val_loss", patience=3, restore_best_weights=True, verbose=1
)

# Training
print("\nStarting Neural Network training...")
start_time = time.time()

history = model.fit(
    X_train,
    y_train,
    validation_split=0.2,
    epochs=20,
    batch_size=256,
    callbacks=[early_stopping],
    verbose=1,
)

end_time = time.time()
print(f"Training completed in {end_time - start_time:.2f} seconds.")

# Define new path
output_path = Path(__file__).resolve().parent.parent / "backend" / "model"
output_path.mkdir(parents=True, exist_ok=True)  # Create dir if not exists

model_path = output_path / "model_nn.keras"
# Save trained model in modern Keras format
print("💾 Saving the model to 'model_nn.keras'...")
save_model(model, model_path)
print("Model saved successfully.")

# Evaluation
print("\nEvaluating model...")
y_pred = (model.predict(X_test) > 0.5).astype(int)
print(classification_report(y_test, y_pred, zero_division=0))

# Save sample input and prediction (fixed NumPy warning)
sample_input = X_test[0:1]  # Keep as 2D array
prediction = int(model.predict(sample_input)[0][0] > 0.5)  # Proper scalar extraction

sample_data = {
    "features": sample_input[0].tolist(),  # Convert to list
    "expected_output": prediction,
}
with open("sample_input_nn.json", "w") as f:
    json.dump(sample_data, f, indent=2)
print("\nSample input saved to 'sample_input_nn.json'")

# Save training history
history_data = {
    "loss": history.history["loss"],
    "val_loss": history.history["val_loss"],
    "accuracy": history.history["accuracy"],
    "val_accuracy": history.history["val_accuracy"],
}
with open("training_history.json", "w") as f:
    json.dump(history_data, f, indent=2)

import tensorflow as tf
import tf2onnx

# Load your trained Keras model
model = tf.keras.models.load_model("model_nn.keras")

# Wrap into a functional model (if it was Sequential)
input_tensor = tf.keras.Input(shape=(2381,), name="input")  # 2381 features
output_tensor = model(input_tensor)
functional_model = tf.keras.Model(inputs=input_tensor, outputs=output_tensor)

# Define input spec with batch size = 1
input_spec = (tf.TensorSpec([1, 2381], tf.float32, name="input"),)

model_onnx_path = output_path / "model_nn.onnx"
# Export to ONNX
model_proto, _ = tf2onnx.convert.from_keras(
    functional_model, input_signature=input_spec, output_path=model_onnx_path
)

print("✅ ONNX model exported successfully with fixed shape [1, 2381]")
