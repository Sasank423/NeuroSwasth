import boto3
import os

# Initialize S3 client
s3_client = boto3.client('s3')

# Mapping of file types to their respective S3 buckets
bucket_mapping = {
    "ct": "neuro-swasth-imaging-ct",
    "mri": "neuro-swasth-imaging-mri",
    "xray": "neuro-swasth-imaging-xray",
    "ultrasound": "neuro-swasth-imaging-ultrasound",
    "kft": "neuro-swasth-lab-kft",
    "lft": "neuro-swasth-lab-lft",
    "cbp": "neuro-swasth-lab-cbp",
    "blood-glucose": "neuro-swasth-lab-blood-glucose",
    "lipid-profile": "neuro-swasth-lab-lipid-profile",
    "ecg": "neuro-swasth-cardiology-ecg",
    "eeg": "neuro-swasth-cardiology-eeg",
    "echo": "neuro-swasth-cardiology-echo",
    "histopathology": "neuro-swasth-histopathology-reports"
}

def upload_to_s3(pdf_path, pdf_type):
    """Uploads a PDF file to the respective S3 bucket and returns its public URL."""
    
    # Validate if the type exists in our mapping
    pdf_type = pdf_type.lower()
    if pdf_type not in bucket_mapping:
        print(f"❌ Error: Unknown PDF type '{pdf_type}'. Allowed types: {list(bucket_mapping.keys())}")
        return None
    
    bucket_name = bucket_mapping[pdf_type]
    
    # Get the file name
    file_name = os.path.basename(pdf_path)

    try:
        # Upload the file
        s3_client.upload_file(pdf_path, bucket_name, file_name)
        
        # Generate file URL
        file_url = f"https://{bucket_name}.s3.amazonaws.com/{file_name}"
        
        print(f"✅ Successfully uploaded '{file_name}' to bucket '{bucket_name}'")
        print(f"🌐 File URL: {file_url}")
        return file_url
    except Exception as e:
        print(f"❌ Error uploading file: {e}")
        return None

# Example usage
if __name__ == "__main__":
    # Display available PDF types
    print("\n📌 Available PDF Types:")
    for key in bucket_mapping.keys():
        print(f"  - {key}")

    pdf_path = input("\nEnter the PDF file path: ").strip()
    pdf_type = input("Enter the PDF type from the list above: ").strip()
    
    if os.path.exists(pdf_path):
        file_url = upload_to_s3(pdf_path, pdf_type)
        if file_url:
            print(f"\n🔗 Access the uploaded file here: {file_url}")
    else:
        print("❌ Error: File does not exist!")
