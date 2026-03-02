# MobileNetV2 Project

Proyek ini menggunakan arsitektur MobileNetV2 untuk keperluan machine learning / deep learning.

## 📁 Struktur Folder

```
MOBILENETV2/
│
├── model/                 # Menyimpan model yang sudah dilatih
├── data_clean/            # Data yang sudah dibersihkan (diignore git)
├── data_split/            # Data hasil pembagian train/val/test (diignore git)
├── raw_data/               # Data mentah asli (diignore git)
├── venv/                   # Virtual environment Python
├── .gitignore             # File untuk mengabaikan folder tertentu
├── pyvenv.cfg              # Konfigurasi virtual environment
└── README.md               # Dokumentasi proyek
```

## 🚀 Cara Penggunaan

### 1. Clone Repository
```bash
git clone <url-repository-anda>
cd MOBILENETV2
```

### 2. Aktifkan Virtual Environment
**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Persiapan Data
- Letakkan data mentah di folder `raw_data/`
- Jalankan script preprocessing untuk membersihkan data
- Data akan otomatis tersimpan di `data_clean/`
- Jalankan script splitting untuk membagi data di `data_split/`

### 5. Training Model
```bash
python train.py
```

### 6. Evaluasi Model
```bash
python evaluate.py
```

## 📝 Catatan Penting

- Folder `data_clean/`, `data_split/`, dan `raw_data/` tidak di-track oleh Git (sesuai konfigurasi `.gitignore`)
- Pastikan virtual environment sudah diaktifkan sebelum menjalankan script
- Sesuaikan path file sesuai dengan struktur folder yang ada

## 📊 Dataset

Jelaskan dataset yang digunakan:
- Sumber data ( Kaggle)
- Jumlah data ( Normal : 5000 , TBC : 5000)
- Pembagian data (75/15/10)
- Preprocessing yang dilakukan

## 🧠 Model Architecture

Proyek ini menggunakan **MobileNetV2**, arsitektur CNN yang ringan dan efisien untuk perangkat mobile. Karakteristik:
- Depthwise separable convolutions
- Linear bottlenecks
- Inverted residuals

## 📈 Hasil

| Metrik | Nilai |
|--------|-------|
| Accuracy | 1.00 |
| Precision | 1.00 |
| Recall | 1.00 |
| F1-Score | 1.00 |

*Update sesuai hasil training*

## 📚 Requirements

- Python 3.13
- TensorFlow / PyTorch (sesuai yang digunakan)
- NumPy
- Matplotlib


## 🤝 Kontribusi

Silakan buat pull request atau issue jika ingin berkontribusi.

## 📄 Lisensi

[Rafiq 23]
