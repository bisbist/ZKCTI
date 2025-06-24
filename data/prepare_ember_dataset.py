import numpy as np
import pandas as pd
import os

# Set paths
data_dir = "data"
n_features = 2381  # EMBER feature vector length
output_dir = os.path.join("backend", "data")
os.makedirs(output_dir, exist_ok=True)  # Ensure the output directory exists

# Utility to load and reshape binary float32 arrays
def load_features(path, n_features):
    data = np.fromfile(path, dtype=np.float32)
    n_rows = data.size // n_features
    return data.reshape((n_rows, n_features))

def load_labels(path):
    return np.fromfile(path, dtype=np.float32).astype(int)

# Load all datasets
X_train = load_features(os.path.join(data_dir, "X_train.dat"), n_features)
X_test = load_features(os.path.join(data_dir, "X_test.dat"), n_features)
y_train = load_labels(os.path.join(data_dir, "y_train.dat"))
y_test = load_labels(os.path.join(data_dir, "y_test.dat"))

# Sanity checks
assert X_train.shape[0] == len(y_train), "Mismatch in X_train and y_train rows"
assert X_test.shape[0] == len(y_test), "Mismatch in X_test and y_test rows"

# Column names
columns = [f"f{i}" for i in range(n_features)]

# Create DataFrames
df_train = pd.DataFrame(X_train, columns=columns)
df_train["label"] = y_train

df_test = pd.DataFrame(X_test, columns=columns)
df_test["label"] = y_test

# Output paths
train_path = os.path.join(output_dir, "ember_train.parquet")
test_path = os.path.join(output_dir, "ember_test.parquet")

# Save as Parquet in backend/data
df_train.to_parquet(train_path)
df_test.to_parquet(test_path)

print("✅ Saved:")
print(f"  → {train_path}")
print(f"  → {test_path}")

print(f"Train shape: {df_train.shape}, Test shape: {df_test.shape}")
print(f"Train labels distribution:\n{df_train['label'].value_counts()}")
print(f"Test labels distribution:\n{df_test['label'].value_counts()}")

# Display first few rows
print("\nFirst few rows of the training DataFrame:")
print(df_train.head())
print("\nFirst few rows of the test DataFrame:")
print(df_test.head())

# Display memory usage
print("\nMemory usage of DataFrames:")
print(f"Train DataFrame memory usage: {df_train.memory_usage(deep=True).sum() / (1024 ** 2):.2f} MB")
print(f"Test DataFrame memory usage: {df_test.memory_usage(deep=True).sum() / (1024 ** 2):.2f} MB")

