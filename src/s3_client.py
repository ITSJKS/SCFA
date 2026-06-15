import os
import boto3
from botocore.exceptions import ClientError

class S3SyncClient:
    def __init__(self):
        self.access_key = os.environ.get("AWS_ACCESS_KEY_ID")
        self.secret_key = os.environ.get("AWS_SECRET_ACCESS_KEY")
        self.region = os.environ.get("AWS_REGION", "ap-south-1")
        self.bucket_name = os.environ.get("AWS_S3_BUCKET")
        self._s3_client = None

    def is_configured(self):
        """Checks if S3 environment variables are configured."""
        return bool(self.access_key and self.secret_key and self.bucket_name)

    def get_client(self):
        """Lazy-initializes and returns the boto3 client."""
        if not self.is_configured():
            return None
        if self._s3_client is None:
            try:
                self._s3_client = boto3.client(
                    "s3",
                    aws_access_key_id=self.access_key,
                    aws_secret_access_key=self.secret_key,
                    region_name=self.region
                )
            except Exception as e:
                print(f"Error initializing S3 client: {e}")
                return None
        return self._s3_client

    def test_connection(self):
        """Verifies access to the bucket."""
        client = self.get_client()
        if not client:
            return False, "S3 not configured or credentials missing."
        try:
            client.head_bucket(Bucket=self.bucket_name)
            return True, "Connection successful."
        except ClientError as e:
            error_code = e.response.get("Error", {}).get("Code", "Unknown")
            return False, f"Bucket access error (Code: {error_code}): {str(e)}"
        except Exception as e:
            return False, f"Connection failed: {str(e)}"

    def upload_file(self, local_path, s3_key):
        """Uploads a single file to S3."""
        client = self.get_client()
        if not client:
            print(f"S3 not configured. Skipping upload of {local_path}.")
            return False
        if not os.path.exists(local_path):
            print(f"Local file does not exist: {local_path}")
            return False
        try:
            client.upload_file(local_path, self.bucket_name, s3_key)
            print(f"Uploaded: {local_path} -> s3://{self.bucket_name}/{s3_key}")
            return True
        except Exception as e:
            print(f"Failed to upload {local_path} to S3: {e}")
            return False

    def download_file(self, s3_key, local_path):
        """Downloads a single file from S3."""
        client = self.get_client()
        if not client:
            print(f"S3 not configured. Skipping download of {s3_key}.")
            return False
        try:
            # Create local folders if they do not exist
            local_dir = os.path.dirname(local_path)
            if local_dir:
                os.makedirs(local_dir, exist_ok=True)
                
            client.download_file(self.bucket_name, s3_key, local_path)
            print(f"Downloaded: s3://{self.bucket_name}/{s3_key} -> {local_path}")
            return True
        except Exception as e:
            print(f"Failed to download s3://{self.bucket_name}/{s3_key} -> {local_path}: {e}")
            return False

    def delete_file(self, s3_key):
        """Deletes a single file from S3."""
        client = self.get_client()
        if not client:
            print(f"S3 not configured. Skipping deletion of {s3_key}.")
            return False
        try:
            client.delete_object(Bucket=self.bucket_name, Key=s3_key)
            print(f"Deleted from S3: s3://{self.bucket_name}/{s3_key}")
            return True
        except Exception as e:
            print(f"Failed to delete s3://{self.bucket_name}/{s3_key} from S3: {e}")
            return False

    def sync_directory(self, local_dir, s3_prefix, direction="push"):
        """
        Synchronizes a local directory with an S3 prefix in the specified direction.
        Utilizes bucket listing to avoid redundant uploads or downloads.
        """
        client = self.get_client()
        if not client:
            print(f"S3 client not configured. Cannot sync {local_dir}.")
            return False, "S3 not configured."

        # Normalize prefix to not end with slash but prefix keys correctly
        s3_prefix = s3_prefix.strip("/")
        
        # 1. List remote objects under prefix
        remote_objects = {}
        try:
            paginator = client.get_paginator("list_objects_v2")
            for page in paginator.paginate(Bucket=self.bucket_name, Prefix=s3_prefix):
                if "Contents" in page:
                    for obj in page["Contents"]:
                        key = obj["Key"]
                        size = obj["Size"]
                        remote_objects[key] = size
        except Exception as e:
            print(f"Failed to list remote objects under s3://{self.bucket_name}/{s3_prefix}: {e}")
            return False, f"Listing S3 objects failed: {str(e)}"

        if direction == "push":
            if not os.path.exists(local_dir):
                return True, "No local directory to push."
                
            uploaded_count = 0
            skipped_count = 0
            
            # Walk local directory
            for root, _, files in os.walk(local_dir):
                for file in files:
                    local_path = os.path.join(root, file)
                    # Get relative path from local_dir
                    rel_path = os.path.relpath(local_path, local_dir)
                    # Build S3 key
                    s3_key = f"{s3_prefix}/{rel_path}" if s3_prefix else rel_path
                    
                    local_size = os.path.getsize(local_path)
                    
                    # Upload if not present on S3 or if sizes differ
                    if s3_key not in remote_objects or remote_objects[s3_key] != local_size:
                        success = self.upload_file(local_path, s3_key)
                        if success:
                            uploaded_count += 1
                    else:
                        skipped_count += 1
                        
            print(f"Sync Push Complete: Uploaded {uploaded_count} files, skipped {skipped_count} unchanged files.")
            return True, f"Pushed {uploaded_count} files, skipped {skipped_count}."
            
        elif direction == "pull":
            downloaded_count = 0
            skipped_count = 0
            
            # Check S3 objects and download
            for s3_key, remote_size in remote_objects.items():
                # Get relative path from s3_prefix
                if s3_prefix:
                    # e.g., key is "data/contests/x.json", prefix is "data", rel path is "contests/x.json"
                    rel_path = s3_key[len(s3_prefix):].lstrip("/")
                else:
                    rel_path = s3_key
                    
                local_path = os.path.join(local_dir, rel_path)
                
                # Check if local file exists and sizes match
                local_exists = os.path.exists(local_path)
                local_size = os.path.getsize(local_path) if local_exists else -1
                
                if not local_exists or local_size != remote_size:
                    success = self.download_file(s3_key, local_path)
                    if success:
                        downloaded_count += 1
                else:
                    skipped_count += 1
                    
            print(f"Sync Pull Complete: Downloaded {downloaded_count} files, skipped {skipped_count} unchanged files.")
            return True, f"Pulled {downloaded_count} files, skipped {skipped_count}."
        
        else:
            return False, f"Invalid sync direction: {direction}"

    def delete_prefix(self, s3_prefix):
        """Deletes all objects under a prefix from S3."""
        client = self.get_client()
        if not client:
            return False
        s3_prefix = s3_prefix.strip("/")
        try:
            paginator = client.get_paginator("list_objects_v2")
            objects_to_delete = []
            for page in paginator.paginate(Bucket=self.bucket_name, Prefix=s3_prefix):
                if "Contents" in page:
                    for obj in page["Contents"]:
                        objects_to_delete.append({"Key": obj["Key"]})
            
            if not objects_to_delete:
                return True
                
            # S3 delete_objects supports up to 1000 keys per call
            for i in range(0, len(objects_to_delete), 1000):
                chunk = objects_to_delete[i:i+1000]
                client.delete_objects(
                    Bucket=self.bucket_name,
                    Delete={"Objects": chunk}
                )
            print(f"Deleted prefix from S3: s3://{self.bucket_name}/{s3_prefix} ({len(objects_to_delete)} objects)")
            return True
        except Exception as e:
            print(f"Failed to delete prefix s3://{self.bucket_name}/{s3_prefix} from S3: {e}")
            return False

