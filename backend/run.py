import webbrowser
from threading import Timer
from app import app

def open_browser():
    webbrowser.open('http://localhost:5000')

if __name__ == '__main__':
    print("="*60)
    print("🚀 TB Detection Web App")
    print("="*60)
    print("\n📱 Aplikasi akan dibuka di browser")
    print("🌐 URL: http://localhost:5000")
    print("\n⚠️  Press Ctrl+C to stop")
    print("="*60)
    
    Timer(1, open_browser).start()
    app.run(debug=False, host='0.0.0.0', port=5000)
