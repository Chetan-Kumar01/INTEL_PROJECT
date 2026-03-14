"""
Test script for PDF ingestion service.

Usage:
    python test_pdf_ingestion.py
"""

import requests

# Test endpoint
url = "http://localhost:8000/upload_pdf"

# Test with a sample PDF
files = {
    'file': ('test.pdf', open('test.pdf', 'rb'), 'application/pdf')
}
data = {
    'patient_id': 'test-001'
}

print("Uploading PDF...")
response = requests.post(url, files=files, data=data)

if response.status_code == 200:
    result = response.json()
    print(f"✓ Success!")
    print(f"  Patient ID: {result['patient_id']}")
    print(f"  Total Chunks: {result['total_chunks']}")
    print(f"  Indexing Time: {result['indexing_time_ms']}ms")
else:
    print(f"✗ Error: {response.status_code}")
    print(response.json())
